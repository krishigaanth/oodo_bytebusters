import React, { useState, useEffect } from 'react';
import { salaryService } from '../services/salaryService';
import {
  formatCurrency,
  calculateBasicSalary,
  calculateHRA,
  calculateFullSalaryBreakdown
} from '../services/salaryCalculations';
import { useToast } from '../context/ToastContext';
import { Modal } from '../common/Modal';
import {
  BadgePercent,
  Plus,
  Edit2,
  Trash2,
  Check,
  Calculator,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Settings
} from 'lucide-react';

export const SalaryManagement = () => {
  const { success, error } = useToast();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Percentage',
    value: 50,
    basedOn: 'Monthly Wage',
    enabled: true,
    category: 'Earning'
  });

  // Simulator Wage for live verification
  const [simulatedWage, setSimulatedWage] = useState(50000);

  const loadComponents = async () => {
    try {
      setLoading(true);
      const data = await salaryService.getComponents();
      setComponents(data);
    } catch (err) {
      error('Failed to load salary components');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComponents();
  }, []);

  const handleOpenAdd = () => {
    setEditingComp(null);
    setFormData({
      name: '',
      type: 'Percentage',
      value: 50,
      basedOn: 'Monthly Wage',
      enabled: true,
      category: 'Earning'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setEditingComp(comp);
    setFormData({ ...comp });
    setIsModalOpen(true);
  };

  const handleSaveComponent = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Component name is required');
      return;
    }

    try {
      await salaryService.saveComponent({
        ...formData,
        id: editingComp ? editingComp.id : undefined,
        value: Number(formData.value) || 0
      });
      await loadComponents();
      success(`Salary component "${formData.name}" saved successfully.`);
      setIsModalOpen(false);
    } catch (err) {
      error(`Unable to save component: ${err.message}`);
    }
  };

  const handleDeleteComponent = async (id, name) => {
    if (name.toLowerCase().includes('basic')) {
      error('Basic Salary component cannot be deleted as it forms the foundational payroll base.');
      return;
    }

    try {
      await salaryService.deleteComponent(id);
      await loadComponents();
      success(`Salary component "${name}" removed.`);
    } catch (err) {
      error(`Unable to delete component: ${err.message}`);
    }
  };

  const handleToggleEnable = async (comp) => {
    try {
      await salaryService.saveComponent({
        ...comp,
        enabled: !comp.enabled
      });
      await loadComponents();
      success(`Component ${comp.name} ${!comp.enabled ? 'enabled' : 'disabled'}.`);
    } catch (err) {
      error(`Unable to update component status: ${err.message}`);
    }
  };

  const simulatedBreakdown = calculateFullSalaryBreakdown(simulatedWage, components);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Salary & Component Configuration</h1>
          <p className="page-subtitle">
            Define organization-wide earnings structures, percentage calculation rules, and statutory taxes
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          <Plus size={16} />
          <span>Add Salary Component</span>
        </button>
      </div>

      {/* Live Formula Simulator Banner */}
      <div
        className="card"
        style={{
          marginBottom: 'var(--space-6)',
          background: 'linear-gradient(135deg, #4F46E5 0%, #312E81 100%)',
          color: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#A5B4FC', fontWeight: 700 }}>
              <Calculator size={18} />
              LIVE COMPENSATION SIMULATOR
            </div>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', margin: '4px 0' }}>
              Test Salary Formulas in Real-Time
            </h3>
            <p style={{ color: '#E0E7FF', fontSize: '0.85rem', margin: 0, maxWidth: '500px' }}>
              Adjust monthly wage to instantly preview how configured percentages and allowances compute across the employee lifecycle.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'rgba(255, 255, 255, 0.12)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#E0E7FF', fontWeight: 600 }}>Simulation Wage (₹)</div>
              <input
                type="number"
                className="input-control"
                style={{ width: '140px', height: '36px', background: '#FFFFFF', color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}
                value={simulatedWage}
                onChange={(e) => setSimulatedWage(Number(e.target.value))}
                step="5000"
              />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#86EFAC', fontWeight: 600 }}>Simulated Net Pay</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ADE80', marginTop: '6px' }}>
                {formatCurrency(simulatedBreakdown.netTakeHome)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Components Table */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Configured Salary Components</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Master compensation components applied to standard employee contracts
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Component Code</th>
                <th>Component Name</th>
                <th>Calculation Type</th>
                <th>Configured Value</th>
                <th>Calculated Base</th>
                <th>Simulated Amount (at {formatCurrency(simulatedWage)})</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {components.map((comp) => {
                const simComp = simulatedBreakdown.calculatedComponents.find(c => c.id === comp.id);
                return (
                  <tr key={comp.id} style={{ opacity: comp.enabled ? 1 : 0.5 }}>
                    <td>
                      <span className="emp-card-id">{comp.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{comp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comp.category}</div>
                    </td>
                    <td>
                      <span className="pill-tag">{comp.type}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
                      {comp.type === 'Percentage' ? `${comp.value}%` : formatCurrency(comp.value)}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {comp.type === 'Percentage' ? `of ${comp.basedOn}` : 'Fixed Monthly'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {simComp ? formatCurrency(simComp.calculatedAmount) : '₹0'}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${comp.enabled ? 'btn-success' : 'btn-secondary'}`}
                        style={{ height: '26px', fontSize: '0.75rem', padding: '0 8px' }}
                        onClick={() => handleToggleEnable(comp)}
                      >
                        {comp.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(comp)}
                          title="Edit Component"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>
                        {!comp.name.toLowerCase().includes('basic') && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteComponent(comp.id, comp.name)}
                            title="Delete Component"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provident Fund & Statutory Tax Rules */}
      <div className="dashboard-grid-equal">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <ShieldCheck size={18} color="var(--primary-600)" />
                Provident Fund (EPF) Rules
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Statutory EPFO compliance standards
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Employee PF Contribution</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deducted from monthly gross</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-error)' }}>12.0% of Basic</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Employer PF Contribution</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contributed by Organization</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-600)' }}>12.0% of Basic</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Simulated Employee PF at {formatCurrency(simulatedWage)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Based on {formatCurrency(simulatedBreakdown.basicSalary)} Basic</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {formatCurrency(simulatedBreakdown.employeePF)}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Settings size={18} color="var(--primary-600)" />
                Professional Tax (PT) Slabs
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                State government statutory deduction slab
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Monthly Wage ≤ ₹15,000</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low wage exemption bracket</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>₹0 / month</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Monthly Wage &gt; ₹15,000</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard state tax slab</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-error)' }}>₹200 / month</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Simulated Tax at {formatCurrency(simulatedWage)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applied to active payroll runs</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {formatCurrency(simulatedBreakdown.professionalTax)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingComp ? `Edit Component: ${editingComp.name}` : 'Add New Salary Component'}
        footer={
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSaveComponent} disabled={!formData.name.trim()}>
              Save Component
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveComponent} className="form-grid">
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label required">Component Name</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Special Allowance, Vehicle Reimbursement"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Calculation Type</label>
            <select
              className="select-control"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">
              {formData.type === 'Percentage' ? 'Percentage (%)' : 'Fixed Monthly Value (₹)'}
            </label>
            <input
              type="number"
              className="input-control"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              min="0"
              step={formData.type === 'Percentage' ? '0.1' : '100'}
            />
          </div>

          {formData.type === 'Percentage' && (
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label required">Calculated Based On</label>
              <select
                className="select-control"
                value={formData.basedOn}
                onChange={(e) => setFormData({ ...formData, basedOn: e.target.value })}
              >
                <option value="Monthly Wage">Monthly Wage</option>
                <option value="Basic Salary">Basic Salary</option>
              </select>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
