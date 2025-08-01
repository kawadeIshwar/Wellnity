import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import MySessions from "./Pages/MySessions";
import SessionEditor from "./Pages/SessionEditor";
import Navbar from "./Components/Navbar";
import PrivateRoute from "./Components/PrivateRoute";
import ConnectionTest from "./Components/ConnectionTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes with Navbar */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Navbar />
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-sessions"
          element={
            <PrivateRoute>
              <Navbar />
              <MySessions />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <Navbar />
              <SessionEditor />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
