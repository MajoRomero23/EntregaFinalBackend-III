import express from 'express';
import TicketService from '../services/ticketService.js';
import CartService from '../services/cartService.js';
import passport from '../middlewares/passport.config.js';
import { authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.post(
  '/:cid/purchase',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('user'), // Solo usuarios pueden comprar
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
