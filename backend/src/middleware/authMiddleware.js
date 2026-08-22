import { verifyToken } from '../utils/jwtUtils.js';
import { User } from '../models/User.js';
import { sendError } from '../utils/responseHandler.js';

/**
 * Authentication middleware verifying Bearer JWT
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication token missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return sendError(res, 'Authentication token expired or invalid', 401);
    }

    const user = await User.findOne({ employeeId: decoded.employeeId.toUpperCase() });
    if (!user) {
      return sendError(res, 'User associated with this token was not found', 401);
    }

    if (user.status !== 'active') {
      return sendError(res, 'User account is deactivated. Please contact your HR administrator.', 403);
    }

    // Attach authenticated identity to request
    req.user = {
      id: user._id,
      employeeId: user.employeeId,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };

    next();
  } catch (error) {
    return sendError(res, 'Authentication failed', 500);
  }
};
