import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoPage from "./components/VideoPage";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import Login from "./components/Login";
import { VideoProvider } from "./context/video";
import { VideoFeedProvider } from "./context/VideoFeedContext";
import { UserProvider } from "./context/UserContext";
function App() {
  return (
    <Router>
      <UserProvider>
        <VideoProvider>
        <VideoFeedProvider><Routes>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/video/:id" element={<VideoPage />} />
        </Routes></VideoFeedProvider>
        
      </VideoProvider>
      </UserProvider>
      
    </Router>
  );
}

export default App;
