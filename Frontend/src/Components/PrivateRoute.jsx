import { Navigate } from "react-router-dom";

// It only shows the page if the user is logged in
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Get token from localStorage

  // If token is found, show the child component (protected page)
  // If no token, send user to login page
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
// This component is used to protect routes that require authentication
