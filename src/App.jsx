import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { EmployeeManagement } from './components/employees/EmployeeManagement';
import { EmployeeProfile } from './components/profile/EmployeeProfile';
import { AttendanceManagement } from './components/attendance/AttendanceManagement';
import { TimeOffManagement } from './components/timeoff/TimeOffManagement';
import { SalaryManagement } from './components/salary/SalaryManagement';
import { AdminProfileView } from './components/profile/AdminProfileView';

import './styles/variables.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/animations.css';

const AppContent = () => {
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

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ToastProvider>
  );
}
