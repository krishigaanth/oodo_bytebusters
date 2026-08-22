import React from 'react';
import { Download, Printer, Sparkles } from 'lucide-react';
import { PayslipItem } from '../../types/payroll';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface PayslipModalProps {
  payslip: PayslipItem | null;
  isOpen: boolean;
  onClose: () => void;
  currencySymbol?: string;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  payslip,
  isOpen,
  onClose,
  currencySymbol = '$',
}) => {
  const { user } = useAuth();
  const { success } = useToast();

  if (!payslip) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    success(`Downloading ${payslip.month} Payslip (PDF)...`, 'Download Started');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Salary Slip — ${payslip.month}`}
      subtitle={`Reference Document #${payslip.id}`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print Statement
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleDownloadPdf} leftIcon={<Download className="w-4 h-4" />}>
              Download PDF
            </Button>
          </div>
        </div>
      }
    >
      <div className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-6 text-xs text-slate-700">
        {/* Company Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Dayflow Technologies Inc.
              </h3>
              <p className="text-[11px] text-slate-500">
                742 Evergreen Plaza, Suite 800, San Francisco, CA 94107
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              PAYSLIP CONFIRMED
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Payment Date: {payslip.paymentDate}</p>
          </div>
        </div>

        {/* Employee Particulars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Employee Name</span>
            <p className="font-bold text-slate-900 mt-0.5">{user?.name || 'Alex Morgan'}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Employee ID</span>
            <p className="font-bold font-mono text-slate-900 mt-0.5">{user?.employeeId || 'EMP001'}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Department</span>
            <p className="font-bold text-slate-900 mt-0.5">Core Product Eng</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Payment Account</span>
            <p className="font-medium text-slate-700 mt-0.5">{payslip.bankAccountMasked}</p>
          </div>
        </div>

        {/* Attendance Days Summary */}
        <div className="grid grid-cols-3 gap-3 text-center p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-indigo-950 font-medium">
          <div>
            <span className="text-[11px] text-indigo-800/80">Working Days</span>
            <p className="font-bold text-sm text-indigo-950">{payslip.workingDays}</p>
          </div>
          <div>
            <span className="text-[11px] text-indigo-800/80">Paid Days</span>
            <p className="font-bold text-sm text-indigo-950">{payslip.paidDays}</p>
          </div>
          <div>
            <span className="text-[11px] text-indigo-800/80">Leaves Taken</span>
            <p className="font-bold text-sm text-indigo-950">{payslip.leavesTaken}</p>
          </div>
        </div>

        {/* Earnings & Deductions Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex justify-between">
              <span>Earnings</span>
              <span>Amount</span>
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Basic Salary</span>
                <span className="font-semibold">{formatCurrency(payslip.basicSalary, currencySymbol)}</span>
              </div>
              <div className="flex justify-between">
                <span>House Rent Allowance (HRA)</span>
                <span className="font-semibold">{formatCurrency(payslip.hra, currencySymbol)}</span>
              </div>
              <div className="flex justify-between">
                <span>Special Allowance</span>
                <span className="font-semibold">
                  {formatCurrency(payslip.specialAllowance, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Conveyance Allowance</span>
                <span className="font-semibold">
                  {formatCurrency(payslip.conveyanceAllowance, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Medical Allowance</span>
                <span className="font-semibold">
                  {formatCurrency(payslip.medicalAllowance, currencySymbol)}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
              <span>Total Gross Pay</span>
              <span className="text-emerald-700">
                {formatCurrency(payslip.totalEarnings, currencySymbol)}
              </span>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex justify-between">
              <span>Deductions</span>
              <span>Amount</span>
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Provident Fund (PF / 401k)</span>
                <span className="font-semibold">{formatCurrency(payslip.pfDeduction, currencySymbol)}</span>
              </div>
              <div className="flex justify-between">
                <span>Income Tax (TDS)</span>
                <span className="font-semibold">{formatCurrency(payslip.incomeTaxTds, currencySymbol)}</span>
              </div>
              <div className="flex justify-between">
                <span>Health & Dental Plan</span>
                <span className="font-semibold">
                  {formatCurrency(payslip.healthInsurance, currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Professional Tax</span>
                <span className="font-semibold">
                  {formatCurrency(payslip.professionalTax, currencySymbol)}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
              <span>Total Deductions</span>
              <span className="text-rose-600">
                -{formatCurrency(payslip.totalDeductions, currencySymbol)}
              </span>
            </div>
          </div>
        </div>

        {/* Net Salary Payable Box */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Net Payable Take-Home Amount
            </span>
            <p className="text-xs text-emerald-700/90 mt-0.5">
              Disbursed via {payslip.paymentMethod}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-900">
              {formatCurrency(payslip.netPayable, currencySymbol)}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center italic">
          This document is computer generated and valid without signature under Dayflow HRMS portal policy.
        </p>
      </div>
    </Modal>
  );
};
