import { employeeService } from '../services/employeeService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const employeeController = {
  /**
   * GET /api/v1/employees/me OR GET /api/v1/employees/:employeeId/profile
   */
  async getProfile(req, res, next) {
    try {
      // Derive identity from JWT token. If param specified and user is employee, ensure match
      let targetId = req.user.employeeId;
      if (req.params.employeeId && req.params.employeeId !== 'me') {
        if (req.user.role === 'employee' && req.params.employeeId.toUpperCase() !== req.user.employeeId) {
          return sendError(res, 'Access denied: You can only view your own profile.', 403);
        }
        targetId = req.params.employeeId;
      }

      const profile = await employeeService.getProfile(targetId);
      return res.status(200).json(profile);
    } catch (err) {
      return sendError(res, err.message, 404);
    }
  },

  /**
   * PUT /api/v1/employees/me OR PUT /api/v1/employees/:employeeId/profile
   */
  async updateProfile(req, res, next) {
    try {
      let targetId = req.user.employeeId;
      if (req.params.employeeId && req.params.employeeId !== 'me') {
        if (req.user.role === 'employee' && req.params.employeeId.toUpperCase() !== req.user.employeeId) {
          return sendError(res, 'Access denied: You can only edit your own profile.', 403);
        }
        targetId = req.params.employeeId;
      }

      const updated = await employeeService.updateProfile(targetId, req.body);
      return res.status(200).json(updated);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  /**
   * GET /api/v1/employees/me/security
   */
  async getSecurityInfo(req, res, next) {
    try {
      const profile = await employeeService.getProfile(req.user.employeeId);
      return sendSuccess(res, profile.securityInfo, 'Security info fetched', 200);
    } catch (err) {
      return sendError(res, err.message, 404);
    }
  },

  /**
   * POST /api/v1/employees/me/profile-picture
   */
  async uploadProfilePicture(req, res, next) {
    try {
      let avatarUrl = req.body.avatarUrl;
      if (req.file) {
        avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }

      if (!avatarUrl) {
        return sendError(res, 'Please provide an image file or avatar URL', 400);
      }

      const updated = await employeeService.updateAvatar(req.user.employeeId, avatarUrl);
      return res.status(200).json({ success: true, avatarUrl, profile: updated });
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },
};
