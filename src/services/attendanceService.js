/**
 * Dayflow HRMS - Attendance Service
 * Isolated data layer mimicking Odoo 'hr.attendance' model
 */
import { INITIAL_ATTENDANCE_RECORDS } from './mockData';

const STORAGE_KEY = 'dayflow_attendance_data';

function getStoredAttendance() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse attendance data', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ATTENDANCE_RECORDS));
  return INITIAL_ATTENDANCE_RECORDS;
}

function saveAttendance(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export const attendanceService = {
  /**
   * Get all attendance records
   */
  async getAllAttendance() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...getStoredAttendance()]);
      }, 150);
    });
  },

  /**
   * Get attendance for a specific employee
   */
  async getAttendanceByEmployee(employeeId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const all = getStoredAttendance();
        const records = all.filter(r => r.employeeId === employeeId);
        resolve(records);
      }, 150);
    });
  },

  /**
   * Record a check-in / check-out
   */
  async recordPunch(employeeId, type = 'checkin') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getStoredAttendance();
        const record = list.find(r => r.employeeId === employeeId);
        const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        if (record) {
          if (type === 'checkin') {
            record.checkIn = now;
            record.status = 'Present';
          } else {
            record.checkOut = now;
            record.status = 'Checked Out';
          }
          saveAttendance(list);
          resolve(record);
        }
      }, 200);
    });
  }
};
