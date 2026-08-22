import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path: string): string => {
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path.startsWith('/profile')) return 'Employee Profile & Records';
    if (path.startsWith('/attendance')) return 'Attendance & Timesheets';
    if (path.startsWith('/time-off')) return 'Time Off & Leave Management';
    if (path.startsWith('/payroll')) return 'Payroll & Compensation';
    if (path.startsWith('/notifications')) return 'Notification Center';
    return 'Dayflow HRMS';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          pageTitle={getPageTitle(location.pathname)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
