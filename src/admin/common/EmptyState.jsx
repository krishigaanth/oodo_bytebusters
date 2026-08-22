import React from 'react';
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data to display for this view or filter.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrap">
        <Icon size={32} />
      </div>
      <div className="empty-title">{title}</div>
      <div className="empty-desc">{description}</div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-secondary btn-sm"
          style={{ marginTop: 'var(--space-4)' }}
        >
          <RefreshCw size={14} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
