import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Mail, Phone, MapPin, Building2, UserCheck, KeyRound, Award, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useToast } from '../context/ToastContext';

export const AdminProfileView = () => {
  const { currentUser } = useApp();
  const { success } = useToast();

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>My Profile</h1>
          <p className="page-subtitle">
            HR Administrator account settings, security keys, and organizational authority
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: 'var(--radius-full)',
              objectFit: 'cover',
              border: '3px solid #FFFFFF',
              boxShadow: 'var(--shadow-md)'
            }}
          />

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{currentUser.name}</h2>
              <span className="emp-card-id" style={{ fontSize: '0.85rem' }}>EMP-1008</span>
              <StatusBadge status="Present" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, color: 'var(--primary-600)' }}>{currentUser.role}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={14} />
                {currentUser.department}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={14} />
                {currentUser.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-equal">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <ShieldCheck size={18} color="var(--primary-600)" />
              HR Administrator Privileges
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={18} color="var(--status-present)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Workforce Roster Management</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full create, view, edit access across all 6 departments</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={18} color="var(--status-present)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Leave Request Approval & Rejection</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Authorized to approve/reject all time-off with reason logs</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={18} color="var(--status-present)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Salary & Tax Engine Configuration</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Modify percentages, HRA formulas, PF rates, and salary structures</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={18} color="var(--status-present)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Confidential / Private Records Access</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Authorized decryption and view of PAN, Bank, and UAN records</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <KeyRound size={18} color="var(--primary-600)" />
              Session & Security Info
            </h3>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="form-group">
              <label className="form-label">Authentication Method</label>
              <div className="form-value-display">SAML / OAuth2 (Odoo Single Sign-On)</div>
            </div>

            <div className="form-group">
              <label className="form-label">Session Expiry</label>
              <div className="form-value-display">Active (Auto-refreshes every 8 hours)</div>
            </div>

            <div className="form-group">
              <label className="form-label">Active Workstation IP</label>
              <div className="form-value-display">103.118.156.22 (Verified Trusted Device)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
