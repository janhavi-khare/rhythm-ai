const mongoose = require("mongoose");

const dailyHealthSnapshotSchema = new mongoose.Schema(
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

    morningCheckinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DailyCheckIn",
      required: false,
    },

    workoutSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutSession",
      required: false,
    },

    engineeredFeatures: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    physiologicalState: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    recommendations: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    predictionMetadata: {
      modelVersions: mongoose.Schema.Types.Mixed,
      timestamps: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast lookup by user and date.
dailyHealthSnapshotSchema.index({ userId: 1, date: -1 });

module.exports =
  mongoose.models.DailyHealthSnapshot ||
  mongoose.model(
    "DailyHealthSnapshot",
    dailyHealthSnapshotSchema
  );
