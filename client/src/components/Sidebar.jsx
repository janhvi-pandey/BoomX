import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import { BiSolidVideos } from "react-icons/bi";
import { FaCloudArrowUp } from "react-icons/fa6";
import { useUser } from "../context/UserContext";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
};

const Sidebar = () => {
  const { user } = useUser();
  const greeting = getGreeting();

  const navItems = [
    { to: "/", icon: <FaHome />, label: "Home" },
    { to: "/dashboard/feed", icon: <BiSolidVideos />, label: "Feed" },
    { to: "/dashboard/shorts", icon: <SiYoutubeshorts />, label: "Shorts" },
    { to: "/dashboard/upload", icon: <FaCloudArrowUp />, label: "Upload" },
  ];

  return (
    <nav className="flex flex-col p-6 gap-6 bg-[#2e002e] text-white min-h-screen sticky top-0 shadow-xl">
      {/* Greeting */}
      <div className="mb-10">
        <h2 className="text-lg font-medium text-gray-300">{greeting},</h2>
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#ab4081] to-[#7b1c8f] ">
          {user?.name || "User"}
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
                  ? "bg-[#622a6d] text-white"
                  : "bg-[#3a003a] hover:bg-white/20 text-gray-200"
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
