import { PayrollSummary, PayslipItem } from '../types/payroll';
import { apiClient } from './apiClient';

export const payrollService = {
  /**
   * Fetch employee payroll summary and breakdown
   * Backend Endpoint: GET /api/v1/payroll/summary
   */
  async getPayroll(employeeId?: string): Promise<PayrollSummary> {
    const summary = await apiClient.get<PayrollSummary>('/payroll/summary', {
      employeeId,
    });
    return summary;
  },

  /**
   * Fetch a specific payslip record
   * Backend Endpoint: GET /api/v1/payroll/payslips/:payslipId
   */
  async getPayslip(employeeId: string, payslipId: string): Promise<PayslipItem | null> {
    try {
      const payslip = await apiClient.get<PayslipItem>(`/payroll/payslips/${payslipId}`, {
        employeeId,
      });
      return payslip;
    } catch {
      return null;
    }
  },
};
