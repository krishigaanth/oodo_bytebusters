import React from 'react';
import { Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DepartmentSummary = () => {
  const { employees, attendanceRecords, navigateTo } = useApp();

  const departments = ['Engineering', 'Human Resources', 'Finance', 'Sales', 'Marketing', 'Operations'];

  const stats = departments.map((dept) => {
    const deptEmployees = employees.filter((e) => e.department === dept);
    const count = deptEmployees.length;
    const presentCount = deptEmployees.filter((e) => {
      const att = attendanceRecords.find((a) => a.employeeId === e.id);
      return att && (att.status === 'Present' || att.status === 'Late');
    }).length;
    const rate = count > 0 ? Math.round((presentCount / count) * 100) : 0;

    return {
      name: dept,
      count,
      presentCount,
      rate
    };
  });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Department Summary</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Headcount and operational attendance by department
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {stats.map((dept) => (
          <div
            key={dept.name}
            style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {dept.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <strong>{dept.presentCount}</strong> / {dept.count} Present ({dept.rate}%)
              </span>
            </div>
            <div style={{ height: '6px', borderRadius: 'var(--radius-full)', background: 'var(--border-light)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${dept.rate}%`,
                  background: dept.rate > 80 ? 'var(--status-present)' : dept.rate > 50 ? 'var(--primary-500)' : 'var(--status-break)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
