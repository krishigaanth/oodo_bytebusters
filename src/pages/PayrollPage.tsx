import React, { useState, useEffect } from 'react';
import { ShieldCheck, Receipt } from 'lucide-react';
import { PayrollSummary, PayslipItem } from '../types/payroll';
import { payrollService } from '../services/payrollService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { SalaryBreakdownCard } from '../components/payroll/SalaryBreakdownCard';
import { PayslipTable } from '../components/payroll/PayslipTable';
import { PayslipModal } from '../components/payroll/PayslipModal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const PayrollPage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadPayroll = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await payrollService.getPayroll(user.employeeId);
      setSummary(data);
    } catch (err) {
      console.error('Failed to load payroll data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayroll();
  }, [user]);

  const handleViewPayslip = (slip: PayslipItem) => {
    setSelectedPayslip(slip);
    setIsModalOpen(true);
  };

  const handleDownloadPayslip = (slip: PayslipItem) => {
    success(`Downloading Payslip for ${slip.month}...`, 'Download PDF');
  };

  if (isLoading || !summary) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={3} />
        <LoadingSkeleton type="table" count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Payroll & Compensation
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Read-Only Portal</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown of your salary structures, allowances, statutory taxes, and monthly payslip receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
            Payment Cycle: <strong>Monthly (Last Business Day)</strong>
          </div>
        </div>
      </div>

      {/* Salary & CTC Breakdown Component */}
      <SalaryBreakdownCard summary={summary} />

      {/* Historical Monthly Payslips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Issued Monthly Payslips
            </h3>
          </div>
          <span className="text-xs text-slate-500">{summary.payslips.length} payslips available</span>
        </div>

        <PayslipTable
          payslips={summary.payslips}
          currencySymbol={summary.currencySymbol}
          onViewPayslip={handleViewPayslip}
          onDownloadPayslip={handleDownloadPayslip}
        />
      </div>

      {/* Payslip View Modal */}
      <PayslipModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayslip(null);
        }}
        payslip={selectedPayslip}
        currencySymbol={summary.currencySymbol}
      />
    </div>
  );
};
