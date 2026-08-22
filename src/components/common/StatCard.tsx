import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  iconBg?: string;
  statusDotColor?: string; // e.g. "bg-emerald-500"
  statusText?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-brand-50 text-brand-600',
  statusDotColor,
  statusText,
  trend,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 shadow-subtle hover:shadow-card transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">{title}</p>
          <div className="flex items-center gap-2">
            {statusDotColor && (
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusDotColor}`}
                />
                <span className={`relative inline-flex rounded-full h-3 w-3 ${statusDotColor}`} />
              </span>
            )}
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
          </div>
        </div>
        {icon && (
          <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || statusText || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            {statusText && <span className="font-medium text-slate-700">{statusText}</span>}
            {subtitle && <span>{subtitle}</span>}
          </div>
          {trend && (
            <span
              className={`font-semibold inline-flex items-center ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
