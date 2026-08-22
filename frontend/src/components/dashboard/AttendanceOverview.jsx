import React from 'react';
import { ArrowRight, CheckCircle2, Coffee, UserX, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AttendanceOverview = () => {
  const { attendanceRecords, navigateTo } = useApp();

  const total = attendanceRecords.length || 1;
  const present = attendanceRecords.filter(r => r.status === 'Present').length;
  const onBreak = attendanceRecords.filter(r => r.status === 'On Break').length;
  const onLeave = attendanceRecords.filter(r => r.status === 'On Approved Leave').length;
  const checkedOut = attendanceRecords.filter(r => r.status === 'Checked Out').length;
  const offline = attendanceRecords.filter(r => r.status === 'Not Started / Offline').length;
  const late = attendanceRecords.filter(r => r.late && r.late.startsWith('Yes')).length;

  const presentPct = Math.round((present / total) * 100);
  const breakPct = Math.round((onBreak / total) * 100);
  const leavePct = Math.round((onLeave / total) * 100);
  const checkedOutPct = Math.round((checkedOut / total) * 100);
  const offlinePct = Math.max(0, 100 - (presentPct + breakPct + leavePct + checkedOutPct));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Attendance Overview</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Live workforce punch metrics for today
          </p>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigateTo('attendance')}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Visual Multi-segment Progress Bar */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.825rem', fontWeight: 600 }}>
          <span>Organization Presence</span>
          <span style={{ color: 'var(--status-present)' }}>{presentPct}% Active</span>
        </div>
        <div
          style={{
            height: '10px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface-subtle)',
            display: 'flex',
            overflow: 'hidden',
            gap: '2px'
          }}
        >
          <div style={{ width: `${presentPct}%`, background: 'var(--status-present)', transition: 'width 0.4s' }} title={`Present: ${present}`} />
          <div style={{ width: `${breakPct}%`, background: 'var(--status-break)', transition: 'width 0.4s' }} title={`On Break: ${onBreak}`} />
          <div style={{ width: `${leavePct}%`, background: 'var(--status-leave)', transition: 'width 0.4s' }} title={`On Leave: ${onLeave}`} />
          <div style={{ width: `${checkedOutPct}%`, background: 'var(--status-checked-out)', transition: 'width 0.4s' }} title={`Checked Out: ${checkedOut}`} />
          <div style={{ width: `${offlinePct}%`, background: 'var(--status-offline)', transition: 'width 0.4s' }} title={`Offline: ${offline}`} />
        </div>
      </div>

      {/* Grid of status stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-present)' }} />
            Present
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>{present}</div>
        </div>

        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-break)' }} />
            On Break
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>{onBreak}</div>
        </div>

        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-leave)' }} />
            On Leave
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>{onLeave}</div>
        </div>

        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-checked-out)' }} />
            Checked Out
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>{checkedOut}</div>
        </div>

        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-break)' }} />
            Late Arrivals
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>{late}</div>
        </div>

        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-offline)' }} />
            Offline
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>{offline}</div>
        </div>
      </div>
    </div>
  );
};
