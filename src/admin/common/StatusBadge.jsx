import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase().replace(/[\s/]/g, '-');

  let badgeClass = 'offline';
  let label = status;

  if (normalized.includes('present') || normalized === 'checked-in') {
    badgeClass = 'present';
    label = 'Present';
  } else if (normalized.includes('checked-out') || normalized === 'absent') {
    badgeClass = 'checked-out';
    label = 'Checked Out';
  } else if (normalized.includes('break')) {
    badgeClass = 'on-break';
    label = 'On Break';
  } else if (normalized.includes('leave') || normalized.includes('approved')) {
    badgeClass = 'on-leave';
    label = status.includes('Approved') ? 'Approved' : 'On Approved Leave';
  } else if (normalized.includes('pending')) {
    badgeClass = 'pending';
    label = 'Pending';
  } else if (normalized.includes('rejected')) {
    badgeClass = 'rejected';
    label = 'Rejected';
  } else if (normalized.includes('offline') || normalized.includes('not-started')) {
    badgeClass = 'offline';
    label = 'Offline / Not Started';
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      <span className="badge-dot" />
      {label}
    </span>
  );
};
