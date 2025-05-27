import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaListUl, FaPlayCircle, FaUpload } from 'react-icons/fa';
import { FiUpload } from "react-icons/fi";
import { SiYoutubeshorts } from "react-icons/si";
import { BiSolidVideos } from "react-icons/bi";
import { FaCloudArrowUp } from "react-icons/fa6";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

const Sidebar = ({ username = 'User' }) => {
  const greeting = getGreeting();

  const navItems = [
    { to: '/', icon: <FaHome />, label: 'Home' },
    { to: '/feed', icon: <BiSolidVideos />, label: 'Feed' },
    { to: '/shorts', icon: <SiYoutubeshorts />, label: 'Shorts' },
    { to: '/upload', icon: <FaCloudArrowUp />, label: 'Upload' },
  ];

  return (
    <nav className="flex flex-col p-6 gap-6 bg-[#2e002e] text-white min-h-screen sticky top-0 shadow-xl">
      {/* Greeting */}
      <div className="mb-10">
        <h2 className="text-lg font-medium text-gray-300">{greeting},</h2>
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#9d3a75] via-[#7b1c8f] to-[#460346]">
          {username}
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-4">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                isActive
                  ? 'bg-[#622a6d] text-white'
                  : 'bg-[#3a003a] hover:bg-white/20 text-gray-200'
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
