import React, { useState } from 'react';
import { FaPlay, FaCamera, FaRobot } from 'react-icons/fa';

const FloatingIcon = ({ Icon, style }) => (
  <Icon className="absolute opacity-20 text-purple-700 pointer-events-none" style={style} />
);

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert('Register clicked');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-pink-200 to-pink-100 px-4">
      
      {/* Floating Icons */}
      <div className="absolute inset-0 z-0">
        <FloatingIcon Icon={FaPlay} style={{ top: '15%', left: '10%', fontSize: '3rem', animation: 'float 6s ease-in-out infinite' }} />
        <FloatingIcon Icon={FaCamera} style={{ top: '40%', right: '15%', fontSize: '4rem', animation: 'float 8s ease-in-out infinite', animationDelay: '2s' }} />
        <FloatingIcon Icon={FaRobot} style={{ bottom: '20%', left: '20%', fontSize: '4rem', animation: 'float 7s ease-in-out infinite', animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-3xl bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden">

        {/* Left Content */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-br from-[#9d3a75] via-[#7b1c8f] to-[#4d004d] text-white">
          <h2 className="text-4xl font-extrabold mb-2 text-center md:text-left">
            Welcome to <span className="text-pink-300">BoomX</span>
          </h2>
          <p className="hidden md:block text-sm font-medium max-w-sm leading-snug opacity-90">
            Start your journey in a vibrant space where creators connect, stream, and thrive together.
          </p>
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <form onSubmit={handleRegister} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-purple-700 bg-purple-50 placeholder-purple-600 text-purple-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-opacity-50 transition"
              autoComplete="name"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-purple-700 bg-purple-50 placeholder-purple-600 text-purple-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-opacity-50 transition"
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-purple-700 bg-purple-50 placeholder-purple-600 text-purple-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-opacity-50 transition"
              autoComplete="new-password"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#9d3a75] via-[#7b1c8f] to-[#4d004d] hover:from-[#7b1c8f] hover:via-[#6a0070] hover:to-[#3d003d] text-white font-bold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-100"
            >
              Register
            </button>
          </form>
        </div>
      </div>

      {/* Floating animation keyframes */}
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
