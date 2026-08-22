import { query } from 'express-validator';

export const attendanceFilterValidator = [
  query('month')
    .optional()
    .isInt({ min: 0, max: 11 })
    .withMessage('Month must be a number between 0 (Jan) and 11 (Dec)'),
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be a valid 4-digit year'),
  query('from')
    .optional()
    .isISO8601()
    .withMessage('From date must be a valid ISO date (YYYY-MM-DD)'),
  query('to')
    .optional()
    .isISO8601()
    .withMessage('To date must be a valid ISO date (YYYY-MM-DD)'),
];
