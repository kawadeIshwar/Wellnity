// backend/controllers/sessionController.js
const Session = require("../models/Session");

exports.getPublicSessions = async (req, res) => {
  const sessions = await Session.find({ status: "published" });
  res.json(sessions);
};

exports.getMySessions = async (req, res) => {
  const sessions = await Session.find({ user_id: req.userId });
  res.json(sessions);
};

exports.getSessionById = async (req, res) => {
  const session = await Session.findOne({ _id: req.params.id, user_id: req.userId });
  if (!session) return res.status(404).json({ msg: "Not found" });
  res.json(session);
};

exports.createNewSession = async (req, res) => {
  try {
    console.log("Creating new session for user:", req.userId);
    
    const data = {
      user_id: req.userId,
      title: "Untitled Session",
      tags: [],
      json_file_url: "",
      status: "draft",
      created_at: new Date(),
      updated_at: new Date()
    };

    const session = await Session.create(data);
    console.log("Session created successfully:", session._id);
    
    res.status(201).json(session);
  } catch (error) {
    console.error("Error creating new session:", error);
    console.error("Error details:", error.message);
    res.status(500).json({ 
      msg: "Server error while creating new session",
      error: error.message 
    });
  }
};

exports.saveDraft = async (req, res) => {
  try {
    const { title, tags, json_file_url, sessionId } = req.body;
    
    // sessionId is required for updating
    if (!sessionId) {
      return res.status(400).json({ msg: "Session ID is required for saving draft" });
    }
    
    // Allow empty titles for drafts during auto-save, but not for manual saves
    // We'll validate on publish instead

    const data = {
      title: title.trim(),
      tags: tags || [],
      json_file_url: json_file_url || "",
      status: "draft",
      updated_at: new Date()
    };

    // Update existing session only
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, user_id: req.userId }, 
      data, 
      { new: true, runValidators: true }
    );
    
    if (!session) {
      return res.status(404).json({ msg: "Session not found or you don't have permission to edit it" });
    }

    res.json(session);
  } catch (error) {
    console.error("Error saving draft:", error);
    res.status(500).json({ msg: "Server error while saving draft" });
  }
};

exports.publishSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    // Validation
    if (!sessionId) {
      return res.status(400).json({ msg: "Session ID is required" });
    }
    
    // First, find the session to validate it before publishing
    const existingSession = await Session.findOne({ _id: sessionId, user_id: req.userId });
    
    if (!existingSession) {
      return res.status(404).json({ msg: "Session not found or you don't have permission to publish it" });
    }
    
    // Validate session data before publishing
    if (!existingSession.title || existingSession.title.trim() === "" || existingSession.title === "Untitled Session") {
      return res.status(400).json({ msg: "Session must have a proper title before publishing" });
    }
    
    // Check if session is already published (idempotency)
    if (existingSession.status === "published") {
      console.log("Session already published:", sessionId);
      return res.json(existingSession);
    }
    
    // Update the session to published
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, user_id: req.userId },
      { status: "published", updated_at: new Date() },
      { new: true, runValidators: true }
    );
    
    console.log("Session published successfully:", session._id);
    res.json(session);
  } catch (error) {
    console.error("Error publishing session:", error);
    res.status(500).json({ msg: "Server error while publishing session" });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    // Find the session and check if the user is the owner
    const session = await Session.findOne({ _id: sessionId, user_id: req.userId });
    
    if (!session) {
      return res.status(404).json({ 
        msg: "Session not found or you don't have permission to delete it" 
      });
    }
    
    // Delete the session
    await Session.findByIdAndDelete(sessionId);
    
    res.json({ 
      msg: "Session deleted successfully",
      deletedSessionId: sessionId 
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ 
      msg: "Server error while deleting session" 
    });
  }
};
