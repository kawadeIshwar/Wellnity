// backend/routes/sessionRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// Import all session controller functions
const {
  getPublicSessions,
  getMySessions,
  getSessionById,
  createNewSession,
  saveDraft,
  publishSession,
  deleteSession
} = require("../controllers/sessionController");

// Public route: get all published sessions
router.get("/sessions", getPublicSessions);

// Private routes (require auth)
router.get("/my-sessions", auth, getMySessions); // Get current user's sessions
router.get("/my-sessions/:id", auth, getSessionById); // Get one session by ID (if owned by user)
router.post("/my-sessions/create", auth, createNewSession); // Create a new draft session
router.post("/my-sessions/save-draft", auth, saveDraft); // Save changes to a draft
router.post("/my-sessions/publish", auth, publishSession); // Publish a session
router.delete("/my-sessions/:id", auth, deleteSession); // Delete a session

// Export all routes
module.exports = router;

