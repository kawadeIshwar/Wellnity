// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();

// Import register and login controllers
const { register, login } = require("../controllers/authController");

// Route to handle user registration
router.post("/register", register);

// Route to handle user login
router.post("/login", login);

// Export the router to be used in the main app
module.exports = router;
