export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave' | 'Holiday' | 'Weekend';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // e.g. "09:15 AM"
  checkOut: string | null; // e.g. "06:30 PM"
  workHours: number; // e.g. 8.5
  extraHours: number; // e.g. 0.5
  status: AttendanceStatus;
  notes?: string;
  isOvertime?: boolean;
}

export interface TodayAttendanceStatus {
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  currentWorkDurationHours: number;
  status: AttendanceStatus | 'Not Checked In';
  activeRecordId: string | null;
}

export interface AttendanceSummary {
  daysPresent: number;
  daysAbsent: number;
  leaveDays: number;
  totalWorkingDays: number;
  totalWorkingHours: number;
  extraHours: number;
  averageWorkingHoursPerDay: number;
}
