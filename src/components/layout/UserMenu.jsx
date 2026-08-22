import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, Settings, LogOut, ChevronDown, Shield, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export const UserMenu = () => {
  const { currentUser, navigateTo } = useApp();
  const { info } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    info('Logged out simulation. In production, this clears the Odoo session.');
  };

  return (
    <div className="user-profile-menu-container" ref={menuRef}>
      <div
        className="user-profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" style={{ width: '36px', height: '36px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {currentUser.name}
          </span>
          <span style={{ fontSize: '0.725rem', color: 'var(--primary-600)', fontWeight: 600 }}>
            {currentUser.role}
          </span>
        </div>
        <ChevronDown size={14} color="var(--text-muted)" style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </div>

      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="dropdown-user-header">
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{currentUser.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', color: 'var(--primary-600)', fontSize: '0.75rem', fontWeight: 600 }}>
              <Shield size={12} />
              {currentUser.role}
            </div>
          </div>

          <button
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              navigateTo('profile');
            }}
          >
            <UserCircle size={16} />
            <span>My Profile</span>
          </button>

          <button
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false);
              navigateTo('salary');
            }}
          >
            <Settings size={16} />
            <span>Salary Config</span>
          </button>

          <div style={{ height: '1px', background: 'var(--border-light)', margin: '4px 0' }} />

          <button className="dropdown-item danger" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};
