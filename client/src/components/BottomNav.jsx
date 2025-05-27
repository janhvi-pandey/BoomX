import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaListUl, FaPlayCircle, FaUpload } from 'react-icons/fa';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-orange-600 flex justify-around items-center py-2 md:hidden z-50">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `text-orange-600 transition-colors duration-300 ${isActive ? 'text-orange-400' : 'text-gray-400 hover:text-orange-400'}`
        }
      >
        <FaHome size={24} />
      </NavLink>
      <NavLink
        to="/feed"
        className={({ isActive }) =>
          `text-orange-600 transition-colors duration-300 ${isActive ? 'text-orange-400' : 'text-gray-400 hover:text-orange-400'}`
        }
      >
        <FaListUl size={24} />
      </NavLink>
      <NavLink
        to="/shorts"
        className={({ isActive }) =>
          `text-orange-600 transition-colors duration-300 ${isActive ? 'text-orange-400' : 'text-gray-400 hover:text-orange-400'}`
        }
      >
        <FaPlayCircle size={24} />
      </NavLink>
      <NavLink
        to="/upload"
        className={({ isActive }) =>
          `text-orange-600 transition-colors duration-300 ${isActive ? 'text-orange-400' : 'text-gray-400 hover:text-orange-400'}`
        }
      >
        <FaUpload size={24} />
      </NavLink>
    </nav>
  );
};

export default BottomNav;
