const mongoose = require("mongoose");

const recoveryRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    workoutSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutSession",
      required: true,
      unique: true,
    },

    date: {
      type: Date,
      default: Date.now,
      required: true,
    },

    recoveryNutrition: {
      protein: Number,
      carbs: Number,
      fats: Number,
      hydration: String,
      electrolytes: Boolean,
      recoveryFoods: [String],
      foods: [String],
      priorityNutrients: [String],
      recoveryTip: String,
      checklist: [String],
    },

    recoveryFocus: {
      type: String,
    },

    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

recoveryRecommendationSchema.index({
  userId: 1,
  date: -1,
});

module.exports =
  mongoose.models.RecoveryRecommendation ||
  mongoose.model(
    "RecoveryRecommendation",
    recoveryRecommendationSchema
  );