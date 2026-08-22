import { Payroll } from '../models/Payroll.js';

export const payrollService = {
  /**
   * Fetch employee payroll summary and breakdown
   */
  async getPayroll(employeeId) {
    const cleanId = employeeId.toUpperCase();
    let record = await Payroll.findOne({ employeeId: cleanId }).lean();

    if (!record) {
      // Fallback default mock payroll calculation if employee was just created
      record = await this.generateDefaultPayroll(cleanId, 11250);
    }

    return record;
  },

  /**
   * Fetch a specific payslip record
   */
  async getPayslip(employeeId, payslipId) {
    const cleanId = employeeId.toUpperCase();
    const summary = await this.getPayroll(cleanId);
    const slip = summary.payslips?.find((p) => p.id === payslipId);
    return slip || null;
  },

  /**
   * Calculate salary components based on monthly wage
   */
  calculateBreakdown(monthlyWage = 11250) {
    const basicSalary = Number((monthlyWage * 0.5).toFixed(2)); // 50%
    const hra = Number((monthlyWage * 0.25).toFixed(2)); // 25%
    const specialAllowance = Number((monthlyWage * 0.15).toFixed(2)); // 15%
    const conveyanceAllowance = 500;
    const medicalAllowance = Number(Math.max(0, monthlyWage - basicSalary - hra - specialAllowance - conveyanceAllowance).toFixed(2));

    const totalEarnings = monthlyWage;

    // Deductions
    const pfDeduction = Number((basicSalary * 0.12).toFixed(2)); // 12% of basic
    const professionalTax = 100;
    const incomeTaxTds = Number((monthlyWage * 0.11).toFixed(2)); // ~11% tax
    const healthInsurance = 250;

    const totalDeductions = Number((pfDeduction + professionalTax + incomeTaxTds + healthInsurance).toFixed(2));
    const monthlyNet = Number((totalEarnings - totalDeductions).toFixed(2));
    const annualCtc = Number((monthlyWage * 12).toFixed(2));
    const totalAnnualDeductions = Number((totalDeductions * 12).toFixed(2));

    const earningsBreakdown = [
      { name: 'Basic Salary', monthlyAmount: basicSalary, annualAmount: basicSalary * 12, type: 'earning', isTaxable: true },
      { name: 'House Rent Allowance (HRA)', monthlyAmount: hra, annualAmount: hra * 12, type: 'earning', isTaxable: true },
      { name: 'Special Allowance', monthlyAmount: specialAllowance, annualAmount: specialAllowance * 12, type: 'earning', isTaxable: true },
      { name: 'Conveyance Allowance', monthlyAmount: conveyanceAllowance, annualAmount: conveyanceAllowance * 12, type: 'earning', isTaxable: false },
      { name: 'Medical Allowance', monthlyAmount: medicalAllowance, annualAmount: medicalAllowance * 12, type: 'earning', isTaxable: false },
    ];

    const deductionsBreakdown = [
      { name: 'Provident Fund (401k / PF)', monthlyAmount: pfDeduction, annualAmount: pfDeduction * 12, type: 'deduction' },
      { name: 'Income Tax (TDS / Federal)', monthlyAmount: incomeTaxTds, annualAmount: incomeTaxTds * 12, type: 'deduction' },
      { name: 'Health & Dental Insurance', monthlyAmount: healthInsurance, annualAmount: healthInsurance * 12, type: 'deduction' },
      { name: 'Professional State Tax', monthlyAmount: professionalTax, annualAmount: professionalTax * 12, type: 'deduction' },
    ];

    return {
      annualCtc,
      monthlyGross: totalEarnings,
      monthlyNet,
      totalAnnualDeductions,
      currencySymbol: '$',
      earningsBreakdown,
      deductionsBreakdown,
    };
  },

  /**
   * Helper to seed/generate payroll document for a user
   */
  async generateDefaultPayroll(employeeId, monthlyWage = 11250) {
    const cleanId = employeeId.toUpperCase();
    const breakdown = this.calculateBreakdown(monthlyWage);

    const payslips = [
      {
        id: 'PS-2026-07',
        month: 'July 2026',
        monthKey: '2026-07',
        paymentDate: '2026-07-31',
        basicSalary: breakdown.earningsBreakdown[0].monthlyAmount,
        hra: breakdown.earningsBreakdown[1].monthlyAmount,
        specialAllowance: breakdown.earningsBreakdown[2].monthlyAmount,
        conveyanceAllowance: breakdown.earningsBreakdown[3].monthlyAmount,
        medicalAllowance: breakdown.earningsBreakdown[4].monthlyAmount,
        totalEarnings: breakdown.monthlyGross,
        pfDeduction: breakdown.deductionsBreakdown[0].monthlyAmount,
        incomeTaxTds: breakdown.deductionsBreakdown[1].monthlyAmount,
        healthInsurance: breakdown.deductionsBreakdown[2].monthlyAmount,
        professionalTax: breakdown.deductionsBreakdown[3].monthlyAmount,
        totalDeductions: Number((breakdown.monthlyGross - breakdown.monthlyNet).toFixed(2)),
        netPayable: breakdown.monthlyNet,
        paymentMethod: 'Direct Deposit / Wire',
        bankAccountMasked: 'Silicon Valley Bank (••••4892)',
        status: 'Paid',
        workingDays: 22,
        paidDays: 22,
        leavesTaken: 1,
      },
    ];

    const payrollDoc = new Payroll({
      employeeId: cleanId,
      ...breakdown,
      payslips,
    });

    await payrollDoc.save();
    return payrollDoc.toObject();
  },
};
