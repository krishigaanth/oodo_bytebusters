import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { leaveService } from '../services/leaveService';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Check,
  X,
  Eye,
  RotateCcw,
  Calendar
} from 'lucide-react';

export const TimeOffManagement = () => {
  const { leaveRequests, refreshData, navigateTo } = useApp();
  const { success, error } = useToast();

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [leaveType, setLeaveType] = useState('All Leave Types');
  const [status, setStatus] = useState('All Statuses');

  // Detail Modal & Rejection Modal States
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  const departments = ['All Departments', 'Engineering', 'Human Resources', 'Finance', 'Sales', 'Marketing', 'Operations'];
  const leaveTypes = ['All Leave Types', 'Casual Leave', 'Sick Leave', 'Paid Time Off', 'Annual Vacation'];
  const statuses = ['All Statuses', 'Pending', 'Approved', 'Rejected'];

  // Summary Metrics
  const totalCount = leaveRequests.length;
  const pendingCount = leaveRequests.filter(r => r.status === 'Pending').length;
  const approvedCount = leaveRequests.filter(r => r.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter(r => r.status === 'Rejected').length;

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((req) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        req.employeeName.toLowerCase().includes(q) ||
        req.employeeId.toLowerCase().includes(q) ||
        req.department.toLowerCase().includes(q) ||
        req.reason.toLowerCase().includes(q);

      const matchesDept = department === 'All Departments' || req.department === department;
      const matchesType = leaveType === 'All Leave Types' || req.leaveType === leaveType;
      const matchesStatus = status === 'All Statuses' || req.status === status;

      return matchesSearch && matchesDept && matchesType && matchesStatus;
    });
  }, [leaveRequests, search, department, leaveType, status]);

  const handleApprove = async (id, empName) => {
    try {
      setLoadingId(id);
      await leaveService.approveRequest(id);
      await refreshData();
      success(`Leave request for ${empName} approved successfully.`);
      if (isDetailModalOpen) {
        setIsDetailModalOpen(false);
      }
    } catch (err) {
      error(`Unable to approve leave request: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const handleOpenReject = (req) => {
    setSelectedRequest(req);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedRequest) return;
    if (!rejectReason.trim()) {
      error('Please provide a valid reason for rejecting the leave.');
      return;
    }

    try {
      setLoadingId(selectedRequest.id);
      await leaveService.rejectRequest(selectedRequest.id, rejectReason.trim());
      await refreshData();
      success(`Leave request for ${selectedRequest.employeeName} rejected.`);
      setIsRejectModalOpen(false);
      if (isDetailModalOpen) {
        setIsDetailModalOpen(false);
      }
    } catch (err) {
      error(`Unable to reject leave request: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const handleViewDetail = (req) => {
    setSelectedRequest(req);
    setIsDetailModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartment('All Departments');
    setLeaveType('All Leave Types');
    setStatus('All Statuses');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Time Off Management</h1>
          <p className="page-subtitle">
            Review, approve, and manage workforce leave applications and balances
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon-box indigo">
            <CalendarCheck2 size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Requests</div>
            <div className="summary-value">{totalCount}</div>
            <div className="summary-context">All active applications</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box amber">
            <Clock size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Pending Approval</div>
            <div className="summary-value">{pendingCount}</div>
            <div className="summary-context" style={{ color: pendingCount > 0 ? 'var(--status-break)' : 'var(--text-muted)', fontWeight: 600 }}>
              {pendingCount > 0 ? 'Requires immediate action' : 'All caught up'}
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box green">
            <CheckCircle2 size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Approved</div>
            <div className="summary-value">{approvedCount}</div>
            <div className="summary-context">Granted by HR Admin</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box" style={{ background: 'var(--status-checked-out-bg)', color: 'var(--color-error)' }}>
            <XCircle size={24} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Rejected</div>
            <div className="summary-value">{rejectedCount}</div>
            <div className="summary-context">With documented feedback</div>
          </div>
        </div>
      </div>

      {/* Toolbar Bar */}
      <div className="toolbar-bar">
        <div className="filter-group" style={{ flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-control"
              style={{ width: '100%', paddingLeft: '36px' }}
              placeholder="Search by employee, ID, reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="select-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            className="select-control"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            className="select-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {(search || department !== 'All Departments' || leaveType !== 'All Leave Types' || status !== 'All Statuses') && (
            <button className="btn btn-ghost btn-sm" onClick={handleResetFilters}>
              <RotateCcw size={14} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Leave Requests Table */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={CalendarCheck2}
          title="No leave requests found"
          description="There are no applications matching your current filter criteria."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Dates & Duration</th>
                <th>Reason</th>
                <th>Submitted</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} onClick={() => handleViewDetail(req)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <img
                        src={req.avatar}
                        alt={req.employeeName}
                        style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.employeeName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.department} • {req.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{req.leaveType}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{req.startDate} to {req.endDate}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                      {req.days} Day{req.days > 1 ? 's' : ''}
                    </div>
                  </td>
                  <td style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.reason}>
                    {req.reason}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {req.submittedDate}
                  </td>
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }} onClick={(e) => e.stopPropagation()}>
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApprove(req.id, req.employeeName)}
                            disabled={loadingId === req.id}
                            title="Approve Leave"
                          >
                            <Check size={14} />
                            <span>Approve</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenReject(req)}
                            disabled={loadingId === req.id}
                            title="Reject Leave"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleViewDetail(req)}
                        >
                          <Eye size={14} />
                          <span>Review</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Leave Approval / Review Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Leave Request Details"
        footer={
          selectedRequest?.status === 'Pending' ? (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleOpenReject(selectedRequest)}
                disabled={loadingId === selectedRequest?.id}
              >
                <X size={14} />
                <span>Reject Leave</span>
              </button>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleApprove(selectedRequest.id, selectedRequest.employeeName)}
                disabled={loadingId === selectedRequest?.id}
              >
                <Check size={14} />
                <span>Approve Leave</span>
              </button>
            </>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </button>
          )
        }
      >
        {selectedRequest && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-light)' }}>
              <img
                src={selectedRequest.avatar}
                alt={selectedRequest.employeeName}
                style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedRequest.employeeName}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedRequest.department} • {selectedRequest.employeeId}
                </div>
              </div>
              <StatusBadge status={selectedRequest.status} />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Leave Type</label>
                <div className="form-value-display">{selectedRequest.leaveType}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <div className="form-value-display">
                  {selectedRequest.days} Day{selectedRequest.days > 1 ? 's' : ''} ({selectedRequest.startDate} to {selectedRequest.endDate})
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Reason Stated by Employee</label>
                <div className="form-value-display" style={{ lineHeight: 1.6 }}>
                  {selectedRequest.reason}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Submitted On</label>
                <div className="form-value-display">{selectedRequest.submittedDate}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Current Decision</label>
                <div className="form-value-display">
                  {selectedRequest.status === 'Approved' && `Approved by ${selectedRequest.approvedBy} on ${selectedRequest.approvedDate}`}
                  {selectedRequest.status === 'Rejected' && `Rejected: ${selectedRequest.rejectReason}`}
                  {selectedRequest.status === 'Pending' && 'Pending HR Administrator Review'}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Confirm Leave Rejection"
        footer={
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim() || loadingId === selectedRequest?.id}
            >
              Confirm Rejection
            </button>
          </>
        }
      >
        {selectedRequest && (
          <div>
            <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
              Please provide a clear justification for rejecting <strong>{selectedRequest.employeeName}</strong>'s request for <strong>{selectedRequest.leaveType}</strong>.
            </p>
            <div className="form-group">
              <label className="form-label required">Rejection Reason</label>
              <textarea
                className="input-control"
                rows={3}
                style={{ height: 'auto', padding: 'var(--space-3)' }}
                placeholder="e.g. Critical release sprint, team capacity constraints..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
