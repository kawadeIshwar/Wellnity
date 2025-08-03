import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 px-4">
      <div className="bg-white p-8 rounded-2xl font-bold shadow-xl w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">
          Login to Wellnity
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 text-purple-800 font-bold px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 font-bold text-purple-800 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md text-sm font-medium transition"
        >
          Login
        </button>

                <p className="text-center my-2">Not yet Registered? <a href="/register" className="text-blue-700">Register</a></p>

      </div>
    </div>
  );
}

export default Login;

