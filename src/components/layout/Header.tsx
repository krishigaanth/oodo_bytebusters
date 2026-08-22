import React from 'react';
import { Menu, Search } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { AvatarDropdown } from './AvatarDropdown';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  pageTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, pageTitle }) => {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all">
      {/* Left section: Hamburger & Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {pageTitle || 'Employee Portal'}
          </h1>
        </div>
      </div>

      {/* Center/Search (Hidden on smaller screens) */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search portal (leave, docs, payslips)..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-100/80 border border-transparent rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationDropdown />
        <div className="h-5 w-[1px] bg-slate-200 mx-1" />
        <AvatarDropdown />
      </div>
    </header>
  );
};
