import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert, Lock } from 'lucide-react';

export const PrivateInfoTab = ({ formData, setFormData, isEditing }) => {
  const [showMasked, setShowMasked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const maskPAN = (pan) => {
    if (!pan) return '—';
    if (showMasked || isEditing) return pan;
    return 'XXXXXX' + pan.slice(-4);
  };

  const maskBank = (acc) => {
    if (!acc) return '—';
    if (showMasked || isEditing) return acc;
    return '••••••••' + acc.slice(-4);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <Lock size={18} color="var(--primary-600)" />
            Private & Confidential Information
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Restricted to authorized HR Administrators and Compliance officers
          </p>
        </div>

        {!isEditing && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowMasked(!showMasked)}
            title={showMasked ? 'Mask sensitive data' : 'Unmask sensitive data'}
          >
            {showMasked ? <EyeOff size={15} /> : <Eye size={15} />}
            <span>{showMasked ? 'Mask Details' : 'Reveal Sensitive'}</span>
          </button>
        )}
      </div>

      <div
        style={{
          padding: 'var(--space-3)',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          fontSize: '0.8rem',
          color: '#92400E'
        }}
      >
        <ShieldAlert size={18} style={{ flexShrink: 0 }} />
        <span>
          <strong>Confidential HR Record:</strong> All PAN, Bank Account, UAN, and personal identification records are encrypted and audited. Never share these details outside official payroll processing.
        </span>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Permanent Account Number (PAN)</label>
          {isEditing ? (
            <input
              type="text"
              name="pan"
              className="input-control"
              value={formData.pan || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              {maskPAN(formData.pan)}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Universal Account Number (UAN / PF)</label>
          {isEditing ? (
            <input
              type="text"
              name="uan"
              className="input-control"
              value={formData.uan || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display" style={{ fontFamily: 'monospace' }}>
              {formData.uan || '—'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Bank Account Number</label>
          {isEditing ? (
            <input
              type="text"
              name="bankAccount"
              className="input-control"
              value={formData.bankAccount || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display" style={{ fontFamily: 'monospace' }}>
              {maskBank(formData.bankAccount)}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Bank Name</label>
          {isEditing ? (
            <input
              type="text"
              name="bankName"
              className="input-control"
              value={formData.bankName || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.bankName || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">IFSC Code</label>
          {isEditing ? (
            <input
              type="text"
              name="ifsc"
              className="input-control"
              value={formData.ifsc || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display" style={{ fontFamily: 'monospace' }}>
              {formData.ifsc || '—'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Gender</label>
          {isEditing ? (
            <select
              name="gender"
              className="select-control"
              value={formData.gender || 'Male'}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          ) : (
            <div className="form-value-display">{formData.gender || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Marital Status</label>
          {isEditing ? (
            <select
              name="maritalStatus"
              className="select-control"
              value={formData.maritalStatus || 'Single'}
              onChange={handleChange}
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          ) : (
            <div className="form-value-display">{formData.maritalStatus || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Nationality</label>
          {isEditing ? (
            <input
              type="text"
              name="nationality"
              className="input-control"
              value={formData.nationality || 'Indian'}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.nationality || 'Indian'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Dependents</label>
          {isEditing ? (
            <input
              type="text"
              name="dependents"
              className="input-control"
              value={formData.dependents || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.dependents || 'None'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Enrolled Benefits</label>
          {isEditing ? (
            <input
              type="text"
              name="benefits"
              className="input-control"
              value={formData.benefits || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.benefits || 'Standard Corporate Coverage'}</div>
          )}
        </div>
      </div>
    </div>
  );
};
