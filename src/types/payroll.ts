export interface SalaryComponent {
  name: string;
  monthlyAmount: number;
  annualAmount: number;
  type: 'earning' | 'deduction';
  isTaxable?: boolean;
}

export interface PayslipItem {
  id: string;
  month: string; // e.g. "October 2026"
  monthKey: string; // e.g. "2026-10"
  paymentDate: string;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  totalEarnings: number;
  
  pfDeduction: number;
  professionalTax: number;
  incomeTaxTds: number;
  healthInsurance: number;
  totalDeductions: number;

  netPayable: number;
  paymentMethod: string;
  bankAccountMasked: string;
  status: 'Paid' | 'Processing';
  workingDays: number;
  paidDays: number;
  leavesTaken: number;
}

export interface PayrollSummary {
  annualCtc: number;
  monthlyGross: number;
  monthlyNet: number;
  totalAnnualDeductions: number;
  currencySymbol: string;
  earningsBreakdown: SalaryComponent[];
  deductionsBreakdown: SalaryComponent[];
  payslips: PayslipItem[];
}
