import React from 'react';
import { Download, Eye } from 'lucide-react';
import { PayslipItem } from '../../types/payroll';
import { formatCurrency } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

interface PayslipTableProps {
  payslips: PayslipItem[];
  currencySymbol?: string;
  onViewPayslip: (slip: PayslipItem) => void;
  onDownloadPayslip: (slip: PayslipItem) => void;
}

export const PayslipTable: React.FC<PayslipTableProps> = ({
  payslips,
  currencySymbol = '$',
  onViewPayslip,
  onDownloadPayslip,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200/80">
            <tr>
              <th className="px-5 py-3.5">Payslip Period</th>
              <th className="px-5 py-3.5">Pay Date</th>
              <th className="px-5 py-3.5">Gross Pay</th>
              <th className="px-5 py-3.5">Total Deductions</th>
              <th className="px-5 py-3.5">Net Take-Home</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payslips.map((slip) => (
              <tr key={slip.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-4 font-bold text-slate-900 text-sm">{slip.month}</td>
                <td className="px-5 py-4 text-slate-600">{slip.paymentDate}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">
                  {formatCurrency(slip.totalEarnings, currencySymbol)}
                </td>
                <td className="px-5 py-4 font-semibold text-rose-600">
                  -{formatCurrency(slip.totalDeductions, currencySymbol)}
                </td>
                <td className="px-5 py-4 font-extrabold text-emerald-700 text-sm">
                  {formatCurrency(slip.netPayable, currencySymbol)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={slip.status} size="sm" />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewPayslip(slip)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onDownloadPayslip(slip)}
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                    >
                      PDF
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
