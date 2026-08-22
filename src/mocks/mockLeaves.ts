import { LeaveBalance, LeaveRequest } from '../types/leave';

export const INITIAL_LEAVE_BALANCES: LeaveBalance[] = [
  {
    leaveType: 'Paid Leave',
    totalQuota: 18,
    used: 5,
    available: 13,
    colorClass: 'from-indigo-500 to-brand-600',
    description: 'Accrued annual vacation & paid time off'
  },
  {
    leaveType: 'Sick Leave',
    totalQuota: 12,
    used: 3,
    available: 9,
    colorClass: 'from-rose-500 to-pink-600',
    description: 'Medical emergencies & health recovery'
  },
  {
    leaveType: 'Casual Leave',
    totalQuota: 8,
    used: 2,
    available: 6,
    colorClass: 'from-amber-500 to-orange-600',
    description: 'Personal urgent matters and errands'
  },
  {
    leaveType: 'Unpaid Leave',
    totalQuota: 30,
    used: 0,
    available: 30,
    colorClass: 'from-slate-500 to-slate-700',
    description: 'Extended leave without compensation'
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LV-2026-003',
    employeeId: 'EMP001',
    leaveType: 'Paid Leave',
    startDate: '2026-09-14',
    endDate: '2026-09-18',
    totalDays: 5,
    reason: 'Family vacation trip to Yosemite National Park.',
    attachmentName: 'flight_tickets_confirmation.pdf',
    status: 'Pending',
    appliedOn: '2026-08-20T14:32:00Z',
  },
  {
    id: 'LV-2026-002',
    employeeId: 'EMP001',
    leaveType: 'Sick Leave',
    startDate: '2026-08-12',
    endDate: '2026-08-12',
    totalDays: 1,
    reason: 'Viral fever and doctor-prescribed rest.',
    attachmentName: 'medical_certificate.pdf',
    status: 'Approved',
    appliedOn: '2026-08-11T18:10:00Z',
    reviewedBy: 'Sarah Jenkins (VP of Product)',
    reviewedOn: '2026-08-12T08:30:00Z',
    reviewerComments: 'Get well soon Alex. Take care!'
  },
  {
    id: 'LV-2026-001',
    employeeId: 'EMP001',
    leaveType: 'Casual Leave',
    startDate: '2026-07-03',
    endDate: '2026-07-03',
    totalDays: 1,
    reason: 'Home maintenance and appliance installation.',
    status: 'Approved',
    appliedOn: '2026-06-28T09:15:00Z',
    reviewedBy: 'Sarah Jenkins (VP of Product)',
    reviewedOn: '2026-06-29T10:00:00Z',
    reviewerComments: 'Approved.'
  },
  {
    id: 'LV-2026-000',
    employeeId: 'EMP001',
    leaveType: 'Paid Leave',
    startDate: '2026-05-02',
    endDate: '2026-05-06',
    totalDays: 5,
    reason: 'Personal travel overlap during major product launch window.',
    status: 'Rejected',
    appliedOn: '2026-04-20T11:45:00Z',
    reviewedBy: 'Sarah Jenkins (VP of Product)',
    reviewedOn: '2026-04-22T14:00:00Z',
    reviewerComments: 'Required on-site for Q2 Major Release deployment. Please reschedule after May 15.'
  }
];
