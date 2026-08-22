import React from 'react';

export const SkeletonCards = ({ count = 4 }) => (
  <div className="summary-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card skeleton" style={{ height: '110px' }} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 6 }) => (
  <div className="table-container" style={{ padding: 'var(--space-4)' }}>
    <div className="skeleton" style={{ height: '36px', marginBottom: '16px' }} />
    {Array.from({ length: rows }).map((_, r) => (
      <div
        key={r}
        className="skeleton"
        style={{
          height: '44px',
          marginBottom: '10px',
          opacity: 1 - r * 0.12
        }}
      />
    ))}
  </div>
);

export const SkeletonProfile = () => (
  <div className="card" style={{ padding: 'var(--space-6)' }}>
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
      <div className="skeleton skeleton-avatar" style={{ width: '80px', height: '80px' }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton-title" style={{ width: '220px' }} />
        <div className="skeleton skeleton-text" style={{ width: '140px' }} />
      </div>
    </div>
    <div className="skeleton" style={{ height: '40px', marginBottom: '24px' }} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div className="skeleton" style={{ height: '180px' }} />
      <div className="skeleton" style={{ height: '180px' }} />
    </div>
  </div>
);
