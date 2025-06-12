import express from 'express';
import TicketService from '../services/ticketService.js';
import CartService from '../services/cartService.js';
import passport from '../middlewares/passport.config.js';
import { authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// Carrito del usuario autenticado
router.get(
  '/my-cart',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('user'),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await CartService.getCartByUserId(userId);
      if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
      res.status(200).json({ cartId: cart._id });
    } catch (error) {
      console.error("Error obteniendo el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// Agregar producto al carrito
router.post(
  '/:cid/product/:pid',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('user'),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const result = await CartService.addProductToCart(cid, pid, req.user.id);
      res.status(201).json({ message: "Producto añadido al carrito", result });
    } catch (error) {
      console.error("Error al añadir producto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// Finalizar compra y generar ticket
router.post(
  '/:cid/purchase',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('user'),
  async (req, res) => {
    try {
      const { cid } = req.params;
      const userId = req.user.id;

      const cart = await CartService.getCartById(cid);
      if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

      const { purchasedProducts, failedProducts, totalAmount } = await CartService.processCartPurchase(cid);

      if (purchasedProducts.length === 0) {
        return res.status(400).json({
          error: "No se pudo completar la compra",
          failedProducts
        });
      }

      const ticket = await TicketService.createTicket(userId, purchasedProducts, totalAmount);
      await CartService.updateCartAfterPurchase(cid, failedProducts);

      res.status(201).json({
        message: "Compra realizada con éxito",
        ticket,
        failedProducts: failedProducts.length > 0 ? failedProducts : null
      });
    } catch (error) {
      console.error("Error en la compra:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

export default router;
