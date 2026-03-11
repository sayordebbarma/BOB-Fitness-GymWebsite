import { Routes, Route, Navigate } from "react-router-dom";
import useLenis from "./hooks/useLenis";
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
import ComingSoon from "./pages/ComingSoon";

const App = () => {
  useLenis();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
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
  );
};

export default App;
