import React from 'react';
import { LeaveBalance } from '../../types/leave';

interface LeaveBalanceCardProps {
  balance: LeaveBalance;
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ balance }) => {
  const percentage = Math.round((balance.available / balance.totalQuota) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 shadow-subtle hover:shadow-card transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {balance.leaveType}
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {balance.available}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              / {balance.totalQuota} days left
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-700">{percentage}%</span>
          <p className="text-[11px] text-slate-500">remaining</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${balance.colorClass} transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <span>Used: <strong>{balance.used} days</strong></span>
        <span className="truncate max-w-[150px]">{balance.description}</span>
      </div>
    </div>
  );
};
