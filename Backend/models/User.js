// backend/models/User.js

const mongoose = require("mongoose");

// Define the structure for a user document
const userSchema = new mongoose.Schema({
  // User's email address (must be unique)
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  // Hashed password for security
  password_hash: { 
    type: String, 
    required: true 
  },

  // Account creation date
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Export the User model for use in other parts of the app
module.exports = mongoose.model("User", userSchema);
