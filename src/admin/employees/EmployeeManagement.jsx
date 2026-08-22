import React, { useState, useMemo } from 'react';
import { EmployeeToolbar } from './EmployeeToolbar';
import { EmployeeGrid } from './EmployeeGrid';
import { EmployeeTable } from './EmployeeTable';
import { AddEmployeeModal } from './AddEmployeeModal';
import { useApp } from '../context/AppContext';

export const EmployeeManagement = () => {
  const { employees, globalSearch, setGlobalSearch, navigateTo, refreshData } = useApp();

  const [search, setSearch] = useState(globalSearch || '');
  const [department, setDepartment] = useState('All Departments');
  const [attendanceStatus, setAttendanceStatus] = useState('All Statuses');
  const [employmentType, setEmploymentType] = useState('All Employment Types');
  const [viewMode, setViewMode] = useState('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Synchronize with global search if changed externally
  React.useEffect(() => {
    if (globalSearch !== search) {
      setSearch(globalSearch);
    }
  }, [globalSearch]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setGlobalSearch(val);
  };

  const handleResetFilters = () => {
    setSearch('');
    setGlobalSearch('');
    setDepartment('All Departments');
    setAttendanceStatus('All Statuses');
    setEmploymentType('All Employment Types');
  };

  // Filtered employees memo
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // 1. Search Query
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        emp.jobTitle.toLowerCase().includes(q) ||
        emp.workEmail.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q);

      // 2. Department
      const matchesDept = department === 'All Departments' || emp.department === department;

      // 3. Attendance Status
      const matchesStatus =
        attendanceStatus === 'All Statuses' ||
        emp.attendanceStatus.toLowerCase().includes(attendanceStatus.toLowerCase());

      // 4. Employment Type
      const matchesType =
        employmentType === 'All Employment Types' || emp.employmentType === employmentType;

      return matchesSearch && matchesDept && matchesStatus && matchesType;
    });
  }, [employees, search, department, attendanceStatus, employmentType]);

  const handleSelectEmployee = (id) => {
    navigateTo('employee-detail', id);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Employees</h1>
          <p className="page-subtitle">
            Manage employee records and workforce information.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <EmployeeToolbar
        search={search}
        setSearch={handleSearchChange}
        department={department}
        setDepartment={setDepartment}
        attendanceStatus={attendanceStatus}
        setAttendanceStatus={setAttendanceStatus}
        employmentType={employmentType}
        setEmploymentType={setEmploymentType}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddEmployee={() => setIsAddModalOpen(true)}
        onResetFilters={handleResetFilters}
        totalCount={employees.length}
        filteredCount={filteredEmployees.length}
      />

      {/* Grid or Table View */}
      {viewMode === 'grid' ? (
        <EmployeeGrid
          employees={filteredEmployees}
          onSelectEmployee={handleSelectEmployee}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          onSelectEmployee={handleSelectEmployee}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEmployeeAdded={refreshData}
      />
    </div>
  );
};
