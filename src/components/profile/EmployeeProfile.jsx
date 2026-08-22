import React, { useState, useEffect } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { PersonalInfoTab } from './PersonalInfoTab';
import { JobInfoTab } from './JobInfoTab';
import { PrivateInfoTab } from './PrivateInfoTab';
import { SalaryInfoTab } from './SalaryInfoTab';
import { AttendanceTab } from './AttendanceTab';
import { TimeOffTab } from './TimeOffTab';
import { SecurityTab } from './SecurityTab';
import { Tabs } from '../common/Tabs';
import { SkeletonProfile } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { employeeService } from '../../services/employeeService';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import {
  User,
  Briefcase,
  Lock,
  BadgePercent,
  Clock,
  CalendarCheck2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const EmployeeProfile = () => {
  const { selectedEmployeeId, navigateTo, refreshData } = useApp();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Load employee data
  useEffect(() => {
    if (!selectedEmployeeId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    employeeService
      .getEmployeeById(selectedEmployeeId)
      .then((data) => {
        setEmployee(data);
        setFormData(JSON.parse(JSON.stringify(data)));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load employee details', err);
        setLoading(false);
      });
  }, [selectedEmployeeId]);

  const handleStartEdit = () => {
    setFormData(JSON.parse(JSON.stringify(employee)));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(JSON.parse(JSON.stringify(employee)));
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!formData.name?.trim() || !formData.workEmail?.trim()) {
      error('Please fill in all mandatory fields.');
      return;
    }

    try {
      setIsSaving(true);
      const updated = await employeeService.updateEmployee(selectedEmployeeId, formData);
      setEmployee(updated);
      setFormData(JSON.parse(JSON.stringify(updated)));
      setIsEditing(false);
      await refreshData();
      success('Employee profile and compensation parameters updated successfully.');
    } catch (err) {
      error(`Unable to update employee: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <SkeletonProfile />;
  }

  if (!employee) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Employee not found"
        description="The requested employee record could not be loaded or was removed."
        actionLabel="Back to Employees"
        onAction={() => navigateTo('employees')}
      />
    );
  }

  const profileTabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'job', label: 'Job Information', icon: Briefcase },
    { id: 'private', label: 'Private Information', icon: Lock },
    { id: 'salary', label: 'Salary Information', icon: BadgePercent },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'timeoff', label: 'Time Off', icon: CalendarCheck2 },
    { id: 'security', label: 'Security', icon: ShieldCheck }
  ];

  return (
    <div>
      {/* Profile Header Card */}
      <ProfileHeader
        employee={formData || employee}
        isEditing={isEditing}
        onEdit={handleStartEdit}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onBack={() => navigateTo('employees')}
        isSaving={isSaving}
      />

      {/* 7 Tabs Navigation */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Tabs
          tabs={profileTabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab)}
        />
      </div>

      {/* Tab Contents */}
      {activeTab === 'personal' && (
        <PersonalInfoTab
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
        />
      )}

      {activeTab === 'job' && (
        <JobInfoTab
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
        />
      )}

      {activeTab === 'private' && (
        <PrivateInfoTab
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
        />
      )}

      {activeTab === 'salary' && (
        <SalaryInfoTab
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
        />
      )}

      {activeTab === 'attendance' && (
        <AttendanceTab employeeId={employee.id} />
      )}

      {activeTab === 'timeoff' && (
        <TimeOffTab employeeId={employee.id} />
      )}

      {activeTab === 'security' && (
        <SecurityTab employee={employee} />
      )}
    </div>
  );
};
