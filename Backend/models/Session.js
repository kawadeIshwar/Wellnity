// backend/models/Session.js

const mongoose = require("mongoose");

// Define the structure for a session document
const sessionSchema = new mongoose.Schema({
  // Reference to the user who created the session
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  // Title of the session (default: "Untitled Session")
  title: { 
    type: String, 
    required: true, 
    default: "Untitled Session" 
  },

  // Optional tags like ["javascript", "api"]
  tags: [{ 
    type: String 
  }],

  // URL to the session’s JSON content (could be from Cloudinary, etc.)
  json_file_url: { 
    type: String 
  },

  // Session status: either "draft" or "published"
  status: { 
    type: String, 
    enum: ["draft", "published"], 
    default: "draft" 
  },

  // Timestamp when the session was created
  created_at: { 
    type: Date, 
    default: Date.now 
  },

  // Timestamp when the session was last updated
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Export the model so we can use it in other files
module.exports = mongoose.model("Session", sessionSchema);

