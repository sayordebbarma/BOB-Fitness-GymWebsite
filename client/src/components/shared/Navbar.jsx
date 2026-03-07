import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">⚡ GymApp</Link>
      <div className="flex gap-6 items-center">
        <Link to="/membership" className="hover:text-gray-300 transition">Membership</Link>
        {user ? (
          <Link
            to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300 transition">Login</Link>
            <Link to="/register" className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
              Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;