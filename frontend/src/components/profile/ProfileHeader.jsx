import React from 'react';
import { ArrowLeft, Edit3, Save, X, Building2, MapPin, Mail, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const ProfileHeader = ({
  employee,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onBack,
  isSaving
}) => {
  return (
    <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
      {/* Top back row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={onBack}
          style={{ gap: '6px', paddingLeft: 0 }}
        >
          <ArrowLeft size={16} />
          <span>Back to Employees</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {isEditing ? (
            <>
              <button className="btn btn-secondary btn-sm" onClick={onCancel} disabled={isSaving}>
                <X size={14} />
                <span>Cancel</span>
              </button>
              <button className="btn btn-primary btn-sm" onClick={onSave} disabled={isSaving}>
                {isSaving ? <span className="spinner" /> : <Save size={14} />}
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onEdit}>
              <Edit3 size={14} />
              <span>Edit Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Info Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={employee.avatar}
            alt={employee.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: 'var(--radius-full)',
              objectFit: 'cover',
              border: '3px solid #FFFFFF',
              boxShadow: 'var(--shadow-md)'
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{employee.name}</h2>
            <span className="emp-card-id" style={{ fontSize: '0.85rem' }}>{employee.id}</span>
            <StatusBadge status={employee.attendanceStatus} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: '6px', color: 'var(--text-secondary)', fontSize: '0.875rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{employee.jobTitle}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={14} />
              {employee.department}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} />
              {employee.officeLocation || employee.city}
            </span>
          </div>
        </div>

        {/* HR Privileged Badge */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}
        >
          <ShieldCheck size={20} color="var(--primary-600)" />
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Access Mode
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              HR Administrator View
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
