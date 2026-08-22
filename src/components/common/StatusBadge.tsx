import React from 'react';

export type StatusType =
  | 'Present'
  | 'Absent'
  | 'Half Day'
  | 'Leave'
  | 'Holiday'
  | 'Weekend'
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Cancelled'
  | 'Paid'
  | 'Processing'
  | 'Active'
  | 'On Leave'
  | 'Probation'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  const normalized = status?.toLowerCase() || '';

  if (normalized === 'present' || normalized === 'approved' || normalized === 'paid' || normalized === 'active') {
    badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (normalized === 'absent' || normalized === 'rejected' || normalized === 'cancelled') {
    badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500';
  } else if (normalized === 'pending' || normalized === 'half day' || normalized === 'processing' || normalized === 'probation') {
    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (normalized === 'leave' || normalized === 'on leave') {
    badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    dotColor = 'bg-indigo-500';
  } else if (normalized === 'holiday') {
    badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
    dotColor = 'bg-purple-500';
  } else if (normalized === 'weekend') {
    badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';
    dotColor = 'bg-slate-400';
  }

  const sizeClass =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs gap-1'
      : 'px-2.5 py-1 text-xs font-semibold gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${sizeClass} ${badgeStyle} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
