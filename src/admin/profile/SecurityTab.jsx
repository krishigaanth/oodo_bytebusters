import React from 'react';
import { ShieldCheck, KeyRound, Smartphone, Activity, Server, RefreshCw } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const SecurityTab = ({ employee }) => {
  const { info, success } = useToast();

  const handleResetPassword = () => {
    success(`Password reset link generated and sent to ${employee.workEmail}`);
  };

  const handleForceOdooSync = () => {
    info(`Synchronized employee ${employee.id} record with Odoo 'hr.employee' master.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ShieldCheck size={18} color="var(--primary-600)" />
              Account Security & Access Roles
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              System role bindings, MFA status, and audit logs
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">System User Role</label>
            <div className="form-value-display" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pill-tag" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', fontWeight: 600 }}>
                {employee.department === 'Human Resources' ? 'HR Administrator' : 'Standard Employee (Portal)'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Two-Factor Authentication (2FA)</label>
            <div className="form-value-display" style={{ color: 'var(--status-present)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Smartphone size={16} />
              Enforced (Authenticator App)
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Odoo Backend Sync Status</label>
            <div className="form-value-display" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-present)', fontWeight: 600 }}>
                <Server size={16} />
                Connected (Synced 5m ago)
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleForceOdooSync}>
                <RefreshCw size={12} />
                <span>Sync Now</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Credential Management</label>
            <div className="form-value-display" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Last changed 45 days ago</span>
              <button className="btn btn-secondary btn-sm" onClick={handleResetPassword}>
                <KeyRound size={12} />
                <span>Reset Password</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Activity size={18} color="var(--primary-600)" />
              Security Audit Trail
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Recent authentication sessions and privileged actions
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>IP Address</th>
                <th>Location</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Login via SSO / SAML</td>
                <td>49.207.214.18</td>
                <td>Bangalore, India</td>
                <td>Today, 09:02 AM</td>
                <td><span className="status-badge present"><span className="badge-dot" />Success</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Profile Details View by HR</td>
                <td>103.118.156.22</td>
                <td>Mumbai, India</td>
                <td>Today, 10:15 AM</td>
                <td><span className="status-badge present"><span className="badge-dot" />Audited</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Salary Component Recalculation</td>
                <td>103.118.156.22</td>
                <td>Mumbai, India</td>
                <td>Yesterday, 04:30 PM</td>
                <td><span className="status-badge present"><span className="badge-dot" />Recorded</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
