import React from 'react';
import { UserCheck, UserX, CalendarOff, Briefcase, Clock8, Sparkles } from 'lucide-react';
import { AttendanceSummary } from '../../types/attendance';
import { StatCard } from '../common/StatCard';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

interface AttendanceStatsProps {
  summary: AttendanceSummary | null;
  isLoading?: boolean;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ summary, isLoading }) => {
  if (isLoading || !summary) {
    return <LoadingSkeleton type="card" count={6} />;
  }

  const statItems = [
    {
      title: 'Days Present',
      value: summary.daysPresent,
      subtitle: `${summary.averageWorkingHoursPerDay} hrs avg / day`,
      icon: <UserCheck className="w-5 h-5" />,
      iconBg: 'bg-emerald-50 text-emerald-600',
      statusDotColor: 'bg-emerald-500',
    },
    {
      title: 'Days Absent',
      value: summary.daysAbsent,
      subtitle: 'Unexcused absences',
      icon: <UserX className="w-5 h-5" />,
      iconBg: 'bg-rose-50 text-rose-600',
      statusDotColor: summary.daysAbsent > 0 ? 'bg-rose-500' : 'bg-emerald-500',
    },
    {
      title: 'Leave Days',
      value: summary.leaveDays,
      subtitle: 'Approved time off',
      icon: <CalendarOff className="w-5 h-5" />,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Total Working Days',
      value: summary.totalWorkingDays,
      subtitle: 'Schedule basis this month',
      icon: <Briefcase className="w-5 h-5" />,
      iconBg: 'bg-brand-50 text-brand-600',
    },
    {
      title: 'Total Work Hours',
      value: `${summary.totalWorkingHours}h`,
      subtitle: 'Logged shift time',
      icon: <Clock8 className="w-5 h-5" />,
      iconBg: 'bg-sky-50 text-sky-600',
    },
    {
      title: 'Extra / Overtime',
      value: `+${summary.extraHours}h`,
      subtitle: 'Approved overtime',
      icon: <Sparkles className="w-5 h-5" />,
      iconBg: 'bg-amber-50 text-amber-600',
      statusDotColor: 'bg-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item, idx) => (
        <StatCard
          key={idx}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          icon={item.icon}
          iconBg={item.iconBg}
          statusDotColor={item.statusDotColor}
        />
      ))}
    </div>
  );
};
