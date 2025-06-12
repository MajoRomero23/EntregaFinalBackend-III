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

export default router;
