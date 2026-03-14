import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import useLenis from "./hooks/useLenis";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/shared/ProtectedRoute";

import Home from "./pages/Home";
import Membership from "./pages/Membership";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MemberDashboard from "./pages/member/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMembers from "./pages/admin/Members";
import CheckInPage from "./pages/member/CheckIn";
import Leaderboard from "./pages/Leaderboard";
import Contact from './pages/Contact';
import ComingSoon from "./pages/ComingSoon";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

const App = () => {
  useLenis();

  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #333",
          },
        }}
      />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<MemberDashboard />} />
          <Route path="/checkin" element={<CheckInPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute adminOnly>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/award-points" element={<ComingSoon />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
