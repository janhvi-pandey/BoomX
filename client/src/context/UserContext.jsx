import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: "", visible: false, type: "" });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const serverUrl = "http://localhost:5000";
  // const serverUrl = "https://server-boom-x.vercel.app";

  const showToast = (message, type = "success") => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast({ message: "", visible: false, type: "" });
    }, 2000);
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const res = await fetch(`${serverUrl}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Unauthorized");
      }
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (form) => {
    try {
      const res = await fetch(`${serverUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Login failed", "error");
        return false;
      }

      localStorage.setItem("token", data.token);
      await fetchProfile();
      showToast("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      showToast("Something went wrong. Please try again.", "error");
      return false;
    }
  };

  const register = async (form) => {
    try {
      const res = await fetch(`${serverUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return false;
      }

      navigate("/login");
      return true;
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong. Please try again later.");
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ login, register, toast, user, fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
