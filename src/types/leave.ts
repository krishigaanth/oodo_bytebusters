export type LeaveType = 'Paid Leave' | 'Sick Leave' | 'Casual Leave' | 'Unpaid Leave';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface LeaveBalance {
  leaveType: LeaveType;
  totalQuota: number;
  used: number;
  available: number;
  colorClass: string;
  description: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  reason: string;
  attachmentName?: string;
  status: LeaveStatus;
  appliedOn: string; // ISO date string
  reviewedBy?: string;
  reviewedOn?: string;
  reviewerComments?: string;
}

export interface ApplyLeavePayload {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  attachmentName?: string;
}
