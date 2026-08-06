const mongoose = require("mongoose");
const User = require("../models/User");
const DailyCheckIn = require("../models/DailyCheckIn");
const MorningRecommendation = require("../models/MorningRecommendation");
const WorkoutSession = require("../models/Workoutsession");

const getCycleDay = require("../utils/cycleDay");
const { generateMorningPlan } = require("./aiService");

async function submitCheckIn(userId, body) {
  let user = null;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    user = await User.findById(userId);
  }

  if (!user) {
    user = await User.findOne({});
  }

  if (!user) {
    user = await User.create({
      name: "Rhythm User",
      email: "user@rhythm.ai",
      password: "password123",
      age: 24,
      height: 165,
      weight: 58,
      cycleLength: 30,
      periodLength: 5,
    });
  }

  const validUserId = user._id;

  // Sanitize and map input enums safely
  const sleepQuality = body.sleepQuality || "Good";
  const energy = Math.min(5, Math.max(1, Number(body.energy) || 3));
  const soreness = body.soreness || "None";
  const stress = body.stress || "Low";
  const yesterdayWorkout = body.yesterdayWorkout || "No";
  
  let targetIntensity = body.targetIntensity || "Moderate";
  if (targetIntensity === "Balanced") targetIntensity = "Moderate";
  if (targetIntensity === "High") targetIntensity = "Intense";
  if (targetIntensity === "Low") targetIntensity = "Easy";

  // Construct check-in object containing mandatory current check-in fields
  const checkInData = {
    userId: validUserId,
    sleepQuality,
    energy,
    soreness,
    stress,
    yesterdayWorkout,
    targetIntensity,
  };

  // Optional fields are added only if explicitly present in body; otherwise left undefined
  if (body.mood !== undefined) checkInData.mood = body.mood;
  if (body.bloating !== undefined) checkInData.bloating = body.bloating;
  if (body.cravings !== undefined) checkInData.cravings = body.cravings;
  if (body.workoutType !== undefined) checkInData.workoutType = body.workoutType;
  if (body.workoutIntensity !== undefined) checkInData.workoutIntensity = body.workoutIntensity;

  const checkIn = await DailyCheckIn.create(checkInData);

  const cycleDay = getCycleDay(
    user.lastPeriodDate,
    user.cycleLength
  );

  const aiPayload = {
    cycleDay,
    sleepQuality: body.sleepQuality,
    subjectiveEnergy: Number(body.energy),
    soreness: body.soreness,
    stress: body.stress,
    yesterdayWorkout: body.yesterdayWorkout,
    targetIntensity: body.targetIntensity,
    workoutType: body.workoutType || body.targetIntensity || "General Fitness",
    workoutIntensity: body.workoutIntensity || body.targetIntensity || "Moderate",
    plannedWorkoutTime: body.plannedWorkoutTime || "Morning",
  };

  if (body.mood !== undefined) aiPayload.mood = body.mood;
  if (body.bloating !== undefined) aiPayload.bloating = body.bloating;
  if (body.cravings !== undefined) aiPayload.cravings = body.cravings;

  const aiResponse = await generateMorningPlan({
    profile: {
      weight: user.weight,
      goals: user.goals,
      cycleLength: user.cycleLength,
      lastPeriodDate: user.lastPeriodDate,
      age: user.age,
    },

    checkin: aiPayload,
  });

  const morningRec = await MorningRecommendation.create({
    userId: validUserId,
    checkIn: {
      sleepQuality: body.sleepQuality,
      subjectiveEnergy: Number(body.energy),
      mood: body.mood !== undefined ? body.mood : null,
      bloating: body.bloating !== undefined ? body.bloating : null,
      cravings: body.cravings !== undefined ? body.cravings : null,
      workoutType: body.workoutType || body.targetIntensity || "General Fitness",
      plannedWorkoutTime: body.plannedWorkoutTime || "Morning",
    },
    todayPlan: aiResponse.todayPlan,
    predictions: aiResponse.predictions,
  });

  const workoutSession = await WorkoutSession.create({
    userId: validUserId,
    morningRecommendationId: morningRec._id,
    status: "PLANNED",
    workoutType: body.workoutType || body.targetIntensity || "General Fitness",
    intensity: body.workoutIntensity || body.targetIntensity || "Moderate",
  });

  return {
    aiResponse,
    morningRecommendation: morningRec,
    workoutSession,
  };
}

module.exports = {
  submitCheckIn,
};