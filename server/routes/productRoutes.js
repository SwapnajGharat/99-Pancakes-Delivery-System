import express from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { getProductReviews, createReview } from '../controllers/reviewController.js';
import { createProductValidator, updateProductValidator } from '../validators/productValidator.js';
import { reviewValidator } from '../validators/reviewValidator.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Reviews nested routes
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', protect, reviewValidator, validateRequest, createReview);

// Public product routes
router.get('/', getProducts);
router.get('/:id', getProductByIdOrSlug);

// Admin only product routes
router.post('/', protect, adminOnly, createProductValidator, validateRequest, createProduct);
router.put('/:id', protect, adminOnly, updateProductValidator, validateRequest, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
