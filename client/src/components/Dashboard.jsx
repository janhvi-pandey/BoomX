import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Upload from '../components/Upload';
import Shorts from '../components/Shorts';
import BottomNav from '../components/BottomNav';
import LandingPage from './LandingPage';

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col text-purple-900">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for large screens */}
        <div className="hidden md:block w-64 bg-white bg-opacity-70 backdrop-blur-md border-r border-pink-400 shadow-md">
          <Sidebar />
        </div>

        {/* Main content area */}
        <main className="flex-1 p-4 flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="w-[95%]   ">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="feed" element={<Feed />} />
              <Route path="upload" element={<Upload />} />
              <Route path="shorts" element={<Shorts />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Bottom nav for small screens */}
      <div className="md:hidden block bg-white bg-opacity-80 backdrop-blur-md border-t border-pink-400 shadow-md h-16">
        <BottomNav />
      </div>
    </div>
  );
};

export default Dashboard;
