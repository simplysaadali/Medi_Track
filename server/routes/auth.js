const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// The response body carries the user only - never the token.
const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
});

router.post("/register", async (req, res) => {
  // try
  try {
      const { name, email, password } = req.body;
    if(await User.findOne ({ email }))
      return res.status(400)
      .json({
        message: "Email already registered" 
      });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash
    });

    res.cookie("token", signToken(user), cookieOptions)
      .status(201)
      .json({
        user: publicUser(user)
    });
  }
  // catch
  catch (error) {
    res.status(500)
    .json({
      message: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  // try
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });
    res.cookie("token", signToken(user), cookieOptions)
      .status(200)
      .json({ user: publicUser(user) });

  // catch
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "No User" });
    }

    res.status(200).json({
      user: publicUser(user)
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  try {
    router.post("/logout", (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.json({ message: "Logged out" });
  });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * TASK 8.2 (BONUS) - POST /api/auth/forgot-password
 *   - always answer with the same generic message, whether or not the email exists
 *   - raw token: crypto.randomBytes(32).toString("hex")
 *   - store ONLY the sha256 hash of it, plus a 15 minute expiry
 *   - "email" the link by console.log-ing `${process.env.CLIENT_URL}/reset/${raw}`
 */
router.post("/forgot-password", async (req, res) => {
  const generic = { msg: "If that email exists, a reset link was sent" };
  // TODO (Task 8.2)
  res.json(generic);
});

/**
 * TASK 8.3 (BONUS) - POST /api/auth/reset-password/:raw
 *   - hash req.params.raw and look the user up by resetTokenHash
 *   - the query must also require resetTokenExpires: { $gt: Date.now() }
 *   - re-hash the new password, then clear both reset fields
 */
router.post("/reset-password/:raw", async (req, res) => {
  // TODO (Task 8.3)
  res.status(501).json({ msg: "Not implemented - Task 8.3" });
});

module.exports = router;
