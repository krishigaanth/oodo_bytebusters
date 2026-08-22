import React from 'react';
import { Search, Bell, Menu, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserMenu } from './UserMenu';
import { useToast } from '../context/ToastContext';

export const Topbar = () => {
  const {
    globalSearch,
    setGlobalSearch,
    mobileMenuOpen,
    setMobileMenuOpen,
    kpiMetrics,
    currentView,
    navigateTo
  } = useApp();
  const { info } = useToast();

  const handleSearchChange = (e) => {
    setGlobalSearch(e.target.value);
    if (currentView !== 'employees' && currentView !== 'attendance') {
      navigateTo('employees');
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search employees, ID, role..."
            value={globalSearch}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="topbar-right">
        {/* HR Privileges Indicator */}
        <div className="hr-badge-pill" title="You have Full HR Administrator Access">
          <span className="pulse-dot" />
          <span>HR Administrator</span>
        </div>

        {/* Notifications Icon Button */}
        <button
          className="icon-btn"
          onClick={() => {
            info(`You have ${kpiMetrics.pendingRequests} pending leave requests requiring review.`);
          }}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {kpiMetrics.pendingRequests > 0 && <span className="notification-badge" />}
        </button>

        {/* User Menu & Profile */}
        <UserMenu />
      </div>
    </header>
  );
};
