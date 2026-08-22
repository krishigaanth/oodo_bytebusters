import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { Users, Eye, Mail, Phone } from 'lucide-react';

export const EmployeeTable = ({ employees, onSelectEmployee, onResetFilters }) => {
  if (!employees || employees.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No employees found"
        description="Try adjusting your search criteria or clearing active filters."
        actionLabel="Reset Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Job Title & Dept</th>
            <th>Manager</th>
            <th>Type</th>
            <th>Attendance Status</th>
            <th>Contact Info</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              onClick={() => onSelectEmployee(emp.id)}
              style={{ cursor: 'pointer' }}
            >
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 500 }}>{emp.id}</div>
                  </div>
                </div>
              </td>
              <td>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{emp.jobTitle}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.department}</div>
              </td>
              <td>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{emp.manager || 'Executive'}</span>
              </td>
              <td>
                <span className="pill-tag">{emp.employmentType}</span>
              </td>
              <td>
                <StatusBadge status={emp.attendanceStatus} />
              </td>
              <td>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div>{emp.workEmail}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{emp.phone}</div>
                </div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEmployee(emp.id);
                  }}
                >
                  <Eye size={14} />
                  <span>View</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
