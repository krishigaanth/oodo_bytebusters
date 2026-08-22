import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import { attendanceService } from '../services/attendanceService';
import { leaveService } from '../services/leaveService';
import { salaryService } from '../services/salaryService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Current Logged In HR Admin User
  const [currentUser] = useState({
    name: 'Ananya Deshmukh',
    role: 'HR Administrator',
    email: 'ananya.d@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    department: 'Human Resources'
  });

  // Global KPI Summary Metrics
  const [kpiMetrics, setKpiMetrics] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingRequests: 0,
    loading: true
  });

  // Data cache
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Fetch / Refresh all state
  const refreshData = useCallback(async () => {
    try {
      const [emps, atts, leaves] = await Promise.all([
        employeeService.getEmployees(),
        attendanceService.getAllAttendance(),
        leaveService.getAllRequests()
      ]);

      setEmployees(emps);
      setAttendanceRecords(atts);
      setLeaveRequests(leaves);

      const presentCount = atts.filter(a => a.status === 'Present' || a.status === 'Late').length;
      const leaveCount = atts.filter(a => a.status === 'On Approved Leave' || a.status === 'Leave').length;
      const pendingCount = leaves.filter(l => l.status === 'Pending').length;

      setKpiMetrics({
        totalEmployees: emps.length,
        presentToday: presentCount,
        onLeave: leaveCount,
        pendingRequests: pendingCount,
        loading: false
      });
    } catch (err) {
      console.error('Failed to load HRMS global state', err);
      setKpiMetrics(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Navigate helper
  const navigateTo = (view, empId = null) => {
    setCurrentView(view);
    if (empId) {
      setSelectedEmployeeId(empId);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        selectedEmployeeId,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        globalSearch,
        setGlobalSearch,
        currentUser,
        kpiMetrics,
        employees,
        attendanceRecords,
        leaveRequests,
        refreshData,
        navigateTo,
        setSelectedEmployeeId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
