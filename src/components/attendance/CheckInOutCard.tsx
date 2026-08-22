import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { TodayAttendanceStatus } from '../../types/attendance';
import { attendanceService } from '../../services/attendanceService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';

interface CheckInOutCardProps {
  onStatusChange?: () => void;
}

export const CheckInOutCard: React.FC<CheckInOutCardProps> = ({ onStatusChange }) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [todayStatus, setTodayStatus] = useState<TodayAttendanceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Live digital clock display
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadStatus = async () => {
    if (!user) return;
    try {
      const status = await attendanceService.getTodayStatus(user.employeeId);
      setTodayStatus(status);
    } catch (err) {
      console.error('Failed to load today attendance status', err);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [user]);

  const handleCheckIn = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = await attendanceService.checkIn(user.employeeId);
      setTodayStatus(updated);
      success(`Checked in successfully at ${updated.checkInTime}! Have a productive day.`, 'Check-In Recorded');
      if (onStatusChange) onStatusChange();
    } catch (err: any) {
      error(err?.message || 'Failed to record check in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = await attendanceService.checkOut(user.employeeId);
      setTodayStatus(updated);
      success(
        `Checked out successfully at ${updated.checkOutTime}. Total hours recorded: ${updated.currentWorkDurationHours}h.`,
        'Check-Out Recorded'
      );
      if (onStatusChange) onStatusChange();
    } catch (err: any) {
      error(err?.message || 'Failed to record check out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isCheckedIn = todayStatus?.isCheckedIn && !todayStatus?.isCheckedOut;
  const isCompleted = todayStatus?.isCheckedIn && todayStatus?.isCheckedOut;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-elevated border border-slate-800">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Status & Time */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                isCheckedIn
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : isCompleted
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isCheckedIn
                    ? 'bg-emerald-400 animate-pulse'
                    : isCompleted
                    ? 'bg-sky-400'
                    : 'bg-amber-400'
                }`}
              />
              {isCheckedIn
                ? 'Currently Checked In • Present'
                : isCompleted
                ? 'Day Completed • Present'
                : 'Not Checked In Yet'}
            </span>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Time</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono mt-0.5">
              {currentTime || '--:--:-- --'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-400" />
              <span>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>Standard Shift: 09:00 AM - 06:00 PM</span>
            </div>
          </div>
        </div>

        {/* Right Timestamps & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center">
            <div className="px-3 py-1">
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Check In</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {todayStatus?.checkInTime || '--:--'}
              </p>
            </div>
            <div className="px-3 py-1 border-l border-white/10">
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Check Out</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {todayStatus?.checkOutTime || '--:--'}
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center">
            {!todayStatus?.isCheckedIn ? (
              <Button
                variant="primary"
                size="lg"
                isLoading={isLoading}
                onClick={handleCheckIn}
                leftIcon={<LogIn className="w-5 h-5" />}
                className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow w-full sm:w-auto"
              >
                Check In Now
              </Button>
            ) : isCheckedIn ? (
              <Button
                variant="danger"
                size="lg"
                isLoading={isLoading}
                onClick={handleCheckOut}
                leftIcon={<LogOut className="w-5 h-5" />}
                className="bg-rose-600 hover:bg-rose-500 text-white shadow-lg w-full sm:w-auto"
              >
                Check Out
              </Button>
            ) : (
              <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Shift Complete ({todayStatus.currentWorkDurationHours} hrs)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
