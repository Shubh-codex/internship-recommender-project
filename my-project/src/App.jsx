import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";
import InternshipSearchPage from "./pages/InternshipSearchPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import LiveInternshipPage from "./pages/LiveInternshipPage"; // 👈 import your new page
import CompaniesPage from "./pages/CompaniesPage";
import SavedInternshipsPage from './pages/SavedInternshipsPage';
import BuildSkillsPage from "./pages/BuildSkillsPage";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading InternMatch...</p>
        </div>
      </div>
    );
  }

  const searchParams = new URLSearchParams(location.search);
  const forceView = searchParams.get("forceView");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/signup"
        element={
          forceView === "signup" ? (
            <SignupPage />
          ) : user ? (
            <Navigate to="/welcome" replace />
          ) : (
            <SignupPage />
          )
        }
      />
      <Route
        path="/login"
        element={
          forceView === "login" ? (
            <LoginPage />
          ) : user ? (
            <Navigate to="/welcome" replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/welcome"
        element={user ? <WelcomePage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/internships"
        element={user ? <InternshipSearchPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/live-internships"
        element={user ? <LiveInternshipPage /> : <Navigate to="/login" replace />} // 👈 New Route
      />
      <Route
        path="/companies"
        element={user ? <CompaniesPage /> : <Navigate to="/login" replace />} // 👈 New Route
      />
      <Route
        path="/profile"
        element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/dashboard"
        element={user ? <DashboardPage /> : <Navigate to="/login" replace />}
      />
      <Route path="/saved" element={<SavedInternshipsPage />} />
      <Route path="/build-skills" element={<BuildSkillsPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
