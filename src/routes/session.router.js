import express from 'express';
import passport from '../middlewares/passport.config.js';
import {
  registerSession,
  loginSession,
  currentSession,
  logoutSession
} from '../controllers/sessionController.js';

const router = express.Router();

router.post('/register', registerSession);
router.post('/login', loginSession);
router.get('/current', passport.authenticate('jwt', { session: false }), currentSession);
router.get('/logout', logoutSession);

router.get('/debug-users', async (req, res) => {
  try {
    const { default: UserModel } = await import('../models/user.model.js');
    const users = await UserModel.find().lean();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

export default router;
