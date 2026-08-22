import React from 'react';
import { LogIn, Calendar, CreditCard, UserPlus, Clock } from 'lucide-react';
import { INITIAL_ACTIVITY_LOGS } from '../services/mockData';

export const RecentActivity = () => {
  const getIcon = (type) => {
    switch (type) {
      case 'attendance': return LogIn;
      case 'leave': return Calendar;
      case 'salary': return CreditCard;
      case 'employee': return UserPlus;
      default: return Clock;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Recent Employee Activity</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Real-time workforce audit and event log
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {INITIAL_ACTIVITY_LOGS.map((act) => {
          const Icon = getIcon(act.type);
          return (
            <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-600)',
                  flexShrink: 0,
                  border: '1px solid var(--border-light)'
                }}
              >
                <Icon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {act.text}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {act.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
