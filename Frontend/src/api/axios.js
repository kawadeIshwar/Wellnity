import axios from "axios";

// Create a custom axios instance with a base URL
const instance = axios.create({
  baseURL: "http://localhost:5000/api", // All requests will start with this
});

// Add a request interceptor to attach token (if present)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Get token from browser storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to headers
  }
  return config;
});

export default instance; // Use this instance in your app
