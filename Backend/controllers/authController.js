// backend/controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// -------- Register New User --------
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    // Hash the password before saving
    const hashed = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = await User.create({ email, password_hash: hashed });

    res.status(201).json({ msg: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------- Login Existing User --------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Compare entered password with hashed password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ msg: "Invalid password" });

    // Create JWT token (valid for 1 day)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
