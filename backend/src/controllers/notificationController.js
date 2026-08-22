import { notificationService } from '../services/notificationService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const notificationController = {
  /**
   * GET /api/v1/notifications
   */
  async getNotifications(req, res, next) {
    try {
      const employeeId = req.query.employeeId || req.user.employeeId;
      const notifications = await notificationService.getNotifications(employeeId);
      return res.status(200).json(notifications);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * GET /api/v1/notifications/unread-count
   */
  async getUnreadCount(req, res, next) {
    try {
      const count = await notificationService.getUnreadCount(req.user.employeeId);
      return sendSuccess(res, { count }, 'Unread count fetched', 200);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * PATCH /api/v1/notifications/:id/read OR PUT /api/v1/notifications/:id/read
   */
  async markAsRead(req, res, next) {
    try {
      const updated = await notificationService.markAsRead(req.params.id);
      return res.status(200).json({ success: true, notification: updated });
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * POST /api/v1/notifications/mark-all-read OR PUT /api/v1/notifications/read-all
   */
  async markAllAsRead(req, res, next) {
    try {
      const employeeId = req.body.employeeId || req.user.employeeId;
      const count = await notificationService.markAllAsRead(employeeId);
      return sendSuccess(res, { modifiedCount: count }, 'All notifications marked as read', 200);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * DELETE /api/v1/notifications
   */
  async clearAll(req, res, next) {
    try {
      const employeeId = req.user.employeeId;
      await notificationService.clearAll(employeeId);
      return sendSuccess(res, null, 'All notifications cleared', 200);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },
};
