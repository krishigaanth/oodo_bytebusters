import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      index: true,
    },
    employeeId: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    checkIn: {
      type: String, // e.g. "09:15 AM"
      default: null,
    },
    checkOut: {
      type: String, // e.g. "06:30 PM"
      default: null,
    },
    workHours: {
      type: Number,
      default: 0,
    },
    extraHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Half Day', 'Leave', 'Holiday', 'Weekend'],
      default: 'Present',
    },
    notes: {
      type: String,
      default: '',
    },
    isOvertime: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring one attendance record per employee per calendar date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
