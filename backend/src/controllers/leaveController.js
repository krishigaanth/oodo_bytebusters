import { leaveService } from '../services/leaveService.js';
import { sendError } from '../utils/responseHandler.js';

export const leaveController = {
  /**
   * GET /api/v1/leaves/balances OR /api/v1/leaves/me/balance
   */
  async getBalances(req, res, next) {
    try {
      const employeeId = req.query.employeeId || req.user.employeeId;
      const balances = await leaveService.getLeaveBalances(employeeId);
      return res.status(200).json(balances);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * GET /api/v1/leaves/requests OR /api/v1/leaves/me
   */
  async getRequests(req, res, next) {
    try {
      const employeeId = req.query.employeeId || req.user.employeeId;
      const requests = await leaveService.getLeaveRequests(employeeId);
      return res.status(200).json(requests);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * POST /api/v1/leaves/apply OR /api/v1/leaves
   */
  async applyLeave(req, res, next) {
    try {
      const employeeId = req.body.employeeId || req.user.employeeId;
      const result = await leaveService.applyLeave(employeeId, req.body);
      return res.status(201).json(result);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  /**
   * PUT /api/v1/leaves/:id/cancel
   */
  async cancelLeave(req, res, next) {
    try {
      const result = await leaveService.cancelLeave(req.user.employeeId, req.params.id);
      return res.status(200).json(result);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },
};
