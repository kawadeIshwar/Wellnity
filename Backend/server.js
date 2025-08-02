// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Route imports
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/auth", authRoutes); // Handles login and register
app.use("/api", sessionRoutes);   // Handles session-related routes

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
