import { Router } from 'express';
import { getMockUsers, generateData } from '../controllers/mockController.js';

const router = Router();

router.get('/mockingusers/:qty?', getMockUsers);

router.post('/generateData', generateData);

export default router;