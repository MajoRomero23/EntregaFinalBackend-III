import express from 'express';
import { 
    getProducts, 
    getProductsById, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    generateTestProducts, 
    deleteAllProducts 
} from '../controllers/productsController.js';

import { authorizeRoles } from '../middlewares/auth.js';
import passport from '../middlewares/passport.config.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:pid', getProductsById);

// Sólo el administrador puede modificar productos:
router.post('/', passport.authenticate('jwt', { session: false }), authorizeRoles('admin'), addProduct);
router.put('/:pid', passport.authenticate('jwt', { session: false }), authorizeRoles('admin'), updateProduct);
router.delete('/:pid', passport.authenticate('jwt', { session: false }), authorizeRoles('admin'), deleteProduct);
router.post('/generate', passport.authenticate('jwt', { session: false }), authorizeRoles('admin'), generateTestProducts);
router.delete('/deleteAll', passport.authenticate('jwt', { session: false }), authorizeRoles('admin'), deleteAllProducts);

export default router;
