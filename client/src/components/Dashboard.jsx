import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Upload from '../components/Upload';
import Shorts from '../components/Shorts';
import BottomNav from '../components/BottomNav';
import LandingPage from './LandingPage';

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for large screens */}
        <div className="hidden md:block w-64 bg-gray-800 border-r border-orange-600">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="feed" element={<Feed />} />
            <Route path="upload" element={<Upload />} />
            <Route path="shorts" element={<Shorts />} />
          </Routes>
        </main>
      </div>

      {/* Bottom nav for small screens */}
      <div className="md:hidden block">
        <BottomNav />
      </div>
    </div>
  );
};

export default Dashboard;