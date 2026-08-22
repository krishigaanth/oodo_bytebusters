import { attendanceService } from '../services/attendanceService.js';
import { sendError } from '../utils/responseHandler.js';

export const attendanceController = {
  /**
   * GET /api/v1/attendance/today OR /api/v1/attendance/me/today
   */
  async getTodayStatus(req, res, next) {
    try {
      const employeeId = req.query.employeeId || req.user.employeeId;
      const status = await attendanceService.getTodayStatus(employeeId);
      return res.status(200).json(status);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * POST /api/v1/attendance/check-in
   */
  async checkIn(req, res, next) {
    try {
      const employeeId = req.body.employeeId || req.user.employeeId;
      const status = await attendanceService.checkIn(employeeId);
      return res.status(200).json(status);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  /**
   * POST /api/v1/attendance/check-out
   */
  async checkOut(req, res, next) {
    try {
      const employeeId = req.body.employeeId || req.user.employeeId;
      const status = await attendanceService.checkOut(employeeId);
      return res.status(200).json(status);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  /**
   * GET /api/v1/attendance OR /api/v1/attendance/me
   */
  async getAttendance(req, res, next) {
    try {
      const employeeId = req.query.employeeId || req.user.employeeId;
      const filters = {
        month: req.query.month !== undefined ? Number(req.query.month) : undefined,
        year: req.query.year !== undefined ? Number(req.query.year) : undefined,
        from: req.query.from,
        to: req.query.to,
      };

      const records = await attendanceService.getAttendance(employeeId, filters);
      return res.status(200).json(records);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * GET /api/v1/attendance/summary OR /api/v1/attendance/me/summary
   */
  async getAttendanceSummary(req, res, next) {
    try {
      const employeeId = req.query.employeeId || req.user.employeeId;
      const summary = await attendanceService.getAttendanceSummary(employeeId);
      return res.status(200).json(summary);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },
};
