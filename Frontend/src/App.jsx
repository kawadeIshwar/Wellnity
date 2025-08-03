import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import MySessions from "./Pages/MySessions";
import SessionEditor from "./Pages/SessionEditor";
import Navbar from "./Components/Navbar";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar always shows at the top */}
      <Navbar />

      <Routes>
        {/* Public Routes (no login needed) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Dashboard Route */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Private Routes (login required) */}
        <Route
          path="/my-sessions"
          element={
            <PrivateRoute>
              <MySessions />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <SessionEditor />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

