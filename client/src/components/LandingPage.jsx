import React from "react";
import { Link } from "react-router-dom";
import {
  FaPlay,
  FaUserPlus,
  FaRobot,
  FaCamera,
  FaGamepad,
} from "react-icons/fa";
import {
  MdVideoLibrary,
  MdOutlineEdit,
  MdOutlineOndemandVideo,
} from "react-icons/md";
import { TiUser } from "react-icons/ti";

const FloatingIcon = ({ Icon, style }) => (
  <Icon
    className="absolute opacity-30 text-white pointer-events-none"
    style={style}
  />
);

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-300 via-pink-200 to-pink-100 flex items-center justify-center px-6 sm:px-12 overflow-hidden">
      {/* Background Icons */}
      <div className="absolute inset-0 z-0">
        <FloatingIcon
          Icon={FaPlay}
          style={{
            top: "10%",
            left: "10%",
            fontSize: "3rem",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <FloatingIcon
          Icon={MdOutlineOndemandVideo}
          style={{
            top: "50%",
            left: "10%",
            fontSize: "4rem",
            animation: "float 6s ease-in-out infinite",
          }}
        />

        <FloatingIcon
          Icon={FaCamera}
          style={{
            top: "20%",
            right: "15%",
            fontSize: "5rem",
            animation: "float 8s ease-in-out infinite",
            animationDelay: "1s",
          }}
        />
        <FloatingIcon
          Icon={FaRobot}
          style={{
            bottom: "20%",
            left: "20%",
            fontSize: "5rem",
            animation: "float 7s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />
        <FloatingIcon
          Icon={FaGamepad}
          style={{
            bottom: "30%",
            right: "25%",
            fontSize: "4rem",
            animation: "float 9s ease-in-out infinite",
            animationDelay: "1.5s",
          }}
        />
        <FloatingIcon
          Icon={MdVideoLibrary}
          style={{
            top: "35%",
            left: "40%",
            fontSize: "6rem",
            animation: "float 5s ease-in-out infinite",
            animationDelay: "2.5s",
          }}
        />
        <FloatingIcon
          Icon={MdOutlineEdit}
          style={{
            bottom: "15%",
            right: "10%",
            fontSize: "4rem",
            animation: "float 6s ease-in-out infinite",
            animationDelay: "1s",
          }}
        />
        <FloatingIcon
          Icon={TiUser}
          style={{
            top: "50%",
            right: "50%",
            fontSize: "5rem",
            animation: "float 7s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl text-center space-y-8 py-12">
        <h1
          className="lg:text-6xl text-2xl md:text-6xl font-extrabold leading-tight  text-transparent bg-clip-text"
          style={{
            background: "linear-gradient(to right, #9d3a75, #7b1c8f, #4d004d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Stream Bold. Connect Loud. Create Freely.
        </h1>

        <p className="lg:text-lg text-lg text-gray-800 max-w-2xl mx-auto leading-snug font-medium">
          <span className="font-bold text-purple-900">Welcome to BoomX</span> —
          where creators unite, ideas ignite, and streams take flight. So Let's
          Stream, dream and dive.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-3 bg-[#6a0070] hover:bg-[#4d004d] text-white font-semibold py-4 px-10 rounded-full shadow-xl transition-transform transform hover:scale-105 active:scale-100"
        >
          <FaUserPlus className="text-2xl" />
          Join the Boom
        </Link>
      </div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
