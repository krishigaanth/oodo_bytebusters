import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  DollarSign,
  Info,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { AppNotification, NotificationCategory } from '../types/notification';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { formatDateDisplay } from '../utils/dateUtils';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await notificationService.getNotifications(user.employeeId);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAsRead = async (id: string, actionUrl?: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    if (actionUrl) {
      navigate(actionUrl);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await notificationService.markAllAsRead(user.employeeId);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    success('All alerts marked as read', 'Notifications');
  };

  const handleClearAll = async () => {
    if (!user) return;
    await notificationService.clearAll(user.employeeId);
    setNotifications([]);
    success('All notifications have been cleared.', 'Notifications Cleared');
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread' && n.isRead) return false;
    if (filter === 'read' && !n.isRead) return false;
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'attendance':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'leave':
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
      case 'payroll':
        return <DollarSign className="w-4 h-4 text-sky-600" />;
      default:
        return <Info className="w-4 h-4 text-brand-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-50 text-brand-600">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Notification Center
              </h2>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Stay updated on your leave requests, attendance logs, and corporate announcements.
            </p>
          </div>
        </div>

        {/* Bulk Action buttons */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              leftIcon={<CheckCheck className="w-4 h-4" />}
            >
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
        {/* Status Filters */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unread'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'read'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Categories</option>
            <option value="leave">Leave & Time Off</option>
            <option value="payroll">Payroll & Wages</option>
            <option value="attendance">Attendance & Shift</option>
            <option value="announcement">Announcements</option>
            <option value="system">System Alerts</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-slate-200/80" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No notifications found"
            description="You are all caught up! No notifications match the selected filter criteria."
          />
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMarkAsRead(item.id, item.actionUrl)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !item.isRead
                  ? 'bg-white border-brand-200/90 shadow-card hover:border-brand-300'
                  : 'bg-white/80 border-slate-200/80 hover:bg-white shadow-subtle'
              }`}
            >
              {/* Category Icon */}
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  !item.isRead ? 'bg-brand-50 text-brand-600 ring-2 ring-brand-100' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {getCategoryIcon(item.category)}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-brand-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {formatDateDisplay(item.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>

                {item.actionUrl && (
                  <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                    <span>View associated record</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
