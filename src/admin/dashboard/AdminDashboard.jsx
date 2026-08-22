import React from 'react';
import { SummaryCards } from './SummaryCards';
import { AttendanceOverview } from './AttendanceOverview';
import { PendingLeaveWidget } from './PendingLeaveWidget';
import { RecentActivity } from './RecentActivity';
import { DepartmentSummary } from './DepartmentSummary';
import { useApp } from '../context/AppContext';
import { SkeletonCards } from '../common/Skeleton';
import { Sparkles } from 'lucide-react';

export const AdminDashboard = () => {
  const { kpiMetrics, currentUser } = useApp();

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Good Morning, HR Admin
          </h1>
          <p className="page-subtitle">
            Here's what's happening across your organization today.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      {kpiMetrics.loading ? <SkeletonCards count={4} /> : <SummaryCards />}

      {/* Row 1: Attendance Overview (2/3) + Pending Leave Requests (1/3) */}
      <div className="dashboard-grid-2">
        <AttendanceOverview />
        <PendingLeaveWidget />
      </div>

      {/* Row 2: Department Summary + Recent Activity */}
      <div className="dashboard-grid-equal">
        <DepartmentSummary />
        <RecentActivity />
      </div>
    </div>
  );
};
