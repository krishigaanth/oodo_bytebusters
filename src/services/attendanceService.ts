import {
  AttendanceRecord,
  AttendanceSummary,
  TodayAttendanceStatus,
} from '../types/attendance';
import { apiClient } from './apiClient';

export const attendanceService = {
  /**
   * Fetch today's current check-in / check-out status
   * Backend Endpoint: GET /api/v1/attendance/today
   */
  async getTodayStatus(employeeId?: string): Promise<TodayAttendanceStatus> {
    const status = await apiClient.get<TodayAttendanceStatus>('/attendance/today', {
      employeeId,
    });
    return status;
  },

  /**
   * Check in for the day
   * Backend Endpoint: POST /api/v1/attendance/check-in
   */
  async checkIn(employeeId?: string): Promise<TodayAttendanceStatus> {
    const status = await apiClient.post<TodayAttendanceStatus>('/attendance/check-in', {
      employeeId,
    });
    return status;
  },

  /**
   * Check out for the day and calculate hours worked
   * Backend Endpoint: POST /api/v1/attendance/check-out
   */
  async checkOut(employeeId?: string): Promise<TodayAttendanceStatus> {
    const status = await apiClient.post<TodayAttendanceStatus>('/attendance/check-out', {
      employeeId,
    });
    return status;
  },

  /**
   * Fetch attendance records with optional date filters
   * Backend Endpoint: GET /api/v1/attendance
   */
  async getAttendance(
    employeeId?: string,
    filters?: { month?: number; year?: number; from?: string; to?: string }
  ): Promise<AttendanceRecord[]> {
    const records = await apiClient.get<AttendanceRecord[]>('/attendance', {
      employeeId,
      ...filters,
    });
    return records;
  },

  /**
   * Fetch aggregated attendance metrics for summary cards
   * Backend Endpoint: GET /api/v1/attendance/summary
   */
  async getAttendanceSummary(employeeId?: string): Promise<AttendanceSummary> {
    const summary = await apiClient.get<AttendanceSummary>('/attendance/summary', {
      employeeId,
    });
    return summary;
  },
};
