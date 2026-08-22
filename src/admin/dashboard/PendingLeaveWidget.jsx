import React, { useState } from 'react';
import { ArrowRight, Check, X, Calendar, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { leaveService } from '../services/leaveService';
import { Modal } from '../common/Modal';

export const PendingLeaveWidget = () => {
  const { leaveRequests, refreshData, navigateTo } = useApp();
  const { success, error } = useToast();
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loadingAction, setLoadingAction] = useState(null);

  const pendingList = leaveRequests.filter(r => r.status === 'Pending').slice(0, 3);

  const handleApprove = async (id, empName) => {
    try {
      setLoadingAction(id);
      await leaveService.approveRequest(id);
      await refreshData();
      success(`Leave request for ${empName} approved successfully.`);
    } catch (err) {
      error(`Unable to approve leave request: ${err.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleOpenReject = (req) => {
    setSelectedReq(req);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedReq) return;
    if (!rejectReason.trim()) {
      error('Please provide a reason for rejecting the leave request.');
      return;
    }
    try {
      setLoadingAction(selectedReq.id);
      await leaveService.rejectRequest(selectedReq.id, rejectReason.trim());
      await refreshData();
      success(`Leave request for ${selectedReq.employeeName} has been rejected.`);
      setRejectModalOpen(false);
    } catch (err) {
      error(`Unable to reject leave request: ${err.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Pending Leave Requests</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Requires HR Administrator action
          </p>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigateTo('timeoff')}
        >
          <span>View All ({leaveRequests.filter(r => r.status === 'Pending').length})</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {pendingList.length === 0 ? (
        <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Check size={28} color="var(--color-success)" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>All caught up!</div>
          <div style={{ fontSize: '0.8rem' }}>No pending leave requests at this moment.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {pendingList.map((req) => (
            <div
              key={req.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3)',
                background: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                gap: 'var(--space-3)',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: '180px' }}>
                <img
                  src={req.avatar}
                  alt={req.employeeName}
                  style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {req.employeeName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    <span>{req.leaveType} • {req.days} Day{req.days > 1 ? 's' : ''} ({req.startDate})</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleApprove(req.id, req.employeeName)}
                  disabled={loadingAction === req.id}
                  title="Approve Leave Request"
                >
                  <Check size={14} />
                  <span>Approve</span>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleOpenReject(req)}
                  disabled={loadingAction === req.id}
                  title="Reject Leave Request"
                >
                  <X size={14} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Leave Request"
        footer={
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleConfirmReject} disabled={!rejectReason.trim()}>
              Confirm Rejection
            </button>
          </>
        }
      >
        {selectedReq && (
          <div>
            <p style={{ marginBottom: 'var(--space-3)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Are you sure you want to reject the <strong>{selectedReq.leaveType}</strong> request from{' '}
              <strong>{selectedReq.employeeName}</strong>?
            </p>
            <div className="form-group">
              <label className="form-label required">Rejection Reason</label>
              <textarea
                className="input-control"
                rows={3}
                style={{ height: 'auto', padding: 'var(--space-3)' }}
                placeholder="Specify the reason for rejection (e.g. Critical project deadline, staffing shortages)..."
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
