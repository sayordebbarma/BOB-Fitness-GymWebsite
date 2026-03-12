import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useState(() => setSidebarOpen(false), [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const memberLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/membership", label: "Membership" },
    { to: "/checkin", label: "Check In" },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/members", label: "Members" },
    { to: "/admin/award-points", label: "Award Points" },
  ];

  const links = user?.role === "admin" ? adminLinks : memberLinks;

  const SidebarContent = () => (
    <>
      <NavLink
        to="/"
        className="font-display text-primary mb-10 block text-2xl tracking-widest"
      >
        ⚡ BOB FITNESS
      </NavLink>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `px-4 py-3 text-sm tracking-widest uppercase transition-colors ${
                isActive
                  ? "bg-primary text-dark font-display"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-border mt-auto border-t pt-6">
        <p className="mb-1 text-xs tracking-widest text-gray-600 uppercase">
          Logged in as
        </p>
        <p className="mb-4 text-sm font-medium text-white">{user?.name}</p>
        <button
          onClick={handleLogout}
          className="font-display w-full border border-red-900 py-3 text-sm tracking-widest text-red-500 transition-colors hover:bg-red-500 hover:text-white"
        >
          LOGOUT
        </button>
      </div>
    </>
  );

  return (
    <div className="bg-dark flex min-h-screen">

      {/* Desktop sidebar */}
      <aside className="bg-surface border-border fixed hidden lg:flex h-full w-64 flex-col border-r p-6">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside className={`bg-surface border-border fixed flex h-full w-64 flex-col border-r p-6 z-50 transition-transform duration-300 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen flex-1 p-6 lg:p-8">

        {/* Mobile top bar */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <NavLink
            to="/"
            className="font-display text-primary text-xl tracking-widest"
          >
            ⚡ BOB FITNESS
          </NavLink>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col gap-1.5 p-2"
          >
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
