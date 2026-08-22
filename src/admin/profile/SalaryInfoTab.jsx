import React, { useState, useEffect } from 'react';
import {
  calculateFullSalaryBreakdown,
  formatCurrency
} from '../services/salaryCalculations';
import { INITIAL_SALARY_COMPONENTS } from '../services/mockData';
import { Calculator, ShieldCheck, Plus, Check, Trash2, Edit2, Info } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useToast } from '../context/ToastContext';

export const SalaryInfoTab = ({ formData, setFormData, isEditing }) => {
  const { success } = useToast();
  const [components, setComponents] = useState(
    formData.components && formData.components.length > 0
      ? formData.components
      : JSON.parse(JSON.stringify(INITIAL_SALARY_COMPONENTS))
  );

  const [monthlyWage, setMonthlyWage] = useState(formData.monthlyWage || 50000);
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [newComp, setNewComp] = useState({
    name: '',
    type: 'Percentage',
    value: 50,
    basedOn: 'Basic Salary'
  });

  // Calculate live breakdown
  const breakdown = calculateFullSalaryBreakdown(monthlyWage, components);

  // Sync back to parent form data when values change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      monthlyWage: Number(monthlyWage),
      components
    }));
  }, [monthlyWage, components, setFormData]);

  const handleComponentValueChange = (id, newValue) => {
    const updated = components.map(c => {
      if (c.id === id) {
        return { ...c, value: Number(newValue) || 0 };
      }
      return c;
    });
    setComponents(updated);
  };

  const handleComponentTypeChange = (id, newType) => {
    const updated = components.map(c => {
      if (c.id === id) {
        return { ...c, type: newType, value: newType === 'Percentage' ? 50 : 5000 };
      }
      return c;
    });
    setComponents(updated);
  };

  const handleToggleComponent = (id) => {
    const updated = components.map(c => {
      if (c.id === id) {
        return { ...c, enabled: !c.enabled };
      }
      return c;
    });
    setComponents(updated);
  };

  const handleAddCustomComponent = () => {
    if (!newComp.name.trim()) return;
    const newId = `COMP-${String(components.length + 1).padStart(2, '0')}`;
    const added = [
      ...components,
      {
        id: newId,
        name: newComp.name.trim(),
        type: newComp.type,
        value: Number(newComp.value) || 0,
        basedOn: newComp.basedOn,
        enabled: true,
        category: 'Earning'
      }
    ];
    setComponents(added);
    setIsCompModalOpen(false);
    setNewComp({ name: '', type: 'Percentage', value: 50, basedOn: 'Basic Salary' });
    success('New salary component added to employee compensation package.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Wage Parameters Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Calculator size={18} color="var(--primary-600)" />
              Compensation & Wage Overview
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Base wage tier and standard working terms
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label required">Monthly Wage (₹)</label>
            {isEditing ? (
              <input
                type="number"
                className="input-control"
                style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-700)' }}
                value={monthlyWage}
                onChange={(e) => setMonthlyWage(Number(e.target.value))}
                min="0"
                step="1000"
              />
            ) : (
              <div className="form-value-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                {formatCurrency(monthlyWage)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ month</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Annualized Wage (CTC)</label>
            <div className="form-value-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatCurrency(breakdown.yearlyWage)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ annum</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pay Frequency</label>
            <div className="form-value-display">
              {formData.payFrequency || 'Monthly'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Working Days per Week</label>
            <div className="form-value-display">
              {formData.workingDaysPerWeek || 5} Days (Monday - Friday)
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Daily Break Time</label>
            <div className="form-value-display">
              {formData.breakTime || '1 Hour'} (Lunch & Coffee)
            </div>
          </div>
        </div>
      </div>

      {/* Salary Components Breakdown Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Salary Component Breakdown</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Configured earnings with dynamic calculation rules
            </p>
          </div>

          {isEditing && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsCompModalOpen(true)}
            >
              <Plus size={14} />
              <span>Add Component</span>
            </button>
          )}
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Calculation Type</th>
                <th>Rule / Basis</th>
                <th>Rate / Value</th>
                <th style={{ textAlign: 'right' }}>Calculated Amount</th>
                {isEditing && <th style={{ textAlign: 'center' }}>Active</th>}
              </tr>
            </thead>
            <tbody>
              {breakdown.calculatedComponents.map((comp) => (
                <tr key={comp.id} style={{ opacity: comp.enabled ? 1 : 0.45 }}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{comp.name}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{comp.id}</div>
                  </td>
                  <td>
                    {isEditing && !comp.name.toLowerCase().includes('basic') ? (
                      <select
                        className="select-control"
                        style={{ height: '32px', fontSize: '0.8rem' }}
                        value={comp.type}
                        onChange={(e) => handleComponentTypeChange(comp.id, e.target.value)}
                      >
                        <option value="Percentage">Percentage</option>
                        <option value="Fixed">Fixed Amount</option>
                      </select>
                    ) : (
                      <span className="pill-tag">{comp.type}</span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {comp.type === 'Percentage' ? `of ${comp.basedOn}` : 'Fixed Monthly'}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="number"
                          className="input-control"
                          style={{ width: '80px', height: '32px', fontSize: '0.85rem' }}
                          value={comp.value}
                          onChange={(e) => handleComponentValueChange(comp.id, e.target.value)}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                          {comp.type === 'Percentage' ? '%' : '₹'}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {comp.type === 'Percentage' ? `${comp.value}%` : `₹${comp.value}`}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {formatCurrency(comp.calculatedAmount)}
                  </td>
                  {isEditing && (
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={comp.enabled}
                        onChange={() => handleToggleComponent(comp.id)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provident Fund and Statutory Taxes Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ShieldCheck size={18} color="var(--primary-600)" />
              Statutory Contributions & Deductions
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Mandatory Provident Fund and State Professional Tax computations
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Deduction / Scheme</th>
                <th>Basis / Rate</th>
                <th>Employee Contribution</th>
                <th>Employer Contribution</th>
                <th style={{ textAlign: 'right' }}>Monthly Deducted</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ fontWeight: 600 }}>Employee Provident Fund (EPF)</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>EPFO Standard 12% of Basic</div>
                </td>
                <td>12% of Basic ({formatCurrency(breakdown.basicSalary)})</td>
                <td style={{ color: 'var(--color-error)', fontWeight: 600 }}>{formatCurrency(breakdown.employeePF)}</td>
                <td style={{ color: 'var(--primary-600)', fontWeight: 600 }}>{formatCurrency(breakdown.employerPF)}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-error)' }}>
                  - {formatCurrency(breakdown.employeePF)}
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ fontWeight: 600 }}>Professional Tax (PT)</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>State Statutory Slab Rule</div>
                </td>
                <td>Fixed Statutory Slab</td>
                <td style={{ color: 'var(--color-error)', fontWeight: 600 }}>{formatCurrency(breakdown.professionalTax)}</td>
                <td style={{ color: 'var(--text-muted)' }}>—</td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-error)' }}>
                  - {formatCurrency(breakdown.professionalTax)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Net Pay Summary Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
          color: '#FFFFFF',
          padding: 'var(--space-6)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#A5B4FC', fontWeight: 700 }}>
              Gross Monthly Earnings
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: '#FFFFFF' }}>
              {formatCurrency(breakdown.grossSalary)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
              Total before deductions
            </div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#FCA5A5', fontWeight: 700 }}>
              Total Deductions
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: '#F87171' }}>
              - {formatCurrency(breakdown.totalDeductions)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
              EPF + Professional Tax
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#86EFAC', fontWeight: 700 }}>
              Net Take-Home Salary
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: '#4ADE80' }}>
              {formatCurrency(breakdown.netTakeHome)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
              Net in-hand credit per month
            </div>
          </div>
        </div>
      </div>

      {/* Add Component Modal */}
      <Modal
        isOpen={isCompModalOpen}
        onClose={() => setIsCompModalOpen(false)}
        title="Add Custom Salary Component"
        footer={
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => setIsCompModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleAddCustomComponent} disabled={!newComp.name.trim()}>
              Add Component
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label required">Component Name</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Communication Allowance"
              value={newComp.name}
              onChange={(e) => setNewComp({ ...newComp, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Calculation Type</label>
            <select
              className="select-control"
              value={newComp.type}
              onChange={(e) => setNewComp({ ...newComp, type: e.target.value })}
            >
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">
              {newComp.type === 'Percentage' ? 'Percentage Value (%)' : 'Fixed Amount (₹)'}
            </label>
            <input
              type="number"
              className="input-control"
              value={newComp.value}
              onChange={(e) => setNewComp({ ...newComp, value: Number(e.target.value) })}
            />
          </div>

          {newComp.type === 'Percentage' && (
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label required">Calculated Based On</label>
              <select
                className="select-control"
                value={newComp.basedOn}
                onChange={(e) => setNewComp({ ...newComp, basedOn: e.target.value })}
              >
                <option value="Basic Salary">Basic Salary</option>
                <option value="Monthly Wage">Monthly Wage</option>
              </select>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
