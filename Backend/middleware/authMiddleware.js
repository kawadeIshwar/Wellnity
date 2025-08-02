// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from request header (format: Bearer <token>)
  const token = req.headers.authorization?.split(" ")[1];

  // If token is missing, stop and send error
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    // Check if the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user ID from token to request object
    req.userId = decoded.userId;

    // Go to next step (route/controller)
    next();
  } catch (err) {
    // If token is not valid, send error
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;
