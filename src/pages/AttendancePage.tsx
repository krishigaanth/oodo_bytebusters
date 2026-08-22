import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { AttendanceRecord, AttendanceSummary } from '../types/attendance';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from '../contexts/AuthContext';
import { AttendanceStats } from '../components/attendance/AttendanceStats';
import { CheckInOutCard } from '../components/attendance/CheckInOutCard';
import { DataTable, ColumnDef } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const loadAttendanceData = async () => {
    const empId = user?.employeeId || user?.id || 'EMP001';
    setIsLoading(true);
    try {
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();

      const [historyData, summaryData] = await Promise.all([
        attendanceService.getAttendance(empId, { month, year }),
        attendanceService.getAttendanceSummary(empId),
      ]);

      setRecords(historyData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to load attendance data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, [user, currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (rec) => {
        const d = new Date(rec.date);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        return (
          <div>
            <span className="font-bold text-slate-900">{rec.date}</span>
            <span className="text-xs text-slate-400 ml-2">({dayName})</span>
          </div>
        );
      },
    },
    {
      key: 'checkIn',
      header: 'Check In',
      render: (rec) => (
        <span className="font-mono text-slate-800 font-semibold">
          {rec.checkIn || '--:--'}
        </span>
      ),
    },
    {
      key: 'checkOut',
      header: 'Check Out',
      render: (rec) => (
        <span className="font-mono text-slate-800 font-semibold">
          {rec.checkOut || '--:--'}
        </span>
      ),
    },
    {
      key: 'workHours',
      header: 'Work Hours',
      render: (rec) => (
        <span className="font-bold text-slate-900">
          {rec.workHours > 0 ? `${rec.workHours} hrs` : '-'}
        </span>
      ),
    },
    {
      key: 'extraHours',
      header: 'Extra / OT',
      render: (rec) =>
        rec.extraHours > 0 ? (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            +{rec.extraHours}h
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (rec) => <StatusBadge status={rec.status} size="sm" />,
    },
    {
      key: 'notes',
      header: 'Notes & Shift Details',
      render: (rec) => (
        <span className="text-xs text-slate-500 line-clamp-1">
          {rec.notes || 'Regular daily log'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Live Check In / Check Out widget */}
      <CheckInOutCard onStatusChange={loadAttendanceData} />

      {/* Top 6 Summary KPI Cards */}
      <AttendanceStats summary={summary} isLoading={isLoading} />

      {/* Timesheet Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
        {/* Month Navigator */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrevMonth}
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-bold text-slate-900 min-w-[130px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleNextMonth}
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="ghost" onClick={handleToday} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Current
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'monthly'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Monthly View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'weekly'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Weekly View
          </button>
        </div>
      </div>

      {/* Attendance History Data Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600" />
            <span>Timesheet Log ({records.length} days recorded)</span>
          </h3>
          <span className="text-xs text-slate-500">Auto-synced with biometric check-in/out</span>
        </div>

        <DataTable
          columns={columns}
          data={records}
          isLoading={isLoading}
          keyExtractor={(rec) => rec.id}
          emptyTitle="No attendance records for this period"
          emptyDescription="You haven't logged any attendance shifts for this selected month."
        />
      </div>
    </div>
  );
};
