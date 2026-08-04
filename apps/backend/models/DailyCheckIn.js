console.log("✅ Loading DailyCheckIn schema");

const mongoose = require("mongoose");

const dailyCheckInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sleepQuality: {
      type: String,
      required: true,
    },

    energy: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    soreness: {
      type: String,
      required: true,
    },

    stress: {
      type: String,
      required: true,
    },

    yesterdayWorkout: {
      type: String,
      enum: ["Yes", "Partially", "No"],
      required: false,
    },

    targetIntensity: {
      type: String,
      enum: ["Rest", "Easy", "Moderate", "Intense"],
      required: true,
    },

    mood: {
      type: Number,
      required: false,
    },

    bloating: {
      type: String,
      required: false,
    },

    cravings: {
      type: String,
      required: false,
    },

    workoutType: {
      type: String,
      required: false,
    },

    workoutIntensity: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DailyCheckIn", dailyCheckInSchema);
