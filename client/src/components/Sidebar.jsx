import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaListUl, FaPlayCircle, FaUpload } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <nav className="flex flex-col p-8 gap-6 bg-gray-900 border-r-4 border-orange-600 min-h-screen sticky top-0">
      <NavLink to="/" end className="mb-12 text-3xl font-extrabold text-orange-600 hover:text-orange-500">
        BoomX
      </NavLink>

      <NavLink
        to="/feed"
        className={({ isActive }) =>
          `flex items-center gap-4 text-lg px-3 py-2 rounded-md transition-colors duration-300 ${
            isActive ? 'bg-orange-600 text-gray-900 font-semibold' : 'text-gray-400 hover:bg-orange-600 hover:text-gray-900'
          }`
        }
      >
        <FaListUl className="text-xl" />
        Feed
      </NavLink>

      <NavLink
        to="/shorts"
        className={({ isActive }) =>
          `flex items-center gap-4 text-lg px-3 py-2 rounded-md transition-colors duration-300 ${
            isActive ? 'bg-orange-600 text-gray-900 font-semibold' : 'text-gray-400 hover:bg-orange-600 hover:text-gray-900'
          }`
        }
      >
        <FaPlayCircle className="text-xl" />
        Shorts
      </NavLink>

      <NavLink
        to="/upload"
        className={({ isActive }) =>
          `flex items-center gap-4 text-lg px-3 py-2 rounded-md transition-colors duration-300 ${
            isActive ? 'bg-orange-600 text-gray-900 font-semibold' : 'text-gray-400 hover:bg-orange-600 hover:text-gray-900'
          }`
        }
      >
        <FaUpload className="text-xl" />
        Upload
      </NavLink>
    </nav>
  );
};

export default Sidebar;
