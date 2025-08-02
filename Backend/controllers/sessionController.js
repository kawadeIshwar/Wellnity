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

//  Create a new empty session in "draft" mode
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
    console.error("Error creating new session:", error.message);
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
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ msg: "Session ID is required" });
    }

    // Check if session exists and belongs to user
    const existingSession = await Session.findOne({ _id: sessionId, user_id: req.userId });

    if (!existingSession) {
      return res.status(404).json({ msg: "Session not found or you don't have permission to publish it" });
    }

    // Check if the title is valid before publishing
    if (
      !existingSession.title ||
      existingSession.title.trim() === "" ||
      existingSession.title === "Untitled Session"
    ) {
      return res.status(400).json({ msg: "Session must have a proper title before publishing" });
    }

    // Already published? Return as-is
    if (existingSession.status === "published") {
      console.log("Session already published:", sessionId);
      return res.json(existingSession);
    }

    // Publish it
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, user_id: req.userId },
      { status: "published", updated_at: new Date() },
      { new: true, runValidators: true }
    );

    console.log("Session published successfully:", session._id);
    res.json(session);
  } catch (error) {
    console.error("Error publishing session:", error.message);
    res.status(500).json({ msg: "Server error while publishing session" });
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
