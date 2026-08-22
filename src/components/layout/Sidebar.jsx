import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck2,
  BadgePercent,
  UserCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const {
    currentView,
    navigateTo,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    kpiMetrics,
    currentUser
  } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users,
      badge: kpiMetrics.totalEmployees > 0 ? kpiMetrics.totalEmployees : null
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: Clock,
      badge: null
    },
    {
      id: 'timeoff',
      label: 'Time Off',
      icon: CalendarCheck2,
      badge: kpiMetrics.pendingRequests > 0 ? kpiMetrics.pendingRequests : null
    },
    {
      id: 'salary',
      label: 'Salary / Payroll',
      icon: BadgePercent,
      badge: null
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: UserCircle2,
      badge: null
    }
  ];

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="brand-logo" onClick={() => navigateTo('dashboard')} style={{ cursor: 'pointer' }}>
            <img src="/dayflow-logo.svg" alt="Dayflow Logo" className="brand-icon" />
            {!sidebarCollapsed && (
              <div className="brand-title">
                DAYFLOW
                <span className="brand-badge">HRMS</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="sidebar-toggle-btn"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav">
          {!sidebarCollapsed && <div className="nav-section-title">Main Navigation</div>}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'employees' && currentView === 'employee-detail');

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(item.id);
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="nav-item-icon" />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {!sidebarCollapsed && item.badge && (
                  <span className="nav-item-badge">{item.badge}</span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Bottom User / Role Card */}
        <div className="sidebar-footer">
          <div className="user-mini-profile">
            <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" />
            {!sidebarCollapsed && (
              <div className="user-info">
                <div className="user-name">{currentUser.name}</div>
                <div className="user-role-badge">
                  <ShieldCheck size={12} />
                  {currentUser.role}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
