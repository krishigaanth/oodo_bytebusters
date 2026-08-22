import { body } from 'express-validator';

export const loginValidator = [
  body('loginId')
    .trim()
    .notEmpty()
    .withMessage('Employee Login ID is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];
