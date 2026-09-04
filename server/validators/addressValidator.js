import { body } from 'express-validator';

export const addressValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('addressLine').trim().notEmpty().withMessage('Address line is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required')
    .isPostalCode('IN')
    .withMessage('Please enter a valid 6-digit Indian pincode'),
  body('type').optional().isIn(['Home', 'Work', 'Other']).withMessage('Address type must be Home, Work, or Other'),
  body('isDefault').optional().isBoolean(),
];
