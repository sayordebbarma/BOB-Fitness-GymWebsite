import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    if (menuOpen) closeMenu();
  }, [location]);

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
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  const openMenu = () => {
    setMenuOpen(true);

    // Wait for DOM to render drawer
    requestAnimationFrame(() => {
      // Overlay fade in
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      // Drawer slides in from right
      gsap.fromTo(drawerRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.4, ease: "power3.out" }
      );

      // Links stagger in
      gsap.fromTo('.drawer-link',
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.2
        }
      );

      // Bottom section fades in
      gsap.fromTo('.drawer-bottom',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", delay: 0.4 }
      );
    });
  };

  const closeMenu = () => {
    // Slide drawer out
    gsap.to(drawerRef.current, {
      x: '100%',
      duration: 0.35,
      ease: "power3.in",
      onComplete: () => setMenuOpen(false)
    });

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    });
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/membership", label: "Membership" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-dark/95 border-border border-b py-4 backdrop-blur-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 lg:px-24">
          <Link to="/" className="font-display text-primary text-2xl tracking-widest">
            ⚡ BOB FITNESS
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm tracking-widest uppercase transition-colors ${
                  location.pathname === to
                    ? "text-primary"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="bg-primary text-dark font-display px-8 py-3 tracking-widest transition-colors hover:bg-yellow-300"
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
                  className="bg-primary text-dark font-display px-8 py-3 tracking-widest transition-colors hover:bg-yellow-300"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={openMenu}
            className="flex md:hidden flex-col gap-1.5 p-2 z-50"
            aria-label="Open menu"
          >
            <span className="block w-6 h-0.5 bg-white transition-all duration-300" />
            <span className="block w-6 h-0.5 bg-white transition-all duration-300" />
            <span className="block w-5 h-0.5 bg-white transition-all duration-300" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer — rendered outside nav so it covers full screen */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            ref={overlayRef}
            onClick={closeMenu}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
          />

          {/* Drawer */}
          <div
            ref={drawerRef}
            className="fixed top-0 right-0 h-full w-72 bg-surface border-l border-border z-50 flex flex-col p-8 md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <span className="font-display text-primary text-xl tracking-widest">
                ⚡ BOB FITNESS
              </span>
              <button
                onClick={closeMenu}
                className="text-gray-500 hover:text-white transition-colors text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 flex-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`drawer-link px-4 py-3 text-sm uppercase tracking-widest transition-colors ${
                    location.pathname === to
                      ? "text-primary border-l-2 border-primary pl-3"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {label}
                </Link>
              ))}

              {/* Divider */}
              <div className="drawer-link my-4 h-px bg-border" />

              {user ? (
                <Link
                  to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="drawer-link px-4 py-3 text-sm uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`drawer-link px-4 py-3 text-sm uppercase tracking-widest transition-colors ${
                      location.pathname === "/login"
                        ? "text-primary border-l-2 border-primary pl-3"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="drawer-link px-4 py-3 text-sm uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>

            {/* Bottom CTA */}
            <div className="drawer-bottom mt-auto">
              {user ? (
                <Link
                  to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="block w-full bg-primary text-dark font-display tracking-widest py-4 text-center hover:bg-yellow-300 transition-colors"
                >
                  GO TO DASHBOARD
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="block w-full bg-primary text-dark font-display tracking-widest py-4 text-center hover:bg-yellow-300 transition-colors"
                >
                  JOIN NOW
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;