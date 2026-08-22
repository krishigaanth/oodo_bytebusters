import { body } from 'express-validator';

export const applyLeaveValidator = [
  body('leaveType')
    .isIn(['Paid Leave', 'Sick Leave', 'Casual Leave', 'Unpaid Leave'])
    .withMessage('Valid leave type is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date in YYYY-MM-DD format'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date in YYYY-MM-DD format')
    .custom((endDate, { req }) => {
      if (new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error('End date cannot be earlier than start date');
      }
      return true;
    }),
  body('totalDays')
    .isFloat({ min: 0.5 })
    .withMessage('Total days must be at least 0.5 day'),
  body('reason')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Please provide a descriptive reason (minimum 5 characters)'),
];
