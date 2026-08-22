import { ApplyLeavePayload, LeaveBalance, LeaveRequest } from '../types/leave';
import { apiClient } from './apiClient';
import { INITIAL_LEAVE_BALANCES, INITIAL_LEAVE_REQUESTS } from '../mocks/mockLeaves';

export const leaveService = {
  /**
   * Fetch current available and consumed leave balances
   * Backend Endpoint: GET /api/v1/leaves/balances
   */
  async getLeaveBalance(employeeId?: string): Promise<LeaveBalance[]> {
    try {
      const balances = await apiClient.get<LeaveBalance[]>('/leaves/balances', {
        employeeId,
      });
      if (balances && Array.isArray(balances) && balances.length > 0) {
        return balances;
      }
    } catch (err) {
      console.warn('[leaveService] API fetch failed, loading default leave balances.');
    }
    return INITIAL_LEAVE_BALANCES;
  },

  /**
   * Fetch leave requests history for the employee
   * Backend Endpoint: GET /api/v1/leaves/requests
   */
  async getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
    try {
      const requests = await apiClient.get<LeaveRequest[]>('/leaves/requests', {
        employeeId,
      });
      if (requests && Array.isArray(requests) && requests.length > 0) {
        return requests;
      }
    } catch (err) {
      console.warn('[leaveService] API fetch failed, loading default leave requests.');
    }
    return INITIAL_LEAVE_REQUESTS;
  },

  /**
   * Submit a new leave application
   * Backend Endpoint: POST /api/v1/leaves/apply
   */
  async applyLeave(employeeId: string, payload: ApplyLeavePayload): Promise<LeaveRequest> {
    try {
      const newRequest = await apiClient.post<LeaveRequest>('/leaves/apply', {
        employeeId,
        ...payload,
      });
      if (newRequest) return newRequest;
    } catch (err) {
      console.warn('[leaveService] API POST failed, creating local leave request.');
    }

    const created: LeaveRequest = {
      id: `LV-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      employeeId: employeeId || 'EMP001',
      leaveType: payload.leaveType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      totalDays: payload.totalDays,
      reason: payload.reason,
      attachmentName: payload.attachmentName,
      status: 'Pending',
      appliedOn: new Date().toISOString(),
    };

    INITIAL_LEAVE_REQUESTS.unshift(created);
    return created;
  },
};
