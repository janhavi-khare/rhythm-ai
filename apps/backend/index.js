require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const UserModel = require("./models/User");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const checkInRoutes = require("./routes/checkin");
const workoutRoutes = require("./routes/workout");
const { normalizeGoals } = require("./constants/goals");

const app = express();
app.use(express.json());
app.use(cors());

// Health Check Route
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Rhythm Backend API Operational" });
});

// Route Registrations
app.use("/auth", authRoutes);
app.use("/", authRoutes); // Supports direct /signup & /login
app.use("/dashboard", dashboardRoutes);
app.use("/checkin", checkInRoutes);
app.use("/workout", workoutRoutes);

// Onboarding Route
app.post("/onboarding", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "User email is required for onboarding." });
    }

    const updateData = {};
    if (req.body.height !== undefined) updateData.height = Number(req.body.height);
    if (req.body.weight !== undefined) updateData.weight = Number(req.body.weight);
    if (req.body.cycleLength !== undefined) updateData.cycleLength = Number(req.body.cycleLength);
    if (req.body.periodLength !== undefined) updateData.periodLength = Number(req.body.periodLength);
    if (req.body.lastPeriodDate !== undefined) updateData.lastPeriodDate = req.body.lastPeriodDate;
    if (req.body.activityLevel !== undefined) updateData.activityLevel = req.body.activityLevel;
    if (req.body.goals !== undefined) updateData.goals = normalizeGoals(req.body.goals);

    const result = await UserModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      updateData,
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found to update profile." });
    }

    console.log("✅ PROFILE UPDATED FOR:", result.email);
    res.json(result);
  } catch (err) {
    console.error("Onboarding Error:", err);
    res.status(500).json({ message: "Error saving profile", error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to Atlas MongoDB");
    const count = await UserModel.countDocuments();
    console.log("📊 TOTAL USERS IN ATLAS:", count);
  })
  .catch((err) => {
    console.error("❌ Atlas Connection Error:", err);
  });

app.listen(PORT, () => {
  console.log(`🚀 Rhythm Backend running on port ${PORT}`);
});

app.get("/test", (req, res) => {
  res.send("Backend version Aug 7");
});
