import { body } from 'express-validator';

export const createProductValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category ID is required'),
  body('image').notEmpty().withMessage('Primary image URL is required').isURL().withMessage('Image must be a valid URL'),
  body('isVeg').optional().isBoolean().withMessage('isVeg must be a boolean'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock cannot be negative'),
  body('featured').optional().isBoolean().withMessage('featured must be a boolean'),
];

export const updateProductValidator = [
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock cannot be negative'),
  body('isVeg').optional().isBoolean(),
  body('featured').optional().isBoolean(),
];
