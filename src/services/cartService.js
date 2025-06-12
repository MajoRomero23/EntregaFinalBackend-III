import Cart from '../models/cart.js';
import User from '../models/user.model.js';

class CartService {
  async getCartById(cartId) {
    return await Cart.findById(cartId).populate('products.product');
  }

  async getCartByUserId(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const cart = await Cart.findById(user.cart).populate('products.product');
    if (!cart) throw new Error('Carrito no encontrado');

    return cart;
  }

  async addProductToCart(cartId, productId, userId) {
    let cart = await Cart.findById(cartId);
  
    if (!cart) {
      cart = new Cart({ _id: cartId, user: userId, products: [] });
    }
  
    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
  
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
  
    await cart.save();
    return cart;
  }

  async processCartPurchase(cartId) {
    const cart = await this.getCartById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    let totalAmount = 0;
    const purchasedProducts = [];
    const failedProducts = [];

    for (const item of cart.products) {
      const product = item.product;
      if (!product) continue;

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        purchasedProducts.push({ product: product._id, quantity: item.quantity });
        totalAmount += product.price * item.quantity;
      } else {
        failedProducts.push(product._id.toString());
      }
    }

    return { purchasedProducts, failedProducts, totalAmount };
  }

  async updateCartAfterPurchase(cartId, failedProducts) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = cart.products.filter(item =>
      !failedProducts.includes(item.product.toString())
    );

    await cart.save();
    return cart;
  }
}

export default new CartService();
