import React from 'react';

export const JobInfoTab = ({ formData, setFormData, isEditing }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Job & Organization Information</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Role hierarchy, team affiliation, and schedule parameters
          </p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Employee ID</label>
          <div className="form-value-display" style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
            {formData.id}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label required">Job Title</label>
          {isEditing ? (
            <input
              type="text"
              name="jobTitle"
              className="input-control"
              value={formData.jobTitle || ''}
              onChange={handleChange}
              required
            />
          ) : (
            <div className="form-value-display">{formData.jobTitle || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label required">Department</label>
          {isEditing ? (
            <select
              name="department"
              className="select-control"
              value={formData.department || 'Engineering'}
              onChange={handleChange}
            >
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          ) : (
            <div className="form-value-display">{formData.department || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label required">Employment Type</label>
          {isEditing ? (
            <select
              name="employmentType"
              className="select-control"
              value={formData.employmentType || 'Full-time'}
              onChange={handleChange}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
          ) : (
            <div className="form-value-display">
              <span className="pill-tag">{formData.employmentType || 'Full-time'}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Reporting Manager</label>
          {isEditing ? (
            <input
              type="text"
              name="manager"
              className="input-control"
              value={formData.manager || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.manager || 'Executive'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Joining Date</label>
          {isEditing ? (
            <input
              type="date"
              name="joiningDate"
              className="input-control"
              value={formData.joiningDate || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.joiningDate || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Office Location</label>
          {isEditing ? (
            <input
              type="text"
              name="officeLocation"
              className="input-control"
              value={formData.officeLocation || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.officeLocation || '—'}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Assigned Team / Unit</label>
          {isEditing ? (
            <input
              type="text"
              name="team"
              className="input-control"
              value={formData.team || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.team || '—'}</div>
          )}
        </div>

        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Work Schedule & Shift</label>
          {isEditing ? (
            <input
              type="text"
              name="workSchedule"
              className="input-control"
              value={formData.workSchedule || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="form-value-display">{formData.workSchedule || 'General Shift (09:00 AM - 06:00 PM)'}</div>
          )}
        </div>
      </div>
    </div>
  );
};
