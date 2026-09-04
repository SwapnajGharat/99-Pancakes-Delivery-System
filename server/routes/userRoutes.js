import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { updateProfileValidator } from '../validators/userValidator.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfileValidator, validateRequest, updateProfile);

export default router;
