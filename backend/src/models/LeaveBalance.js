import mongoose from 'mongoose';

const leaveBalanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    leaveType: {
      type: String,
      enum: ['Paid Leave', 'Sick Leave', 'Casual Leave', 'Unpaid Leave'],
      required: true,
    },
    totalQuota: {
      type: Number,
      required: true,
      default: 0,
    },
    used: {
      type: Number,
      required: true,
      default: 0,
    },
    available: {
      type: Number,
      required: true,
      default: 0,
    },
    colorClass: {
      type: String,
      default: 'from-indigo-500 to-brand-600',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

leaveBalanceSchema.index({ employeeId: 1, leaveType: 1 }, { unique: true });

export const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);
