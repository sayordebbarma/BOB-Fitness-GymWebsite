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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-8">⚡ GymApp</h2>

        <nav className="flex flex-col gap-2 flex-1">
          {user?.role === 'admin' ? (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-white text-gray-900 font-semibold' : 'hover:bg-gray-800'}`
              }>Dashboard</NavLink>
              <NavLink to="/admin/members" className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-white text-gray-900 font-semibold' : 'hover:bg-gray-800'}`
              }>Members</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-white text-gray-900 font-semibold' : 'hover:bg-gray-800'}`
              }>My Dashboard</NavLink>
              <NavLink to="/membership" className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-white text-gray-900 font-semibold' : 'hover:bg-gray-800'}`
              }>Membership</NavLink>
            </>
          )}
        </nav>

        <div className="mt-auto">
          <p className="text-sm text-gray-400 mb-2">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;