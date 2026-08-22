import { AppNotification } from '../types/notification';
import { apiClient } from './apiClient';

export const notificationService = {
  /**
   * Fetch notifications list for employee
   * Backend Endpoint: GET /api/v1/notifications
   */
  async getNotifications(employeeId?: string): Promise<AppNotification[]> {
    const data = await apiClient.get<AppNotification[]>('/notifications', {
      employeeId,
    });
    return data || [];
  },

  /**
   * Mark a single notification as read
   * Backend Endpoint: PATCH /api/v1/notifications/:id/read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   * Backend Endpoint: POST /api/v1/notifications/mark-all-read
   */
  async markAllAsRead(employeeId?: string): Promise<void> {
    await apiClient.post('/notifications/mark-all-read', {
      employeeId,
    });
  },

  /**
   * Clear all notifications
   * Backend Endpoint: DELETE /api/v1/notifications
   */
  async clearAll(employeeId?: string): Promise<void> {
    await apiClient.delete('/notifications', {
      employeeId,
    });
  },
};
