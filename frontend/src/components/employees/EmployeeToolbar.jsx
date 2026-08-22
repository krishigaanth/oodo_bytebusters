import React from 'react';
import { Search, UserPlus, Filter, RotateCcw, LayoutGrid, List } from 'lucide-react';

export const EmployeeToolbar = ({
  search,
  setSearch,
  department,
  setDepartment,
  attendanceStatus,
  setAttendanceStatus,
  employmentType,
  setEmploymentType,
  viewMode,
  setViewMode,
  onAddEmployee,
  onResetFilters,
  totalCount,
  filteredCount
}) => {
  const departments = ['All Departments', 'Engineering', 'Human Resources', 'Finance', 'Sales', 'Marketing', 'Operations'];
  const attendanceStatuses = ['All Statuses', 'Present', 'Checked Out', 'On Break', 'Not Started / Offline', 'On Approved Leave'];
  const employmentTypes = ['All Employment Types', 'Full-time', 'Part-time', 'Contract', 'Intern'];

  const hasActiveFilters =
    search ||
    department !== 'All Departments' ||
    attendanceStatus !== 'All Statuses' ||
    employmentType !== 'All Employment Types';

  return (
    <div className="toolbar-bar">
      <div className="filter-group" style={{ flex: 1 }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-control"
            style={{ width: '100%', paddingLeft: '36px' }}
            placeholder="Search by name, ID, job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Department Filter */}
        <select
          className="select-control"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Attendance Status Filter */}
        <select
          className="select-control"
          value={attendanceStatus}
          onChange={(e) => setAttendanceStatus(e.target.value)}
        >
          {attendanceStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Employment Type Filter */}
        <select
          className="select-control"
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
        >
          {employmentTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={onResetFilters}
            title="Reset all filters"
          >
            <RotateCcw size={14} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* View Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', padding: '2px', border: '1px solid var(--border-light)' }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{
              height: '32px',
              padding: '0 8px',
              background: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
              boxShadow: viewMode === 'grid' ? 'var(--shadow-xs)' : 'none'
            }}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{
              height: '32px',
              padding: '0 8px',
              background: viewMode === 'table' ? 'var(--bg-surface)' : 'transparent',
              boxShadow: viewMode === 'table' ? 'var(--shadow-xs)' : 'none'
            }}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <List size={16} />
          </button>
        </div>

        {/* Add Employee Button */}
        <button className="btn btn-primary btn-sm" onClick={onAddEmployee}>
          <UserPlus size={16} />
          <span>Add Employee</span>
        </button>
      </div>
    </div>
  );
};
