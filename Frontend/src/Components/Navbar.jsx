import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-3 flex gap-4">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/my-sessions">My Sessions</Link>
      <Link to="/edit/new">New Session</Link>
      <button onClick={handleLogout} className="ml-auto text-red-300 hover:text-red-500">
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
