import { ApplyLeavePayload, LeaveBalance, LeaveRequest } from '../types/leave';
import { apiClient } from './apiClient';

export const leaveService = {
  /**
   * Fetch current available and consumed leave balances
   * Backend Endpoint: GET /api/v1/leaves/balances
   */
  async getLeaveBalance(employeeId?: string): Promise<LeaveBalance[]> {
    const balances = await apiClient.get<LeaveBalance[]>('/leaves/balances', {
      employeeId,
    });
    return balances;
  },

  /**
   * Fetch leave requests history for the employee
   * Backend Endpoint: GET /api/v1/leaves/requests
   */
  async getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
    const requests = await apiClient.get<LeaveRequest[]>('/leaves/requests', {
      employeeId,
    });
    return requests;
  },

  /**
   * Submit a new leave application
   * Backend Endpoint: POST /api/v1/leaves/apply
   */
  async applyLeave(employeeId: string, payload: ApplyLeavePayload): Promise<LeaveRequest> {
    const newRequest = await apiClient.post<LeaveRequest>('/leaves/apply', {
      employeeId,
      ...payload,
    });
    return newRequest;
  },
};
