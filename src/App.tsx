import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Pages
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import SpotDetailPage from "./pages/SpotDetailPage";
import AdminPage from "./pages/AdminPage";

const App: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading Application...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <nav
        style={{
          padding: "1rem",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile">Profile ({user?.username})</Link>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth">Login / Sign Up</Link>
        )}
      </nav>

      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/spots/:spotId" element={<SpotDetailPage />} />
          <Route
            path="/auth"
            element={isAuthenticated ? <Navigate to="/profile" /> : <AuthPage />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/admin"
            element={isAuthenticated ? <AdminPage /> : <Navigate to="/auth" />}
          />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
