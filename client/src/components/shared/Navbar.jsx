import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-surface border-border flex items-center justify-between border-b px-8 py-4">
      <Link
        to="/"
        className="font-display text-primary text-2xl tracking-widest"
      >
        ⚡ GYMAPP
      </Link>
      <div className="flex items-center gap-6">
        <Link
          to="/membership"
          className="text-sm tracking-widest text-gray-400 uppercase transition hover:text-white"
        >
          Membership
        </Link>
        {user ? (
          <Link
            to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
            className="bg-primary text-dark font-display px-5 py-2 tracking-widest transition hover:bg-yellow-300"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm tracking-widest text-gray-400 uppercase transition hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary text-dark font-display px-5 py-2 tracking-widest transition hover:bg-yellow-300"
            >
              Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
