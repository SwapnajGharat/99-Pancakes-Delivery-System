import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { createCategoryValidator, updateCategoryValidator } from '../validators/categoryValidator.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

router.post('/', protect, adminOnly, createCategoryValidator, validateRequest, createCategory);
router.put('/:id', protect, adminOnly, updateCategoryValidator, validateRequest, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;
