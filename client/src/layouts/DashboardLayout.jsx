import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-dark">

      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col p-6 fixed h-full">
        <NavLink to="/" className="font-display text-2xl tracking-widest text-primary mb-10 block">
          ⚡ BOB FITNESS
        </NavLink>

        <nav className="flex flex-col gap-1 flex-1">
          {user?.role === 'admin' ? (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) =>
                `px-4 py-3 text-sm uppercase tracking-widest transition-colors ${
                  isActive ? 'bg-primary text-dark font-display' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }>Dashboard</NavLink>
              <NavLink to="/admin/members" className={({ isActive }) =>
                `px-4 py-3 text-sm uppercase tracking-widest transition-colors ${
                  isActive ? 'bg-primary text-dark font-display' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }>Members</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={({ isActive }) =>
                `px-4 py-3 text-sm uppercase tracking-widest transition-colors ${
                  isActive ? 'bg-primary text-dark font-display' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }>Dashboard</NavLink>
              <NavLink to="/membership" className={({ isActive }) =>
                `px-4 py-3 text-sm uppercase tracking-widest transition-colors ${
                  isActive ? 'bg-primary text-dark font-display' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }>Membership</NavLink>
            </>
          )}
        </nav>

        <div className="mt-auto border-t border-border pt-6">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Logged in as</p>
          <p className="text-white text-sm font-medium mb-4">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="w-full border border-red-900 text-red-500 font-display tracking-widest py-3 text-sm hover:bg-red-500 hover:text-white transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;