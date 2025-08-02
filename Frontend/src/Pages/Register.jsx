import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("/auth/register", { email, password });
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Register on Wellnity</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border font-bold border-gray-300 rounded-md focus:outline-none text-purple-800 text-b focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border font-bold border-gray-300 rounded-md focus:outline-none text-purple-800 focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md transition"
        >
          Register
        </button>
        <p className="text-center my-2">Already Registered?<a href="/login" className="text-blue-700">Login</a></p>
      </div>
    </div>
  );
}

export default Register;
