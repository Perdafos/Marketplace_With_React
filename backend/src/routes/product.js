import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import * as productController from '../controllers/product.js';

const router = express.Router();

router.get('/', productController.list);
router.get('/:id', productController.getById);
router.post('/', authenticate, authorize('seller','admin'), productController.create);
router.put('/:id', authenticate, authorize('seller','admin'), productController.update);
router.delete('/:id', authenticate, authorize('seller','admin'), productController.remove);

export default router;
