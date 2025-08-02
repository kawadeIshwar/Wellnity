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
    console.log("Token attached to request:", token.substring(0, 20) + "...");
  } else {
    console.log("No token found in localStorage");
  }
  return config;
});

// Add a response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token invalid or expired, clearing localStorage");
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default instance; // Use this instance in your app
