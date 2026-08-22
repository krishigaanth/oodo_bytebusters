import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'profile' | 'text';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 1,
  className = '',
}) => {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className={`space-y-3 animate-pulse ${className}`}>
        <div className="h-10 bg-slate-200/80 rounded-xl w-full" />
        {items.map((_, i) => (
          <div key={i} className="h-14 bg-slate-100/90 rounded-xl w-full" />
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className={`animate-pulse space-y-6 ${className}`}>
        <div className="h-44 bg-slate-200/70 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 rounded-2xl" />
          <div className="h-64 bg-slate-100 rounded-2xl md:col-span-2" />
        </div>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className={`space-y-2 animate-pulse ${className}`}>
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
      </div>
    );
  }

  // Card Skeleton
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ${className}`}>
      {items.map((_, i) => (
        <div
          key={i}
          className="h-32 bg-slate-100 border border-slate-200/70 rounded-2xl p-5 animate-pulse flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-20" />
              <div className="h-7 bg-slate-200 rounded w-16" />
            </div>
            <div className="h-10 w-10 bg-slate-200 rounded-xl" />
          </div>
          <div className="h-3 bg-slate-200 rounded w-28" />
        </div>
      ))}
    </div>
  );
};
