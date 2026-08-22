import React from 'react';
import { Mail, Phone, User, Briefcase, MapPin } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const EmployeeCard = ({ employee, onClick }) => {
  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('present')) return 'var(--status-present)';
    if (s.includes('checked-out') || s.includes('absent')) return 'var(--status-checked-out)';
    if (s.includes('break')) return 'var(--status-break)';
    if (s.includes('leave') || s.includes('approved')) return 'var(--status-leave)';
    return 'var(--status-offline)';
  };

  return (
    <div className="employee-card" onClick={onClick}>
      <div className="card-top-row">
        <div className="avatar-wrapper">
          <img src={employee.avatar} alt={employee.name} className="emp-avatar" />
          <div
            className="avatar-status-dot"
            style={{ background: getStatusColor(employee.attendanceStatus) }}
            title={`Status: ${employee.attendanceStatus}`}
          />
        </div>

        <div className="card-meta-title">
          <div className="emp-card-name">{employee.name}</div>
          <div className="emp-card-role">{employee.jobTitle}</div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
            <span className="emp-card-id">{employee.id}</span>
            <span className="pill-tag">{employee.department}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ATTENDANCE STATUS</span>
          <StatusBadge status={employee.attendanceStatus} />
        </div>
      </div>

      <div className="card-details-list">
        <div className="detail-row">
          <User className="detail-row-icon" />
          <span>Manager: <strong>{employee.manager || 'Executive'}</strong></span>
        </div>

        <div className="detail-row">
          <Briefcase className="detail-row-icon" />
          <span>Type: <strong>{employee.employmentType}</strong></span>
        </div>

        <div className="detail-row">
          <Mail className="detail-row-icon" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {employee.workEmail}
          </span>
        </div>

        <div className="detail-row">
          <Phone className="detail-row-icon" />
          <span>{employee.phone}</span>
        </div>
      </div>
    </div>
  );
};
