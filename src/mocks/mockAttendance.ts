import { AttendanceRecord, TodayAttendanceStatus } from '../types/attendance';

export const INITIAL_TODAY_ATTENDANCE: TodayAttendanceStatus = {
  isCheckedIn: false,
  isCheckedOut: false,
  checkInTime: null,
  checkOutTime: null,
  currentWorkDurationHours: 0,
  status: 'Not Checked In',
  activeRecordId: null,
};

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'ATT-20260821',
    employeeId: 'EMP001',
    date: '2026-08-21',
    checkIn: '09:05 AM',
    checkOut: '06:15 PM',
    workHours: 8.5,
    extraHours: 0.5,
    status: 'Present',
    notes: 'Regular day + release deployment sync',
    isOvertime: true
  },
  {
    id: 'ATT-20260820',
    employeeId: 'EMP001',
    date: '2026-08-20',
    checkIn: '09:12 AM',
    checkOut: '05:45 PM',
    workHours: 8.0,
    extraHours: 0.0,
    status: 'Present',
    notes: 'Sprint planning & feature refinement'
  },
  {
    id: 'ATT-20260819',
    employeeId: 'EMP001',
    date: '2026-08-19',
    checkIn: '08:58 AM',
    checkOut: '06:30 PM',
    workHours: 8.7,
    extraHours: 0.7,
    status: 'Present',
    notes: 'Client tech demo architecture review',
    isOvertime: true
  },
  {
    id: 'ATT-20260818',
    employeeId: 'EMP001',
    date: '2026-08-18',
    checkIn: '09:30 AM',
    checkOut: '01:30 PM',
    workHours: 4.0,
    extraHours: 0.0,
    status: 'Half Day',
    notes: 'Doctor appointment in afternoon'
  },
  {
    id: 'ATT-20260815',
    employeeId: 'EMP001',
    date: '2026-08-15',
    checkIn: null,
    checkOut: null,
    workHours: 0.0,
    extraHours: 0.0,
    status: 'Holiday',
    notes: 'National Holiday'
  },
  {
    id: 'ATT-20260814',
    employeeId: 'EMP001',
    date: '2026-08-14',
    checkIn: '09:00 AM',
    checkOut: '05:30 PM',
    workHours: 8.0,
    extraHours: 0.0,
    status: 'Present',
    notes: 'Frontend unit test coverage upgrade'
  },
  {
    id: 'ATT-20260813',
    employeeId: 'EMP001',
    date: '2026-08-13',
    checkIn: '09:10 AM',
    checkOut: '05:40 PM',
    workHours: 8.0,
    extraHours: 0.0,
    status: 'Present',
    notes: 'Design review with UX team'
  },
  {
    id: 'ATT-20260812',
    employeeId: 'EMP001',
    date: '2026-08-12',
    checkIn: null,
    checkOut: null,
    workHours: 0.0,
    extraHours: 0.0,
    status: 'Leave',
    notes: 'Approved Sick Leave'
  },
  {
    id: 'ATT-20260811',
    employeeId: 'EMP001',
    date: '2026-08-11',
    checkIn: '08:45 AM',
    checkOut: '06:00 PM',
    workHours: 8.5,
    extraHours: 0.5,
    status: 'Present',
    notes: 'Code refactoring & performance tuning',
    isOvertime: true
  },
  {
    id: 'ATT-20260810',
    employeeId: 'EMP001',
    date: '2026-08-10',
    checkIn: '09:02 AM',
    checkOut: '05:35 PM',
    workHours: 8.0,
    extraHours: 0.0,
    status: 'Present',
    notes: 'Monday all-hands meeting'
  },
  {
    id: 'ATT-20260807',
    employeeId: 'EMP001',
    date: '2026-08-07',
    checkIn: '09:15 AM',
    checkOut: '05:50 PM',
    workHours: 8.0,
    extraHours: 0.0,
    status: 'Present',
    notes: 'Design tokens sync'
  },
  {
    id: 'ATT-20260806',
    employeeId: 'EMP001',
    date: '2026-08-06',
    checkIn: '09:00 AM',
    checkOut: '05:30 PM',
    workHours: 8.0,
    extraHours: 0.0,
    status: 'Present',
    notes: 'API integration tests'
  },
  {
    id: 'ATT-20260805',
    employeeId: 'EMP001',
    date: '2026-08-05',
    checkIn: '09:05 AM',
    checkOut: '06:05 PM',
    workHours: 8.2,
    extraHours: 0.2,
    status: 'Present',
    notes: 'Bug bash session'
  },
  {
    id: 'ATT-20260804',
    employeeId: 'EMP001',
    date: '2026-08-04',
    checkIn: '09:20 AM',
    checkOut: '05:40 PM',
    workHours: 7.8,
    extraHours: 0.0,
    status: 'Present',
    notes: 'Architecture spec review'
  },
  {
    id: 'ATT-20260803',
    employeeId: 'EMP001',
    date: '2026-08-03',
    checkIn: '08:50 AM',
    checkOut: '05:30 PM',
    workHours: 8.1,
    extraHours: 0.1,
    status: 'Present',
    notes: 'Monthly kick-off'
  }
];
