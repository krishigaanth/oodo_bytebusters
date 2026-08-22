import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/leaveService';
import { StatusBadge } from '../common/StatusBadge';
import { CalendarCheck2, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const TimeOffTab = ({ employeeId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaveService.getRequestsByEmployee(employeeId).then(data => {
      setRequests(data);
      setLoading(false);
    });
  }, [employeeId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Leave Balances Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Casual Leave Balance</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-600)', marginTop: '4px' }}>8 / 12 Days</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>4 days utilized this fiscal year</div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sick Leave Balance</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-present)', marginTop: '4px' }}>9 / 10 Days</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>1 day utilized with medical note</div>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Earned / Annual Leave</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-leave)', marginTop: '4px' }}>14 / 18 Days</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Carry forward eligible up to 10 days</div>
        </div>
      </div>

      {/* Leave Requests History */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <CalendarCheck2 size={18} color="var(--primary-600)" />
              Leave Applications & Time-Off History
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              All submitted requests, approvals, and rejection rationales
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Review Details</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-6)' }}>
                    No leave requests found for this employee.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.leaveType}</span>
                    </td>
                    <td>{req.startDate} to {req.endDate}</td>
                    <td style={{ fontWeight: 600 }}>{req.days} Day{req.days > 1 ? 's' : ''}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.reason}>
                      {req.reason}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.submittedDate}</td>
                    <td>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {req.status === 'Approved' && (
                        <span style={{ color: 'var(--status-present)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> By {req.approvedBy} ({req.approvedDate})
                        </span>
                      )}
                      {req.status === 'Rejected' && (
                        <span style={{ color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={12} /> {req.rejectReason}
                        </span>
                      )}
                      {req.status === 'Pending' && (
                        <span style={{ color: 'var(--status-break)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> Awaiting HR Action
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
