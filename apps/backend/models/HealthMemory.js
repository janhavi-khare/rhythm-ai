const mongoose = require("mongoose");

const healthMemorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    sleep: {
      sleepDebt: Number,
      avgSleep7d: Number,
      avgSleep30d: Number,
      sleepConsistency: Number,
    },

    training: {
      acuteLoad7d: Number,
      chronicLoad28d: Number,
      workoutFrequency: Number,
      consecutiveWorkoutDays: Number,
      lastWorkoutDate: Date,
    },

    recovery: {
      avgRecovery7d: Number,
      recoveryTrend: Number,
      recoveryVelocity: Number,
    },
  },
  {
    timestamps: {
      createdAt: "metadata.createdAt",
      updatedAt: "metadata.updatedAt",
    },
  }
);

module.exports =
  mongoose.models.HealthMemory ||
  mongoose.model("HealthMemory", healthMemorySchema);
