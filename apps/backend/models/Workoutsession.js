const mongoose = require("mongoose");

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    morningRecommendationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MorningRecommendation",
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PLANNED",
        "COMPLETED",
        "SKIPPED",
      ],
      default: "PLANNED",
    },

    workoutType: {
      type: String,
    },

    intensity: {
      type: String,
      enum: ["Low", "Moderate", "High"],
    },

    duration: {
      type: Number,
      min: 0,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

workoutSessionSchema.index({
  userId: 1,
  date: -1,
});

module.exports =
  mongoose.models.WorkoutSession ||
  mongoose.model("WorkoutSession", workoutSessionSchema);