import React from 'react';

export const PersonalInfoTab = ({ formData, setFormData, isEditing }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Personal Information</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Employee contact, residential, and identification data
          </p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label required">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              className="input-control"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          ) : (
            <div className="form-value-display">{formData.name || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Date of Birth</label>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              className="input-control"
              value={formData.dob || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.dob || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label required">Work Email</label>
          {isEditing ? (
            <input
              type="email"
              name="workEmail"
              className="input-control"
              value={formData.workEmail || ''}
              onChange={handleChange}
              required
            />
          ) : (
            <div className="form-value-display">{formData.workEmail || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Personal Email</label>
          {isEditing ? (
            <input
              type="email"
              name="personalEmail"
              className="input-control"
              value={formData.personalEmail || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.personalEmail || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label required">Phone Number</label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              className="input-control"
              value={formData.phone || ''}
              onChange={handleChange}
              required
            />
          ) : (
            <div className="form-value-display">{formData.phone || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Emergency Contact</label>
          {isEditing ? (
            <input
              type="text"
              name="emergencyContact"
              className="input-control"
              value={formData.emergencyContact || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.emergencyContact || '—'}</div>
          )}
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Residential Address</label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              className="input-control"
              value={formData.address || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.address || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">City</label>
          {isEditing ? (
            <input
              type="text"
              name="city"
              className="input-control"
              value={formData.city || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.city || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">State / Province</label>
          {isEditing ? (
            <input
              type="text"
              name="state"
              className="input-control"
              value={formData.state || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.state || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Country</label>
          {isEditing ? (
            <input
              type="text"
              name="country"
              className="input-control"
              value={formData.country || 'India'}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.country || 'India'}</div>
          )}
        </div>
      </div>
    </div>
  );
};
