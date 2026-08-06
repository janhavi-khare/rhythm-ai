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
      enum: [
        "Poor",
        "Average",
        "Good",
        "Very Good"
      ],
      required: true
    },

    energy: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    soreness: {
      type: String,
      enum: [
        "None",
        "Mild",
        "Moderate",
        "Severe"
      ]
    },

    stress: {
      type: String,
      enum: [
        "Calm",
        "Low",
        "Moderate",
        "High"
      ]
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
      min: 1,
      max: 5,
    },

    bloating: {
      type: String,
      enum: ["None", "Mild", "Moderate", "Severe"],
    },

    cravings: {
      type: String,
      enum: ["None", "Sweet", "Salty", "Both"],
    },

    workoutType: {
      type: String,
      enum: [
        "Build Strength",
        "Strength",
        "Build Muscle",
        "Hypertrophy",
        "Improve Conditioning",
        "Conditioning",
        "Cardio",
        "Mixed Training",
        "Active Recovery",
        "Mobility & Recovery",
        "Mobility",
        "Recovery",
        "Technique Focus",
        "Rest Day",
        "General Fitness"
      ],
      required: false,
    },

    workoutIntensity: {
      type: String,
      enum: [
        "Rest",
        "Very Light",
        "Light",
        "Low",
        "Moderate",
        "Moderately High",
        "High",
        "Intense"
      ],
      required: false,
    },

    plannedWorkoutTime: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DailyCheckIn", dailyCheckInSchema);
