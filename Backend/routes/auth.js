import express from "express";
import User from "../models/User.js";
import { createAccessToken } from "../utils/jwt.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, phone, password, college, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        detail: "Name, email, and password are required"
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        detail: "Password must be at least 6 characters"
      });
    }
    
    // Check for duplicate email
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUserByEmail) {
      return res.status(400).json({
        detail: "Email address already registered"
      });
    }
    
    // Check for duplicate phone number
    if (phone) {
      const existingUserByPhone = await User.findOne({ phone: phone.trim() });
      if (existingUserByPhone) {
        return res.status(400).json({
          detail: "Phone number already registered"
        });
      }
    }
    
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : null,
      password,
      college: college ? college.trim() : null,
      role: role || "student"
    });
    
    await user.save();
    
    const accessToken = createAccessToken(user._id.toString(), user.email);
    
    res.status(201).json({
      access_token: accessToken,
      token_type: "bearer",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        detail: "Email already registered"
      });
    }
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        detail: messages.join(", ")
      });
    }
    
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        detail: "Email and password are required"
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(401).json({
        detail: "Incorrect email or password"
      });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        detail: "Incorrect email or password"
      });
    }
    
    if (!user.isActive) {
      return res.status(403).json({
        detail: "Account is inactive"
      });
    }
    
    const accessToken = createAccessToken(user._id.toString(), user.email);
    
    res.json({
      access_token: accessToken,
      token_type: "bearer",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", authenticate, async (req, res) => {
  res.json({
    id: req.user._id.toString(),
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    college: req.user.college,
    bio: req.user.bio,
    avatar: req.user.avatar,
    is_active: req.user.isActive
  });
});

router.put("/me", authenticate, async (req, res, next) => {
  try {
    const { name, phone, college, bio, avatar } = req.body;

    if (typeof name === "string" && name.trim()) {
      req.user.name = name.trim();
    }

    if (typeof phone === "string") {
      req.user.phone = phone.trim() || null;
    }

    if (typeof college === "string") {
      req.user.college = college.trim() || null;
    }

    if (typeof bio === "string") {
      req.user.bio = bio.trim();
    }

    if (typeof avatar === "string") {
      req.user.avatar = avatar.trim() || null;
    }

    await req.user.save();

    res.json({
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      college: req.user.college,
      bio: req.user.bio,
      avatar: req.user.avatar,
      is_active: req.user.isActive
    });
  } catch (error) {
    next(error);
  }
});

export default router;

