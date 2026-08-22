import React from 'react';
import { Users, UserCheck, CalendarOff, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SummaryCards = () => {
  const { kpiMetrics, navigateTo } = useApp();

  const cards = [
    {
      id: 'total',
      label: 'Total Employees',
      value: kpiMetrics.totalEmployees,
      context: 'Across 6 active departments',
      icon: Users,
      color: 'indigo',
      trend: '+2 this month',
      onClick: () => navigateTo('employees')
    },
    {
      id: 'present',
      label: 'Present Today',
      value: kpiMetrics.presentToday,
      context: `${Math.round((kpiMetrics.presentToday / (kpiMetrics.totalEmployees || 1)) * 100)}% attendance rate`,
      icon: UserCheck,
      color: 'green',
      trend: 'Normal flow',
      onClick: () => navigateTo('attendance')
    },
    {
      id: 'leave',
      label: 'On Leave',
      value: kpiMetrics.onLeave,
      context: '2 planned for tomorrow',
      icon: CalendarOff,
      color: 'blue',
      trend: 'Approved time off',
      onClick: () => navigateTo('timeoff')
    },
    {
      id: 'pending',
      label: 'Pending Requests',
      value: kpiMetrics.pendingRequests,
      context: kpiMetrics.pendingRequests > 0 ? 'Requires HR review' : 'All caught up!',
      icon: Clock,
      color: 'amber',
      trend: kpiMetrics.pendingRequests > 0 ? 'Action required' : 'Done',
      onClick: () => navigateTo('timeoff')
    }
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="summary-card"
            onClick={card.onClick}
            style={{ cursor: 'pointer' }}
          >
            <div className={`summary-icon-box ${card.color}`}>
              <Icon size={24} />
            </div>

            <div className="summary-content">
              <div className="summary-label">{card.label}</div>
              <div className="summary-value">{card.value}</div>
              <div className="summary-context">
                <span>{card.context}</span>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: 'var(--text-muted)',
                opacity: 0.6
              }}
            >
              <ArrowUpRight size={16} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
