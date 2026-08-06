const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");

// SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  try {
    const { name, age, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user already exists in Atlas
    const existingUser = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Create and save new user in Atlas
    const newUser = await UserModel.create({
      name: name || "Rhythm User",
      age: Number(age) || null,
      email: email.toLowerCase().trim(),
      password,
    });

    console.log("👤 NEW ATLAS USER CREATED:", newUser._id);
    return res.status(201).json(newUser);
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      message: "Login successful",
      userId: user._id,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight,
        goals: user.goals,
        activityLevel: user.activityLevel,
        cycleLength: user.cycleLength,
        periodLength: user.periodLength,
        lastPeriodDate: user.lastPeriodDate,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Login error", error: err.message });
  }
});

module.exports = router;
