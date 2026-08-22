import { payrollService } from '../services/payrollService.js';
import { sendError } from '../utils/responseHandler.js';

export const payrollController = {
  /**
   * GET /api/v1/payroll/summary OR /api/v1/payroll/me
   */
  async getPayrollSummary(req, res, next) {
    try {
      const employeeId = req.query.employeeId || req.user.employeeId;
      const payroll = await payrollService.getPayroll(employeeId);
      return res.status(200).json(payroll);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * GET /api/v1/payroll/payslips/:payslipId
   */
  async getPayslip(req, res, next) {
    try {
      const employeeId = req.query.employeeId || req.user.employeeId;
      const payslip = await payrollService.getPayslip(employeeId, req.params.payslipId);
      if (!payslip) {
        return sendError(res, 'Payslip not found', 404);
      }
      return res.status(200).json(payslip);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },
};
