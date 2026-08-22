import { AppNotification } from '../types/notification';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-001',
    employeeId: 'EMP001',
    title: 'Leave Request Approved',
    message: 'Your Sick Leave for August 12, 2026 has been approved by Sarah Jenkins.',
    category: 'leave',
    timestamp: '2026-08-12T08:30:00Z',
    isRead: false,
    actionUrl: '/time-off'
  },
  {
    id: 'NOTIF-002',
    employeeId: 'EMP001',
    title: 'July 2026 Payslip Released',
    message: 'Your salary payslip for July 2026 is now available for download.',
    category: 'payroll',
    timestamp: '2026-07-31T17:00:00Z',
    isRead: false,
    actionUrl: '/payroll'
  },
  {
    id: 'NOTIF-003',
    employeeId: 'EMP001',
    title: 'Company Holiday Reminder',
    message: 'Dayflow offices will be closed on Friday, August 15 in observance of National Holiday.',
    category: 'announcement',
    timestamp: '2026-08-10T10:00:00Z',
    isRead: true,
    actionUrl: '/attendance'
  },
  {
    id: 'NOTIF-004',
    employeeId: 'EMP001',
    title: 'Quarterly HR Performance Review',
    message: 'Q3 Self-assessment cycle starts next Monday. Please review your goals.',
    category: 'system',
    timestamp: '2026-08-01T09:00:00Z',
    isRead: true,
    actionUrl: '/profile'
  }
];
