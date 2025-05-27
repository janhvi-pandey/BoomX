import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { BiSolidVideos } from 'react-icons/bi';
import { SiYoutubeshorts } from 'react-icons/si';
import { FaCloudArrowUp, FaUser } from 'react-icons/fa6';

const navItems = [
  { to: '/', icon: <FaHome size={22} />, label: 'Home' },
  { to: '/feed', icon: <BiSolidVideos size={22} />, label: 'Feed' },
  { to: '/shorts', icon: <SiYoutubeshorts size={22} />, label: 'Shorts' },
  { to: '/upload', icon: <FaCloudArrowUp size={22} />, label: 'Upload' },
  // { to: '/profile', icon: <FaUser size={22} />, label: 'User' },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#2e002e] text-white border-t border-[#622a6d] flex justify-around items-center py-3 md:hidden z-50 rounded-t-2xl">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs font-medium px-2 py-1 rounded-md transition-all duration-300 ${
              isActive
                ? 'bg-[#622a6d] text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`
          }
        >
          {icon}
          <span className="mt-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
