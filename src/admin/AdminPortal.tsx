import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { AdminLayout } from './layout/AdminLayout';
import { AdminDashboard } from './dashboard/AdminDashboard';
import { EmployeeManagement } from './employees/EmployeeManagement';
import { EmployeeProfile } from './profile/EmployeeProfile';
import { AttendanceManagement } from './attendance/AttendanceManagement';
import { TimeOffManagement } from './timeoff/TimeOffManagement';
import { SalaryManagement } from './salary/SalaryManagement';
import { AdminProfileView } from './profile/AdminProfileView';

import './styles/variables.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/animations.css';

const AdminContent: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'employees':
        return <EmployeeManagement />;
      case 'employee-detail':
        return <EmployeeProfile />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'timeoff':
        return <TimeOffManagement />;
      case 'salary':
        return <SalaryManagement />;
      case 'profile':
        return <AdminProfileView />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout>
      {renderCurrentView()}
    </AdminLayout>
  );
};

export const AdminPortal: React.FC = () => {
  return (
    <ToastProvider>
      <AppProvider>
        <AdminContent />
      </AppProvider>
    </ToastProvider>
  );
};

export default AdminPortal;
