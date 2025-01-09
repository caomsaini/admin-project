const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all users (Admin-only route)
router.get("/", protect, admin, async (req, res) => {
  try {
      const users = await User.find({});
      res.json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    console.log("Login Request - Email:", email, "Password:", password);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Found User:", user);

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "180d", // Token valid for 1 day
    });

    console.log("Generated Token:", token);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
