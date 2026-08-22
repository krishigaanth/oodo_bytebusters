import { PayrollSummary, PayslipItem } from '../types/payroll';
import { apiClient } from './apiClient';
import { MOCK_PAYROLL_DATA } from '../mocks/mockPayroll';

export const payrollService = {
  /**
   * Fetch employee payroll summary and breakdown
   * Backend Endpoint: GET /api/v1/payroll/summary
   */
  async getPayroll(employeeId?: string): Promise<PayrollSummary> {
    const id = employeeId || 'EMP001';
    try {
      const summary = await apiClient.get<PayrollSummary>('/payroll/summary', {
        employeeId: id,
      });
      if (summary && typeof summary === 'object' && summary.annualCtc) {
        return summary;
      }
    } catch (err) {
      console.warn('[payrollService] API fetch failed, using fallback mock payroll data.');
    }
    return MOCK_PAYROLL_DATA[id] || MOCK_PAYROLL_DATA['EMP001'];
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
      if (payslip) return payslip;
    } catch (err) {
      console.warn('[payrollService] API payslip fetch failed, searching mock records.');
    }

    const summary = MOCK_PAYROLL_DATA[employeeId] || MOCK_PAYROLL_DATA['EMP001'];
    const found = summary.payslips.find(p => p.id === payslipId);
    return found || null;
  },
};
