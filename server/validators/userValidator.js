import { body } from 'express-validator';

export const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('phone').optional().trim(),
  body('avatar').optional().trim().isURL().withMessage('Avatar must be a valid URL'),
  body('role').custom((value) => {
    if (value) {
      throw new Error('Customers are not allowed to change their own role');
    }
    return true;
  }),
];
