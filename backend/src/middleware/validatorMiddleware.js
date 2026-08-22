import { validationResult } from 'express-validator';
import { sendError } from '../utils/responseHandler.js';

/**
 * Express-validator middleware checking validation results
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return sendError(res, errorDetails[0]?.message || 'Validation failed', 400, errorDetails);
  }
  next();
};
