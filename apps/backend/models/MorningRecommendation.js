const mongoose = require("mongoose");

const morningRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    checkIn: {
      sleepQuality: String,
      mood: Number,
      subjectiveEnergy: Number,
      bloating: String,
      cravings: String,
      workoutType: String,
      plannedWorkoutTime: String,
    },

    phase: {
      prediction: String,
      confidence: Number,
    },

    readiness: {
      score: Number,
      confidence: Number,
      category: String,
    },

    fatigue: {
      score: Number,
      confidence: Number,
      category: String,
    },

    gamePlan: {
      workoutRecommendation: String,
      recommendedIntensity: String,
      focus: String,
      message: String,
    },

    preWorkoutNutrition: {
      priorityNutrients: [String],
      recommendedFoods: [String],
      hydration: String,
      preWorkoutMeal: String,
      checklist: [String],
    },
  },
  {
    timestamps: true,
  }
);

morningRecommendationSchema.index({
  userId: 1,
  date: -1,
});

module.exports =
  mongoose.models.MorningRecommendation ||
  mongoose.model(
    "MorningRecommendation",
    morningRecommendationSchema
  );