export type NotificationCategory = 'attendance' | 'leave' | 'payroll' | 'announcement' | 'system';

export interface AppNotification {
  id: string;
  employeeId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string; // ISO date string
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}
