import React, { useEffect, useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import { LANDING_URL } from "../config";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = queryParams.get("token");

    let token = tokenFromUrl;
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      // Clean query parameter from address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      token = localStorage.getItem("token");
    }

    const loginUrl = `${LANDING_URL}/login`;

    if (!token) {
      window.location.href = loginUrl;
      return;
    }

    // Check client-side token expiration
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64));
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        window.location.href = loginUrl;
        return;
      }

      setIsAuthenticated(true);
    } catch (e) {
      localStorage.removeItem("token");
      window.location.href = loginUrl;
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <h2>Verifying credentials...</h2>
          <p style={{ color: "#888" }}>Please wait while we log you in securely.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect shortly
  }

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;