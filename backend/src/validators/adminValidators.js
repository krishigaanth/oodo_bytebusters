import { body } from 'express-validator';

export const createEmployeeValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('workEmail').isEmail().withMessage('Valid work email is required'),
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('role')
    .optional()
    .isIn(['employee', 'admin', 'hr'])
    .withMessage('Role must be employee, admin, or hr'),
  body('joiningDate')
    .optional()
    .isISO8601()
    .withMessage('Joining date must be a valid date'),
  body('monthlyWage')
    .optional()
    .isNumeric()
    .withMessage('Monthly wage must be a number'),
];

export const updateEmployeeStatusValidator = [
  body('status')
    .isIn(['active', 'suspended'])
    .withMessage('Status must be either active or suspended'),
];

export const reviewLeaveValidator = [
  body('comments')
    .optional()
    .trim(),
];
