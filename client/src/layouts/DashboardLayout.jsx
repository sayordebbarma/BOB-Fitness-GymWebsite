import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="bg-dark flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-surface border-border fixed flex h-full w-64 flex-col border-r p-6">
        <NavLink
          to="/"
          className="font-display text-primary mb-10 block text-2xl tracking-widest"
        >
          ⚡ BOB FITNESS
        </NavLink>

        <nav className="flex flex-1 flex-col gap-1">
          {user?.role === "admin" ? (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `px-4 py-3 text-sm tracking-widest uppercase transition-colors ${
                    isActive
                      ? "bg-primary text-dark font-display"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/members"
                className={({ isActive }) =>
                  `px-4 py-3 text-sm tracking-widest uppercase transition-colors ${
                    isActive
                      ? "bg-primary text-dark font-display"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                Members
              </NavLink>
              <NavLink
                to="/admin/award-points"
                className={({ isActive }) =>
                  `px-4 py-3 text-sm tracking-widest uppercase transition-colors ${
                    isActive
                      ? "bg-primary text-dark font-display"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                Award Points
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-4 py-3 text-sm tracking-widest uppercase transition-colors ${
                    isActive
                      ? "bg-primary text-dark font-display"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/membership"
                className={({ isActive }) =>
                  `px-4 py-3 text-sm tracking-widest uppercase transition-colors ${
                    isActive
                      ? "bg-primary text-dark font-display"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                Membership
              </NavLink>
              <NavLink
                to="/checkin"
                className={({ isActive }) =>
                  `px-4 py-3 text-sm tracking-widest uppercase transition-colors ${
                    isActive
                      ? "bg-primary text-dark font-display"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                Check In 🔥
              </NavLink>
            </>
          )}
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
      </aside>

      {/* Main content — offset by sidebar width */}
      <main className="ml-64 min-h-screen flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
