import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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
    startDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    endDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    attachmentName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    appliedOn: {
      type: String,
      default: () => new Date().toISOString(),
    },
    reviewedBy: {
      type: String,
      default: '',
    },
    reviewedOn: {
      type: String,
      default: '',
    },
    reviewerComments: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
