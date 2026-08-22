import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export const AvatarDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    success('You have signed out successfully.', 'Goodbye!');
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        aria-label="User menu"
      >
        <img
          src={
            user?.avatarUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces&auto=format&q=80'
          }
          alt={user?.name || 'Alex Morgan'}
          className="w-8 h-8 rounded-xl object-cover ring-2 ring-brand-500/20"
        />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 leading-none">{user?.name || 'Alex Morgan'}</span>
          <span className="text-[11px] text-slate-500 leading-tight mt-0.5">{user?.employeeId || 'EMP001'}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200/90 shadow-elevated z-50 overflow-hidden animate-fade-in divide-y divide-slate-100">
          {/* Header Info */}
          <div className="px-4 py-3 bg-slate-50/70">
            <p className="text-xs font-bold text-slate-900">{user?.name || 'Alex Morgan'}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email || 'alex.morgan@dayflow.io'}</p>
            <span className="mt-1.5 inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
              Role: {user?.role || 'Employee'}
            </span>
          </div>

          {/* Links */}
          <div className="p-1.5 space-y-0.5">
            <button
              type="button"
              onClick={() => handleNavigate('/profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors text-left"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>My Profile</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/profile?tab=security')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors text-left"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Security & Password</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/notifications')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors text-left"
            >
              <Bell className="w-4 h-4 text-slate-400" />
              <span>Notifications</span>
            </button>
          </div>

          {/* Logout */}
          <div className="p-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
