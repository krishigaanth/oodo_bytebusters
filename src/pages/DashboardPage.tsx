import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  ArrowUpRight,
  Sparkles,
  Palmtree,
  Bell,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { attendanceService } from '../services/attendanceService';
import { leaveService } from '../services/leaveService';
import { notificationService } from '../services/notificationService';
import { TodayAttendanceStatus, AttendanceSummary } from '../types/attendance';
import { LeaveBalance } from '../types/leave';
import { AppNotification } from '../types/notification';
import { getGreetingTime, formatTodayDisplay } from '../utils/dateUtils';
import { CheckInOutCard } from '../components/attendance/CheckInOutCard';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { ApplyLeaveModal } from '../components/leave/ApplyLeaveModal';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [todayStatus, setTodayStatus] = useState<TodayAttendanceStatus | null>(null);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<AppNotification[]>([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [todayRes, summaryRes, balancesRes, notifsRes] = await Promise.all([
        attendanceService.getTodayStatus(user.employeeId),
        attendanceService.getAttendanceSummary(user.employeeId),
        leaveService.getLeaveBalance(user.employeeId),
        notificationService.getNotifications(user.employeeId),
      ]);

      setTodayStatus(todayRes);
      setSummary(summaryRes);
      setLeaveBalances(balancesRes);
      setRecentNotifications(notifsRes.slice(0, 3));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-white rounded-3xl p-6 border border-slate-200/80 animate-pulse" />
        <div className="h-44 bg-slate-900 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const totalAvailableLeaves = leaveBalances.reduce((sum, b) => sum + b.available, 0);

  const upcomingHolidays = [
    { name: 'Labor Day Weekend', date: 'Sept 07, 2026', days: 'Monday' },
    { name: 'Indigenous Peoples Day', date: 'Oct 12, 2026', days: 'Monday' },
    { name: 'Thanksgiving Break', date: 'Nov 26 - 27, 2026', days: 'Thu - Fri' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200/60">
              {formatTodayDisplay()}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreetingTime()}, {user?.name || 'Alex'}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Welcome to your Dayflow workspace. Here is a summary of your shift & balance records today.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            onClick={() => setIsLeaveModalOpen(true)}
            leftIcon={<CalendarDays className="w-4 h-4" />}
          >
            Apply for Leave
          </Button>
        </div>
      </div>

      {/* Prominent Check In / Check Out Card */}
      <CheckInOutCard onStatusChange={loadDashboardData} />

      {/* 5 Core Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Stat 1: Attendance Status */}
        <StatCard
          title="Attendance Status"
          value={
            todayStatus?.isCheckedIn
              ? todayStatus.isCheckedOut
                ? 'Completed'
                : 'Present'
              : 'Not Checked In'
          }
          statusDotColor={
            todayStatus?.isCheckedIn
              ? todayStatus.isCheckedOut
                ? 'bg-sky-500'
                : 'bg-emerald-500'
              : 'bg-amber-500'
          }
          statusText={todayStatus?.isCheckedIn ? 'Logged for today' : 'Action required'}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        {/* Stat 2: Check In Time */}
        <StatCard
          title="Check In Time"
          value={todayStatus?.checkInTime || '--:--'}
          subtitle="Morning check-in timestamp"
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-brand-50 text-brand-600"
        />

        {/* Stat 3: Check Out Time */}
        <StatCard
          title="Check Out Time"
          value={todayStatus?.checkOutTime || '--:--'}
          subtitle="Evening exit timestamp"
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-indigo-50 text-indigo-600"
        />

        {/* Stat 4: Working Hours */}
        <StatCard
          title="Working Hours"
          value={`${todayStatus?.currentWorkDurationHours || (summary?.totalWorkingHours ? '8.0h' : '0.0h')}`}
          subtitle={`${summary?.extraHours ? `+${summary.extraHours}h OT this month` : 'Standard 8.0h shift'}`}
          icon={<Layers className="w-5 h-5" />}
          iconBg="bg-sky-50 text-sky-600"
        />

        {/* Stat 5: Leave Balance */}
        <StatCard
          title="Leave Balance"
          value={`${totalAvailableLeaves} Days`}
          subtitle="Available across all categories"
          icon={<Palmtree className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
          onClick={() => navigate('/time-off')}
        />
      </div>

      {/* Grid: Quick Actions & Holidays & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Portal Navigation */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Quick Shortcuts
            </h3>
            <Sparkles className="w-4 h-4 text-brand-600" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate('/attendance')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-brand-50 hover:border-brand-200 border border-slate-200/80 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-white text-brand-600 shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition-colors" />
              </div>
              <p className="text-xs font-bold text-slate-900">Attendance Log</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Timesheet records</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/time-off')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-brand-50 hover:border-brand-200 border border-slate-200/80 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-white text-indigo-600 shadow-sm">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <p className="text-xs font-bold text-slate-900">Time Off</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Leave balance & history</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/payroll')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-brand-50 hover:border-brand-200 border border-slate-200/80 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-white text-emerald-600 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <p className="text-xs font-bold text-slate-900">Payslips & CTC</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Salary breakdown</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-brand-50 hover:border-brand-200 border border-slate-200/80 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-white text-purple-600 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <p className="text-xs font-bold text-slate-900">My Profile</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Skills & resume info</p>
            </button>
          </div>
        </div>

        {/* Upcoming Public Holidays */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Upcoming Holidays
            </h3>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="space-y-3">
            {upcomingHolidays.map((holiday, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">{holiday.name}</p>
                  <p className="text-[11px] text-slate-500">{holiday.days}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px]">
                  {holiday.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts & Updates */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Alerts
            </h3>
            <Bell className="w-4 h-4 text-amber-600" />
          </div>
          <div className="space-y-2.5">
            {recentNotifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent alerts.</p>
            ) : (
              recentNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => n.actionUrl && navigate(n.actionUrl)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 cursor-pointer transition-colors"
                >
                  <p className="text-xs font-bold text-slate-900">{n.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        balances={leaveBalances}
        onSuccess={loadDashboardData}
      />
    </div>
  );
};
