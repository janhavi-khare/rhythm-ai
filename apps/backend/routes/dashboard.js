const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { getDashboard } = require("../services/dashboardService");

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }

    const dashboard = await getDashboard(userId);
    return res.status(200).json(dashboard);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.error("DASHBOARD ERROR:", error);
    return res.status(500).json({
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
});

module.exports = router;