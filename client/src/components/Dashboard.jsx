import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import Upload from "../components/Upload";
import Shorts from "../components/Shorts";
import BottomNav from "../components/BottomNav";

const Dashboard = () => {
  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden text-purple-900">
      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden max-h-screen md:block w-72 bg-white bg-opacity-70 backdrop-blur-md border-r border-pink-400 shadow-md">
          <Sidebar />
        </div>

        {/* Main content with scrollable area */}
        <main className="flex-1 overflow-y-auto max-h-screen p-4">
          <div className="w-full max-w-6xl mx-auto">
            <Routes>
              <Route index element={<Feed />} />
              <Route path="feed" element={<Feed />} />
              <Route path="upload" element={<Upload />} />
              <Route path="shorts" element={<Shorts />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Bottom nav */}
      <div className="md:hidden block bg-white bg-opacity-80 backdrop-blur-md border-t border-pink-400 shadow-md h-16">
        <BottomNav />
      </div>
    </div>
  );
};

export default Dashboard;
