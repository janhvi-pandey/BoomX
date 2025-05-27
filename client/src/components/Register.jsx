import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";

const FloatingIcon = ({ Icon, style }) => (
  <Icon
    className="absolute opacity-20 text-purple-700 pointer-events-none"
    style={style}
  />
);

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }
      setForm({ name: "", email: "", password: "" });

      navigate("/login");
    } catch (error) {
      alert("Something went wrong. Please try again later.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-pink-200 to-pink-100 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <FloatingIcon
          Icon={FaPlay}
          style={{
            top: "15%",
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
            animationDelay: "0.5s",
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
          Icon={FaUserPlus}
          style={{
            top: "60%",
            right: "40%",
            fontSize: "4rem",
            animation: "float 7s ease-in-out infinite",
            animationDelay: "2.2s",
          }}
        />
      </div>

      <div className="relative z-10 w-[88%] max-w-3xl bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Content */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-gradient-to-br from-[#9d3a75] via-[#7b1c8f] to-[#4d004d] text-white">
          <h2 className="lg:text-4xl text-2xl font-extrabold mb-2 text-center md:text-left">
            Welcome to <span className="text-pink-300">BoomX</span>
          </h2>
          <p className="hidden md:block text-sm font-medium max-w-sm leading-snug opacity-90">
            Start your journey in a vibrant space where creators connect,
            stream, and thrive together.
          </p>
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <form onSubmit={handleRegister} className="space-y-4 md:space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-purple-700 bg-purple-50 placeholder-gray-600 text-purple-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-opacity-50 transition"
              autoComplete="name"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-purple-700 bg-purple-50 placeholder-gray-600 text-purple-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-opacity-50 transition"
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-purple-700 bg-purple-50 placeholder-gray-600 text-purple-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-opacity-50 transition"
              autoComplete="new-password"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#9d3a75] via-[#7b1c8f] to-[#4d004d] hover:from-[#7b1c8f] hover:via-[#6a0070] hover:to-[#3d003d] text-white font-bold py-2 rounded-lg"
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-black font-medium">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-pink-600 hover:text-pink-900 font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Register;
