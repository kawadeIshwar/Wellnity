// backend/controllers/sessionController.js

const Session = require("../models/Session");

//  Get all public (published) sessions
exports.getPublicSessions = async (req, res) => {
  const sessions = await Session.find({ status: "published" });
  res.json(sessions);
};

//  Get all sessions created by the logged-in user
exports.getMySessions = async (req, res) => {
  const sessions = await Session.find({ user_id: req.userId });
  res.json(sessions);
};

//  Get a specific session by ID, only if it belongs to the user
exports.getSessionById = async (req, res) => {
  const session = await Session.findOne({ _id: req.params.id, user_id: req.userId });
  if (!session) return res.status(404).json({ msg: "Not found" });
  res.json(session);
};

//  Create a new session in "draft" mode
exports.createNewSession = async (req, res) => {
  try {
    console.log("Creating new session for user:", req.userId);
    console.log("Request body:", req.body);
    const { title, tags, json_file_url } = req.body;

    // Validate required fields
    if (!req.userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const data = {
      user_id: req.userId,
      title: title ? title.trim() : "Untitled Session",
      tags: Array.isArray(tags) ? tags : [],
      json_file_url: json_file_url || "",
      status: "draft",
      created_at: new Date(),
      updated_at: new Date()
    };

    console.log("Session data to create:", data);
    const session = await Session.create(data);
    console.log("Session created successfully:", {
      id: session._id,
      title: session.title,
      status: session.status
    });

    res.status(201).json(session);
  } catch (error) {
    console.error("Error creating new session:", {
      message: error.message,
      stack: error.stack,
      userId: req.userId,
      body: req.body
    });
    res.status(500).json({
      msg: "Server error while creating new session",
      error: error.message
    });
  }
};

//  Save a draft (auto-save or manual save)
exports.saveDraft = async (req, res) => {
  try {
    const { title, tags, json_file_url, sessionId } = req.body;

    // Must provide sessionId
    if (!sessionId) {
      return res.status(400).json({ msg: "Session ID is required for saving draft" });
    }

    // Build update data
    const data = {
      title: title.trim(),
      tags: tags || [],
      json_file_url: json_file_url || "",
      status: "draft",
      updated_at: new Date()
    };

    // Update the session
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
    console.error("Error saving draft:", error.message);
    res.status(500).json({ msg: "Server error while saving draft" });
  }
};

//  Publish a session (turn from draft to published)
exports.publishSession = async (req, res) => {
  try {
    console.log("Publishing session - User:", req.userId, "Body:", req.body);
    const { sessionId } = req.body;

    if (!sessionId) {
      console.error("No session ID provided");
      return res.status(400).json({ msg: "Session ID is required" });
    }

    // Check if session exists and belongs to user
    console.log("Looking for session:", sessionId, "for user:", req.userId);
    const existingSession = await Session.findOne({ _id: sessionId, user_id: req.userId });

    if (!existingSession) {
      console.error("Session not found:", sessionId, "for user:", req.userId);
      return res.status(404).json({ msg: "Session not found or you don't have permission to publish it" });
    }

    console.log("Found session:", {
      id: existingSession._id,
      title: existingSession.title,
      status: existingSession.status
    });

    // Check if the title is valid before publishing
    if (
      !existingSession.title ||
      existingSession.title.trim() === "" ||
      existingSession.title === "Untitled Session"
    ) {
      console.error("Invalid title for publishing:", existingSession.title);
      return res.status(400).json({ msg: "Session must have a proper title before publishing" });
    }

    // Already published? Return as-is
    if (existingSession.status === "published") {
      console.log("Session already published:", sessionId);
      return res.json(existingSession);
    }

    // Publish it
    console.log("Publishing session:", sessionId);
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, user_id: req.userId },
      { status: "published", updated_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!session) {
      console.error("Failed to update session:", sessionId);
      return res.status(500).json({ msg: "Failed to publish session" });
    }

    console.log("Session published successfully:", {
      id: session._id,
      title: session.title,
      status: session.status
    });
    res.json(session);
  } catch (error) {
    console.error("Error publishing session:", {
      message: error.message,
      stack: error.stack,
      userId: req.userId,
      sessionId: req.body?.sessionId
    });
    res.status(500).json({
      msg: "Server error while publishing session",
      error: error.message
    });
  }
};

//  Delete a session (only if user owns it)
exports.deleteSession = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const session = await Session.findOne({ _id: sessionId, user_id: req.userId });

    if (!session) {
      return res.status(404).json({
        msg: "Session not found or you don't have permission to delete it"
      });
    }

    await Session.findByIdAndDelete(sessionId);

    res.json({
      msg: "Session deleted successfully",
      deletedSessionId: sessionId
    });
  } catch (error) {
    console.error("Error deleting session:", error.message);
    res.status(500).json({
      msg: "Server error while deleting session"
    });
  }
};
