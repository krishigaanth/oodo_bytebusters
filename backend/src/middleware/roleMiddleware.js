import { sendError } from '../utils/responseHandler.js';

/**
 * Role-based authorization middleware
 * @param  {...string} roles - e.g. 'employee', 'admin', 'hr'
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Unauthenticated request', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access restricted: This action requires one of the following roles: [${roles.join(', ')}]`,
        403
      );
    }

    next();
  };
};
