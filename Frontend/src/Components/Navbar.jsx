import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Update login status when route changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    nav("/login");
  };

  return (
    <nav className="bg-purple-950 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Link to="/dashboard" className="text-3xl font-bold">
          Wellnity
        </Link>

        {/* Hamburger Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none text-2xl"
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
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
      </div>

      {/* Mobile Menu */}
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

