import { authService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const authController = {
  /**
   * POST /api/v1/auth/login
   */
  async login(req, res, next) {
    try {
      const { loginId, password } = req.body;
      const { user, token } = await authService.login(loginId, password);
      return res.status(200).json({
        success: true,
        user,
        token,
        message: 'Login successful',
      });
    } catch (err) {
      return sendError(res, err.message, 401);
    }
  },

  /**
   * GET /api/v1/auth/me
   */
  async getCurrentUser(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.employeeId);
      return res.status(200).json({
        success: true,
        user: {
          ...user,
          token: req.headers.authorization?.split(' ')[1],
        },
      });
    } catch (err) {
      return sendError(res, err.message, 404);
    }
  },

  /**
   * POST /api/v1/auth/change-password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user.employeeId, currentPassword, newPassword);
      return sendSuccess(res, null, result.message, 200);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  /**
   * POST /api/v1/auth/logout
   */
  async logout(req, res, next) {
    try {
      return sendSuccess(res, null, 'Logged out successfully', 200);
    } catch (err) {
      next(err);
    }
  },
};
