import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { employeeService } from '../services/employeeService';
import { useToast } from '../context/ToastContext';

export const AddEmployeeModal = ({ isOpen, onClose, onEmployeeAdded }) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    department: 'Engineering',
    manager: 'Vikram Malhotra',
    employmentType: 'Full-time',
    workEmail: '',
    phone: '',
    monthlyWage: 75000,
    officeLocation: 'Bangalore HQ (Tower 4)',
    team: 'Core Engineering'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.workEmail.trim() || !formData.jobTitle.trim()) {
      error('Please complete all required fields (Name, Job Title, Work Email).');
      return;
    }

    try {
      setLoading(true);
      const created = await employeeService.addEmployee(formData);
      success(`Employee ${created.name} (${created.id}) onboarded successfully!`);
      onEmployeeAdded();
      onClose();
      // Reset form
      setFormData({
        name: '',
        jobTitle: '',
        department: 'Engineering',
        manager: 'Vikram Malhotra',
        employmentType: 'Full-time',
        workEmail: '',
        phone: '',
        monthlyWage: 75000,
        officeLocation: 'Bangalore HQ (Tower 4)',
        team: 'Core Engineering'
      });
    } catch (err) {
      error(`Unable to add employee: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Onboard New Employee"
      maxWidth="680px"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Employee Record'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label className="form-label required">Full Name</label>
          <input
            type="text"
            name="name"
            className="input-control"
            placeholder="e.g. Ishaan Verma"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            className="input-control"
            placeholder="e.g. Cloud Engineer"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Department</label>
          <select
            name="department"
            className="select-control"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label required">Employment Type</label>
          <select
            name="employmentType"
            className="select-control"
            value={formData.employmentType}
            onChange={handleChange}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label required">Work Email</label>
          <input
            type="email"
            name="workEmail"
            className="input-control"
            placeholder="ishaan.v@dayflow.io"
            value={formData.workEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            name="phone"
            className="input-control"
            placeholder="+91 98765 00000"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Reporting Manager</label>
          <input
            type="text"
            name="manager"
            className="input-control"
            placeholder="Vikram Malhotra"
            value={formData.manager}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Monthly Starting Wage (₹)</label>
          <input
            type="number"
            name="monthlyWage"
            className="input-control"
            placeholder="75000"
            value={formData.monthlyWage}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
};
