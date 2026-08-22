import { Notification } from '../models/Notification.js';

export const notificationService = {
  /**
   * Fetch notification list for employee (including global system alerts)
   */
  async getNotifications(employeeId) {
    const cleanId = employeeId ? employeeId.toUpperCase() : '';
    const query = cleanId ? { $or: [{ employeeId: cleanId }, { employeeId: '' }, { employeeId: { $exists: false } }] } : {};
    const items = await Notification.find(query).sort({ timestamp: -1 }).lean();
    return items;
  },

  /**
   * Get unread notifications count
   */
  async getUnreadCount(employeeId) {
    const cleanId = employeeId ? employeeId.toUpperCase() : '';
    const query = {
      isRead: false,
      ...(cleanId ? { $or: [{ employeeId: cleanId }, { employeeId: '' }, { employeeId: { $exists: false } }] } : {}),
    };
    const count = await Notification.countDocuments(query);
    return count;
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId) {
    const item = await Notification.findOneAndUpdate(
      { id: notificationId },
      { $set: { isRead: true } },
      { new: true }
    );
    return item ? item.toObject() : null;
  },

  /**
   * Mark all notifications as read for employee
   */
  async markAllAsRead(employeeId) {
    const cleanId = employeeId ? employeeId.toUpperCase() : '';
    const query = cleanId ? { $or: [{ employeeId: cleanId }, { employeeId: '' }] } : {};
    const res = await Notification.updateMany(query, { $set: { isRead: true } });
    return res.modifiedCount;
  },

  /**
   * Clear all notifications
   */
  async clearAll(employeeId) {
    const cleanId = employeeId ? employeeId.toUpperCase() : '';
    if (!cleanId) {
      await Notification.deleteMany({});
    } else {
      await Notification.deleteMany({ employeeId: cleanId });
    }
    return true;
  },

  /**
   * Helper to dispatch and persist notification
   */
  async createNotification({ employeeId = '', title, message, category = 'system', actionUrl = '' }) {
    const newNotif = new Notification({
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      employeeId: employeeId ? employeeId.toUpperCase() : '',
      title,
      message,
      category,
      actionUrl,
      timestamp: new Date().toISOString(),
      isRead: false,
    });
    await newNotif.save();
    return newNotif.toObject();
  },
};
