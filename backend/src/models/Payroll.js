import mongoose from 'mongoose';

const salaryComponentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    monthlyAmount: { type: Number, required: true },
    annualAmount: { type: Number, required: true },
    type: { type: String, enum: ['earning', 'deduction'], required: true },
    isTaxable: { type: Boolean, default: true },
  },
  { _id: false }
);

const payslipItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    month: { type: String, required: true }, // e.g. "October 2026"
    monthKey: { type: String, required: true }, // e.g. "2026-10"
    paymentDate: { type: String, required: true },
    basicSalary: { type: Number, required: true },
    hra: { type: Number, required: true },
    specialAllowance: { type: Number, default: 0 },
    conveyanceAllowance: { type: Number, default: 0 },
    medicalAllowance: { type: Number, default: 0 },
    totalEarnings: { type: Number, required: true },

    pfDeduction: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    incomeTaxTds: { type: Number, default: 0 },
    healthInsurance: { type: Number, default: 0 },
    totalDeductions: { type: Number, required: true },

    netPayable: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Direct Deposit / Wire' },
    bankAccountMasked: { type: String, default: 'Silicon Valley Bank (••••4892)' },
    status: { type: String, enum: ['Paid', 'Processing'], default: 'Paid' },
    workingDays: { type: Number, default: 22 },
    paidDays: { type: Number, default: 22 },
    leavesTaken: { type: Number, default: 0 },
  },
  { _id: false }
);

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    annualCtc: { type: Number, required: true },
    monthlyGross: { type: Number, required: true },
    monthlyNet: { type: Number, required: true },
    totalAnnualDeductions: { type: Number, required: true },
    currencySymbol: { type: String, default: '$' },
    earningsBreakdown: { type: [salaryComponentSchema], default: [] },
    deductionsBreakdown: { type: [salaryComponentSchema], default: [] },
    payslips: { type: [payslipItemSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Payroll = mongoose.model('Payroll', payrollSchema);
