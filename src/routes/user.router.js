import express from 'express';
import { isLoggedIn, isLoggedOut } from '../middlewares/auth.js';
import { validateUserRegistration } from '../middlewares/validation.middleware.js';
import {
  registerUser,
  getUserProfile,
  logoutUser,
  loginUser
} from '../controllers/userController.js';
import passport from '../middlewares/passport.config.js';
import UserModel from '../models/user.model.js';

const router = express.Router();

router.post('/register', isLoggedOut, validateUserRegistration, registerUser);
router.get('/perfil', isLoggedIn, getUserProfile);
router.get('/logout', isLoggedIn, logoutUser);
router.post('/login', isLoggedOut, loginUser);

// Obtener el carrito del usuario autenticado
router.get('/my-cart', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate('cart');
    if (!user || !user.cart) {
      return res.status(404).json({ error: 'Carrito no encontrado para este usuario' });
    }
    res.status(200).json({ cartId: user.cart._id.toString() });
  } catch (error) {
    console.error('Error al obtener el carrito del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
