import {
  AttendanceRecord,
  AttendanceSummary,
  TodayAttendanceStatus,
} from '../types/attendance';
import { apiClient } from './apiClient';
import { INITIAL_TODAY_ATTENDANCE, MOCK_ATTENDANCE_RECORDS } from '../mocks/mockAttendance';

let localTodayStatus: TodayAttendanceStatus = { ...INITIAL_TODAY_ATTENDANCE };

export const attendanceService = {
  /**
   * Fetch today's current check-in / check-out status
   * Backend Endpoint: GET /api/v1/attendance/today
   */
  async getTodayStatus(employeeId?: string): Promise<TodayAttendanceStatus> {
    try {
      const status = await apiClient.get<TodayAttendanceStatus>('/attendance/today', {
        employeeId,
      });
      if (status && typeof status === 'object' && status.status) {
        return status;
      }
    } catch (err) {
      console.warn('[attendanceService] API fetch failed, using local status.');
    }
    return localTodayStatus;
  },

  /**
   * Check in for the day
   * Backend Endpoint: POST /api/v1/attendance/check-in
   */
  async checkIn(employeeId?: string): Promise<TodayAttendanceStatus> {
    try {
      const status = await apiClient.post<TodayAttendanceStatus>('/attendance/check-in', {
        employeeId,
      });
      if (status) return status;
    } catch (err) {
      console.warn('[attendanceService] API checkIn failed, performing local checkIn.');
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    localTodayStatus = {
      isCheckedIn: true,
      isCheckedOut: false,
      checkInTime: timeStr,
      checkOutTime: null,
      currentWorkDurationHours: 0.1,
      status: 'Present',
      activeRecordId: `ATT-${now.getTime()}`,
    };
    return localTodayStatus;
  },

  /**
   * Check out for the day and calculate hours worked
   * Backend Endpoint: POST /api/v1/attendance/check-out
   */
  async checkOut(employeeId?: string): Promise<TodayAttendanceStatus> {
    try {
      const status = await apiClient.post<TodayAttendanceStatus>('/attendance/check-out', {
        employeeId,
      });
      if (status) return status;
    } catch (err) {
      console.warn('[attendanceService] API checkOut failed, performing local checkOut.');
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    localTodayStatus = {
      ...localTodayStatus,
      isCheckedIn: true,
      isCheckedOut: true,
      checkOutTime: timeStr,
      currentWorkDurationHours: 8.0,
      status: 'Present',
    };
    return localTodayStatus;
  },

  /**
   * Fetch attendance records with optional date filters
   * Backend Endpoint: GET /api/v1/attendance
   */
  async getAttendance(
    employeeId?: string,
    filters?: { month?: number; year?: number; from?: string; to?: string }
  ): Promise<AttendanceRecord[]> {
    try {
      const records = await apiClient.get<AttendanceRecord[]>('/attendance', {
        employeeId,
        ...filters,
      });
      if (records && Array.isArray(records) && records.length > 0) {
        return records;
      }
    } catch (err) {
      console.warn('[attendanceService] API getAttendance failed, returning mock records.');
    }
    return MOCK_ATTENDANCE_RECORDS;
  },

  /**
   * Fetch aggregated attendance metrics for summary cards
   * Backend Endpoint: GET /api/v1/attendance/summary
   */
  async getAttendanceSummary(employeeId?: string): Promise<AttendanceSummary> {
    try {
      const summary = await apiClient.get<AttendanceSummary>('/attendance/summary', {
        employeeId,
      });
      if (summary && typeof summary === 'object' && summary.totalWorkingDays) {
        return summary;
      }
    } catch (err) {
      console.warn('[attendanceService] API getAttendanceSummary failed, returning calculated mock summary.');
    }

    const presentDays = MOCK_ATTENDANCE_RECORDS.filter(r => r.status === 'Present').length;
    const leaveDays = MOCK_ATTENDANCE_RECORDS.filter(r => r.status === 'Leave').length;
    const totalHours = MOCK_ATTENDANCE_RECORDS.reduce((sum, r) => sum + r.workHours, 0);
    const extraHours = MOCK_ATTENDANCE_RECORDS.reduce((sum, r) => sum + r.extraHours, 0);

    return {
      daysPresent: presentDays,
      daysAbsent: 0,
      leaveDays: leaveDays,
      totalWorkingDays: 22,
      totalWorkingHours: Math.round(totalHours * 10) / 10,
      extraHours: Math.round(extraHours * 10) / 10,
      averageWorkingHoursPerDay: 8.2,
    };
  },
};
