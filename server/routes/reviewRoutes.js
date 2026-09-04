import express from 'express';
import { updateReview, deleteReview } from '../controllers/reviewController.js';
import { reviewValidator } from '../validators/reviewValidator.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.put('/:id', reviewValidator, validateRequest, updateReview);
router.delete('/:id', deleteReview);

export default router;
