import express from "express";
import jwt from "jsonwebtoken";
import Joi from "joi";
import User from "../models/User.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().trim(),
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Helper function to set auth token cookie
const setAuthCookie = (res, token) => {
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 60 * 60 * 1000, // 1 hour
  });
};

// Helper function to create JWT token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Helper function to format user (solo datos públicos)
const formatUser = (user) => {
  const { _id, id, username, email } = user;
  return {
    id: _id?.toString() ?? id,
    username,
    email,
  };
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, email, password } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const user = new User({ username, email, password });
    await user.save();

    const token = createToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Register error:", error); 
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;

    // select('+password') porque password tiene select: false por defecto
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user._id);
    setAuthCookie(res, token);

    res.json({
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/logout
router.post("/logout", authMiddleware, (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: "Logged out successfully" });
});

// GET /api/auth/me
router.get("/me", authMiddleware, (req, res) => {
  res.json(formatUser(req.user));
});

export default router;