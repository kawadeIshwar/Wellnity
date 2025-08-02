import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const nav = useNavigate(); // for programmatic navigation
  const location = useLocation(); // to track current route

  const [isLoggedIn, setIsLoggedIn] = useState(false); // user login state
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu toggle

  // Run this whenever the route changes
  useEffect(() => {
    // Check if token exists in localStorage
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location.pathname]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    nav("/login");
  };

  return (
    <nav className="bg-purple-950 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Brand logo */}
        <Link to="/dashboard" className="text-3xl font-bold">
          Wellnity
        </Link>

        {/* Hamburger icon (mobile only) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none text-2xl"
        >
          ☰
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6 items-center">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300 hover:underline transition">
                Dashboard
              </Link>
              <Link to="/my-sessions" className="hover:text-gray-300 hover:underline transition">
                My Sessions
              </Link>
              <Link to="/edit/new" className="hover:text-gray-300 hover:underline transition">
                New Session
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile links */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300 transition">
                Dashboard
              </Link>
              <Link to="/my-sessions" className="hover:text-gray-300 transition">
                My Sessions
              </Link>
              <Link to="/edit/new" className="hover:text-gray-300 transition">
                New Session
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300 transition">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
