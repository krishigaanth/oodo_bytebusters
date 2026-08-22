import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AdminLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Topbar />
        <main className="content-container">
          {children}
        </main>
      </div>
    </div>
  );
};
