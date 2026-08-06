const express = require("express");
const router = express.Router();

const User = require("../models/User");
const WorkoutSession = require("../models/WorkoutSession");
const MorningRecommendation = require("../models/MorningRecommendation");
const RecoveryRecommendation = require("../models/RecoveryRecommendation");

const {
  generateRecoveryPlan,
} = require("../services/aiService");

router.post("/complete/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const {
      intensity,
      duration,
      rpe,
      muscleSoreness,
    } = req.body;

    if (!intensity) {
      return res.status(400).json({
        message: "Workout intensity is required",
      });
    }

    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        name: "Rhythm User",
        email: "user@rhythm.app",
        weight: 60,
        cycleLength: 28,
        lastPeriodDate: new Date(),
        goals: ["General Fitness"]
      });
    }

    let workoutSession = null;

    if (require("mongoose").isValidObjectId(sessionId)) {
      workoutSession = await WorkoutSession.findById(sessionId);
    }

    if (!workoutSession) {
      workoutSession = await WorkoutSession.findOne({ userId: user._id, status: "PLANNED" }).sort({ createdAt: -1 });
    }

    if (!workoutSession) {
      let morningRec = await MorningRecommendation.findOne({ userId: user._id }).sort({ createdAt: -1 });
      if (!morningRec) {
        morningRec = await MorningRecommendation.create({
          userId: user._id,
          checkIn: { sleepQuality: "Good", subjectiveEnergy: 3, workoutType: "General Fitness" },
          phase: { name: "Follicular" },
          readiness: { score: 75 },
        });
      }
      workoutSession = await WorkoutSession.create({
        userId: user._id,
        morningRecommendationId: morningRec._id,
        status: "PLANNED",
        workoutType: "General Fitness",
        intensity: intensity || "Moderate",
      });
    }

    if (workoutSession.status === "COMPLETED") {
      return res.status(400).json({
        message: "Workout already completed",
      });
    }

    let morningRecommendation = await MorningRecommendation.findById(
      workoutSession.morningRecommendationId
    );

    if (!morningRecommendation) {
      morningRecommendation = await MorningRecommendation.findOne().sort({ createdAt: -1 });
      if (!morningRecommendation) {
        morningRecommendation = await MorningRecommendation.create({
          userId: workoutSession.userId,
          checkIn: { sleepQuality: "Good", subjectiveEnergy: 3 },
          phase: { name: "Follicular" },
          readiness: { score: 75 },
        });
      }
    }

    if (!user && workoutSession.userId) {
      user = await User.findById(workoutSession.userId);
    }

    // -------------------------
    // Find phase regardless of schema
    // -------------------------

    let phase =
      morningRecommendation?.bodySnapshot?.phase?.name ||
      morningRecommendation?.bodySnapshot?.phase?.prediction ||
      morningRecommendation?.phase?.name ||
      morningRecommendation?.phase?.prediction ||
      morningRecommendation?.prediction?.phase?.name ||
      morningRecommendation?.prediction?.phase ||
      null;

    if (!phase) {
      console.warn("Phase not found in recommendation.");
      phase = "Follicular";
    }

    // -------------------------
    // Complete workout
    // -------------------------

    workoutSession.status = "COMPLETED";
    workoutSession.intensity = intensity;
    workoutSession.duration = duration;
    workoutSession.completedAt = new Date();
    workoutSession.rpe = rpe;
    workoutSession.muscleSoreness = muscleSoreness;

    await workoutSession.save();

    // -------------------------
    // Recovery payload
    // -------------------------

    const recoveryInput = {
      phase,

      intensity,

      duration,

      weight: user?.weight ?? 0,

      workoutType:
        workoutSession.workoutType || intensity,

      rpe: rpe ?? 5,

      muscleSoreness:
        muscleSoreness ?? "None",

      goal:
        Array.isArray(user?.goals) &&
          user.goals.length
          ? user.goals[0]
          : "General Fitness",
    };

    const aiResult =
      await generateRecoveryPlan(recoveryInput);

    let recoveryFocusStr = null;
    if (typeof aiResult.recoveryFocus === "string") {
      recoveryFocusStr = aiResult.recoveryFocus;
    } else if (Array.isArray(aiResult.recoveryFocus)) {
      recoveryFocusStr = aiResult.recoveryFocus.join(", ");
    } else if (typeof aiResult.recoveryFocus === "object" && aiResult.recoveryFocus !== null) {
      if (Array.isArray(aiResult.recoveryFocus.items)) {
        recoveryFocusStr = aiResult.recoveryFocus.items.join(", ");
      } else {
        recoveryFocusStr = JSON.stringify(aiResult.recoveryFocus);
      }
    }

    const recoveryRecommendation =
      await RecoveryRecommendation.create({
        userId: workoutSession.userId,

        workoutSessionId: workoutSession._id,

        recoveryNutrition:
          aiResult.recoveryNutrition ?? null,

        recoveryFocus:
          recoveryFocusStr,

        message:
          typeof aiResult.message === "string" ? aiResult.message : (aiResult.coachSummary || null),
      });

    return res.status(201).json({
      message: "Workout completed successfully",

      workoutSession,

      recoveryRecommendation,
    });

  } catch (error) {
    console.error(
      "WORKOUT COMPLETION ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to complete workout",

      error: error.message,
    });
  }
});

router.post("/skip/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    let workoutSession = null;
    if (require("mongoose").isValidObjectId(sessionId)) {
      workoutSession = await WorkoutSession.findById(sessionId);
    }

    if (!workoutSession) {
      workoutSession = await WorkoutSession.findOne({ status: "PLANNED" }).sort({ createdAt: -1 });
    }

    if (!workoutSession) {
      workoutSession = await WorkoutSession.create({
        status: "PLANNED",
        workoutType: "General Fitness",
      });
    }

    workoutSession.status = "SKIPPED";
    await workoutSession.save();

    return res.json({
      message: "Workout marked as skipped",
      workoutSession,
    });

  } catch (error) {
    console.error(
      "WORKOUT SKIP ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to skip workout",

      error: error.message,
    });
  }
});

module.exports = router;