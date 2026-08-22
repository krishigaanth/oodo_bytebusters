import React from 'react';
import { EmployeeCard } from './EmployeeCard';
import { EmptyState } from '../common/EmptyState';
import { Users } from 'lucide-react';

export const EmployeeGrid = ({ employees, onSelectEmployee, onResetFilters }) => {
  if (!employees || employees.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No employees found"
        description="Try adjusting your search criteria or clearing active filters."
        actionLabel="Reset Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="employee-grid">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onClick={() => onSelectEmployee(employee.id)}
        />
      ))}
    </div>
  );
};
