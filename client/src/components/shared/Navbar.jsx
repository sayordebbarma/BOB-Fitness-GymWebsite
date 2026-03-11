import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  // Shrink navbar on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.1 },
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark/95 border-border border-b py-4 backdrop-blur-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 lg:px-16">
        <Link
          to="/"
          className="font-display text-primary text-2xl tracking-widest"
        >
          ⚡ BOB FITNESS
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <Link
            to="/leaderboard"
            className={`text-sm tracking-widest uppercase transition-colors ${
              location.pathname === "/leaderboard"
                ? "text-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Leaderboard
          </Link>
          <Link
            to="/membership"
            className={`text-sm tracking-widest uppercase transition-colors ${
              location.pathname === "/membership"
                ? "text-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Membership
          </Link>

          {user ? (
            <Link
              to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              className="bg-primary text-dark font-display px-8 py-4 tracking-widest transition-colors hover:bg-yellow-300"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm tracking-widest uppercase transition-colors ${
                  location.pathname === "/login"
                    ? "text-primary"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-dark font-display px-10 py-4 tracking-widest transition-colors hover:bg-yellow-300"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
