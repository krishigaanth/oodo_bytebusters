import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import {
  Clock,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  RotateCcw,
  UserCheck,
  UserX,
  Timer
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AttendanceManagement = () => {
  const { attendanceRecords, navigateTo } = useApp();
  const { info } = useToast();

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [status, setStatus] = useState('All Statuses');
  const [activeView, setActiveView] = useState('today'); // 'today' | 'weekly' | 'monthly'
  const [selectedDate, setSelectedDate] = useState('2026-08-22');

  const departments = ['All Departments', 'Engineering', 'Human Resources', 'Finance', 'Sales', 'Marketing', 'Operations'];
  const statuses = ['All Statuses', 'Present', 'Late', 'On Break', 'Checked Out', 'On Approved Leave', 'Not Started / Offline'];

  // Metrics
  const total = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
  const lateCount = attendanceRecords.filter(r => r.late && r.late.startsWith('Yes')).length;
  const leaveCount = attendanceRecords.filter(r => r.status === 'On Approved Leave').length;
  const overtimeCount = attendanceRecords.filter(r => r.overtime && r.overtime.startsWith('Yes')).length;
  const offlineCount = attendanceRecords.filter(r => r.status === 'Not Started / Offline').length;

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((rec) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        rec.employeeName.toLowerCase().includes(q) ||
        rec.employeeId.toLowerCase().includes(q) ||
        rec.department.toLowerCase().includes(q);

      const matchesDept = department === 'All Departments' || rec.department === department;
      
      const matchesStatus =
        status === 'All Statuses' ||
        (status === 'Late' ? rec.late?.startsWith('Yes') : rec.status.toLowerCase().includes(status.toLowerCase()));

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [attendanceRecords, search, department, status]);

  const handleExportCSV = () => {
    info('Exporting attendance report as CSV (Simulated Odoo Data Export).');
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartment('All Departments');
    setStatus('All Statuses');
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Attendance Management</h1>
          <p className="page-subtitle">
            Monitor real-time biometric logs, punctuality metrics, and work duration
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <button
              className={`btn btn-ghost btn-sm ${activeView === 'today' ? 'btn-secondary' : ''}`}
              onClick={() => setActiveView('today')}
              style={{ fontWeight: activeView === 'today' ? 700 : 500 }}
            >
              Today
            </button>
            <button
              className={`btn btn-ghost btn-sm ${activeView === 'weekly' ? 'btn-secondary' : ''}`}
              onClick={() => setActiveView('weekly')}
              style={{ fontWeight: activeView === 'weekly' ? 700 : 500 }}
            >
              Weekly
            </button>
            <button
              className={`btn btn-ghost btn-sm ${activeView === 'monthly' ? 'btn-secondary' : ''}`}
              onClick={() => setActiveView('monthly')}
              style={{ fontWeight: activeView === 'monthly' ? 700 : 500 }}
            >
              Monthly
            </button>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <FileSpreadsheet size={15} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="summary-card">
          <div className="summary-icon-box green">
            <UserCheck size={22} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Present</div>
            <div className="summary-value">{presentCount}</div>
            <div className="summary-context">Checked in on time</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box amber">
            <Clock size={22} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Late Arrivals</div>
            <div className="summary-value">{lateCount}</div>
            <div className="summary-context">&gt; 15 mins grace</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box blue">
            <UserX size={22} />
          </div>
          <div className="summary-content">
            <div className="summary-label">On Leave</div>
            <div className="summary-value">{leaveCount}</div>
            <div className="summary-context">Approved requests</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box indigo">
            <Timer size={22} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Overtime</div>
            <div className="summary-value">{overtimeCount}</div>
            <div className="summary-context">&gt; 9 hours logged</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box" style={{ background: 'var(--status-offline-bg)', color: 'var(--status-offline)' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="summary-content">
            <div className="summary-label">Absent / Offline</div>
            <div className="summary-value">{offlineCount}</div>
            <div className="summary-context">No punch recorded</div>
          </div>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="toolbar-bar">
        <div className="filter-group" style={{ flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-control"
              style={{ width: '100%', paddingLeft: '36px' }}
              placeholder="Search employee name, ID, dept..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} color="var(--text-muted)" />
            <input
              type="date"
              className="input-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <select
            className="select-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            className="select-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {(search || department !== 'All Departments' || status !== 'All Statuses') && (
            <button className="btn btn-ghost btn-sm" onClick={handleResetFilters}>
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No attendance records found"
          description="No punches or attendance logs match the active filters."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
                <th>Late</th>
                <th>Overtime</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr
                  key={rec.id}
                  onClick={() => navigateTo('employee-detail', rec.employeeId)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <img
                        src={rec.avatar}
                        alt={rec.employeeName}
                        style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-full)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rec.employeeName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)' }}>{rec.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="pill-tag">{rec.department}</span>
                  </td>
                  <td>{rec.date}</td>
                  <td style={{ fontWeight: rec.checkIn !== '-' ? 600 : 400 }}>{rec.checkIn}</td>
                  <td>{rec.checkOut}</td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{rec.totalHours}</td>
                  <td>
                    <StatusBadge status={rec.status} />
                  </td>
                  <td>
                    {rec.late && rec.late.startsWith('Yes') ? (
                      <span style={{ color: 'var(--status-break)', fontWeight: 600, fontSize: '0.8rem' }}>{rec.late}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>No</span>
                    )}
                  </td>
                  <td>
                    {rec.overtime && rec.overtime.startsWith('Yes') ? (
                      <span style={{ color: 'var(--status-present)', fontWeight: 600, fontSize: '0.8rem' }}>{rec.overtime}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
