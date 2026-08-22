import { LeaveBalance } from '../models/LeaveBalance.js';
import { LeaveRequest } from '../models/LeaveRequest.js';
import { Notification } from '../models/Notification.js';

export const leaveService = {
  /**
   * Fetch current leave balances for employee
   */
  async getLeaveBalances(employeeId) {
    const cleanId = employeeId.toUpperCase();
    const balances = await LeaveBalance.find({ employeeId: cleanId }).lean();
    return balances;
  },

  /**
   * Fetch leave requests history for employee
   */
  async getLeaveRequests(employeeId) {
    const cleanId = employeeId.toUpperCase();
    const requests = await LeaveRequest.find({ employeeId: cleanId }).sort({ appliedOn: -1 }).lean();
    return requests;
  },

  /**
   * Submit a new leave application
   */
  async applyLeave(employeeId, payload) {
    const cleanId = employeeId.toUpperCase();

    if (!payload.startDate || !payload.endDate) {
      throw new Error('Please select both start and end dates.');
    }

    if (payload.endDate < payload.startDate) {
      throw new Error('End date cannot be earlier than start date.');
    }

    if (!payload.reason || payload.reason.trim().length < 5) {
      throw new Error('Please provide a descriptive reason (minimum 5 characters).');
    }

    // Check balance
    const balance = await LeaveBalance.findOne({
      employeeId: cleanId,
      leaveType: payload.leaveType,
    });

    if (balance && balance.available < payload.totalDays) {
      throw new Error(
        `Insufficient ${payload.leaveType} balance. You requested ${payload.totalDays} day(s), but only ${balance.available} day(s) remain.`
      );
    }

    // Check for overlapping active leaves
    const overlap = await LeaveRequest.findOne({
      employeeId: cleanId,
      status: { $in: ['Pending', 'Approved'] },
      $or: [
        { startDate: { $lte: payload.endDate }, endDate: { $gte: payload.startDate } },
      ],
    });

    if (overlap) {
      throw new Error(
        `You already have a ${overlap.status} leave request (${overlap.startDate} to ${overlap.endDate}) covering this period.`
      );
    }

    const newRequest = new LeaveRequest({
      id: `LV-${Date.now().toString().slice(-6)}`,
      employeeId: cleanId,
      leaveType: payload.leaveType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      totalDays: payload.totalDays,
      reason: payload.reason.trim(),
      attachmentName: payload.attachmentName || '',
      status: 'Pending',
      appliedOn: new Date().toISOString(),
    });

    await newRequest.save();

    // Deduct available and increment used in balance
    if (balance) {
      balance.available = Math.max(0, balance.available - payload.totalDays);
      balance.used += payload.totalDays;
      await balance.save();
    }

    // Create confirmation notification
    await Notification.create({
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      employeeId: cleanId,
      title: 'Leave Application Submitted',
      message: `Your ${payload.leaveType} request for ${payload.startDate} to ${payload.endDate} (${payload.totalDays} days) has been submitted for supervisor approval.`,
      category: 'leave',
      actionUrl: '/time-off',
      timestamp: new Date().toISOString(),
    });

    return newRequest.toObject();
  },

  /**
   * Cancel a pending leave request
   */
  async cancelLeave(employeeId, leaveId) {
    const cleanId = employeeId.toUpperCase();
    const request = await LeaveRequest.findOne({ id: leaveId, employeeId: cleanId });

    if (!request) {
      throw new Error('Leave request not found');
    }

    if (request.status !== 'Pending') {
      throw new Error(`Cannot cancel a leave request with status: ${request.status}`);
    }

    request.status = 'Cancelled';
    await request.save();

    // Restore balance
    const balance = await LeaveBalance.findOne({
      employeeId: cleanId,
      leaveType: request.leaveType,
    });
    if (balance) {
      balance.available += request.totalDays;
      balance.used = Math.max(0, balance.used - request.totalDays);
      await balance.save();
    }

    return request.toObject();
  },
};
