const express = require("express");
const router = express.Router();

const User = require("../models/User");
const MorningRecommendation = require(
  "../models/MorningRecommendation"
);
const WorkoutSession = require(
  "../models/WorkoutSession"
);

const {
  generateMorningPlan,
} = require("../services/aiService");


router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.lastPeriodDate) {
      return res.status(400).json({
        message: "Last period date is required",
      });
    }

    const {
      sleepQuality,
      mood,
      subjectiveEnergy,
      bloating,
      cravings,
      workoutType,
      plannedWorkoutTime,
    } = req.body;

    if (
      !sleepQuality ||
      mood === undefined ||
      subjectiveEnergy === undefined ||
      !bloating ||
      !cravings ||
      !workoutType
    ) {
      return res.status(400).json({
        message: "Missing required check-in fields",
      });
    }


    // -------------------------
    // Calculate cycle day
    // -------------------------

    const today = new Date();

    const lastPeriodDate = new Date(
      user.lastPeriodDate
    );

    const differenceInTime =
      today.getTime() -
      lastPeriodDate.getTime();

    const differenceInDays = Math.floor(
      differenceInTime /
      (1000 * 60 * 60 * 24)
    );

    const cycleLength =
      user.cycleLength || 28;

    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const lastPeriod = new Date(user.lastPeriodDate);

    const diffDays = Math.floor(
      (today - lastPeriod) / MS_PER_DAY
    );

    const cycleDay = diffDays + 1;


    // -------------------------
    // User check-in data
    // -------------------------

    const checkIn = {
      sleepQuality,
      mood,
      subjectiveEnergy,
      bloating,
      cravings,
      workoutType,
      plannedWorkoutTime,
    };


    // -------------------------
    // AI service input
    // -------------------------

    const aiInput = {
      ...checkIn,
      cycleDay,
    };

    const aiResult =
      await generateMorningPlan(aiInput);

      console.log(JSON.stringify(aiResult, null, 2));


    // -------------------------
    // Store morning recommendation
    // -------------------------

    const morningRecommendation =
      await MorningRecommendation.create({
        userId,

        checkIn,

        phase: aiResult.phase,

        readiness:
          aiResult.readiness ?? null,

        fatigue:
          aiResult.fatigue ?? null,

        gamePlan:
          aiResult.gamePlan ?? null,

        preWorkoutNutrition:
          aiResult.preWorkoutNutrition ?? null,
      });


    // -------------------------
    // Create planned workout
    // -------------------------

    const workoutSession =
      await WorkoutSession.create({
        userId,

        morningRecommendationId:
          morningRecommendation._id,

        status: "PLANNED",

        workoutType,
      });


    return res.status(201).json({
      message:
        "Morning plan generated successfully",

      morningRecommendation,

      workoutSession,
    });

  } catch (error) {
    console.error(
      "MORNING CHECK-IN ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to generate morning plan",

      error: error.message,
    });
  }
});


module.exports = router;