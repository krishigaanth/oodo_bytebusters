import { sendError } from '../utils/responseHandler.js';

/**
 * Global centralized error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[Unhandled Server Error]: ${err.stack || err.message}`);

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    return sendError(res, `A record with this ${field} already exists.`, 409);
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, messages.join(', '), 400);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid authentication token signature', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication token has expired', 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error occurred';

  return sendError(res, message, statusCode);
};
