import express from 'express';
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/addressController.js';
import { addressValidator } from '../validators/addressValidator.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAddresses);
router.get('/:id', getAddressById);
router.post('/', addressValidator, validateRequest, createAddress);
router.put('/:id', addressValidator, validateRequest, updateAddress);
router.delete('/:id', deleteAddress);

export default router;
