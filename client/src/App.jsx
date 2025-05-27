import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import Login from "./components/Login";
import { VideoProvider } from "./context/video";
import { VideoFeedProvider } from "./context/VideoFeedContext";

function App() {
  return (
    <Router>
      <VideoProvider>
        <Routes>
      
          <Route
            path="/dashboard/*"
            element={
              <VideoFeedProvider>
                <Dashboard />
              </VideoFeedProvider>
            }
          />
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </VideoProvider>
    </Router>
  );
}

export default App;
