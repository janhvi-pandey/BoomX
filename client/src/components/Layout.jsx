import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  return (
    <div className="grid grid-cols-[240px_1fr] h-screen bg-gray-900 text-gray-200">
      <Sidebar />
      <main className="overflow-y-auto p-8 bg-gray-800">{children}</main>
      <BottomNav />
    </div>
  );
};

export default Layout;
