import express from 'express';
import { isLoggedIn, isLoggedOut } from '../middlewares/auth.js';
import { validateUserRegistration } from '../middlewares/validation.middleware.js';
import {
  registerUser,
  getUserProfile,
  logoutUser,
  loginUser
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', isLoggedOut, validateUserRegistration, registerUser);
router.get('/perfil', isLoggedIn, getUserProfile);
router.get('/logout', isLoggedIn, logoutUser);
router.post('/login', isLoggedOut, loginUser);

export default router;
