import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Upload from "../components/Upload";
import Shorts from "../components/Shorts";
import BottomNav from "../components/BottomNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return null;

  return (
    <div className="h-screen max-h-screen flex flex-col text-purple-900">
      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block w-72 bg-white bg-opacity-70 backdrop-blur-md border-r border-pink-400 shadow-md">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 pb-20"> 
          <div className="w-full mx-auto">
            <Routes>
              <Route index element={<Feed />} />
              <Route path="feed" element={<Feed />} />
              <Route path="upload" element={<Upload />} />
              <Route path="shorts" element={<Shorts />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Bottom nav on small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white bg-opacity-80 backdrop-blur-md border-t border-pink-400 shadow-md z-50">
        <BottomNav />
      </div>
    </div>
  );
};

export default Dashboard;
