import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import { PayrollSummary } from '../../types/payroll';
import { formatCurrency } from '../../utils/formatters';

interface SalaryBreakdownCardProps {
  summary: PayrollSummary;
}

export const SalaryBreakdownCard: React.FC<SalaryBreakdownCardProps> = ({ summary }) => {
  const { annualCtc, monthlyGross, monthlyNet, earningsBreakdown, deductionsBreakdown, currencySymbol } =
    summary;

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* CTC */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-elevated border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Annual Cost to Company (CTC)
            </span>
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
            {formatCurrency(annualCtc, currencySymbol)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Total annualized compensation</p>
        </div>

        {/* Monthly Gross */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Monthly Gross Pay
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {formatCurrency(monthlyGross, currencySymbol)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Pre-tax gross monthly earnings</p>
        </div>

        {/* Net Take-Home */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Net Take-Home Pay
            </span>
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-emerald-950 mt-2 tracking-tight">
            {formatCurrency(monthlyNet, currencySymbol)}
          </h3>
          <p className="text-xs text-emerald-700/80 mt-1">Credited directly to bank account</p>
        </div>
      </div>

      {/* Itemized Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Breakdown */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Earnings Components</h3>
              <p className="text-xs text-slate-500">Fixed allowances & monthly pay items</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {earningsBreakdown.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 text-sm">{item.name}</span>
                  <p className="text-[11px] text-slate-400">
                    Annual: {formatCurrency(item.annualAmount, currencySymbol)}
                  </p>
                </div>
                <span className="font-bold text-emerald-700 text-sm">
                  +{formatCurrency(item.monthlyAmount, currencySymbol)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between font-bold text-sm text-slate-900">
            <span>Total Monthly Gross Earnings</span>
            <span className="text-emerald-700">{formatCurrency(monthlyGross, currencySymbol)}</span>
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-subtle">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Statutory Deductions & Taxes</h3>
              <p className="text-xs text-slate-500">PF, income tax withholdings, and insurance</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {deductionsBreakdown.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 text-sm">{item.name}</span>
                  <p className="text-[11px] text-slate-400">
                    Annual: {formatCurrency(item.annualAmount, currencySymbol)}
                  </p>
                </div>
                <span className="font-bold text-rose-600 text-sm">
                  -{formatCurrency(item.monthlyAmount, currencySymbol)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between font-bold text-sm text-slate-900">
            <span>Total Monthly Deductions</span>
            <span className="text-rose-600">
              -{formatCurrency(monthlyGross - monthlyNet, currencySymbol)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
