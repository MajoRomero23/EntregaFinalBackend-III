import CartService from "../services/cartService.js";
import TicketService from "../services/ticketService.js";

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const userId = req.user.id;

    const cart = await CartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

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
};
