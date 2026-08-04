const User = require("../models/User");
const DailyCheckIn = require("../models/DailyCheckIn");
const WorkoutSession = require("../models/Workoutsession");
const MorningRecommendation = require("../models/MorningRecommendation");
const RecoveryRecommendation = require("../models/RecoveryRecommendation");
const { generateMorningPlan } = require("./aiService");
const getCycleDay = require("../utils/cycleDay");

async function getDashboard(userId) {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new Error("User not found");
  }

  const cycleDay = getCycleDay(
    user.lastPeriodDate,
    user.cycleLength
  );

  console.log("Dashboard Cycle Day:", cycleDay);

  const latestCheckIn = await DailyCheckIn.findOne({
    userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!latestCheckIn) {
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      todayPlan: null,
      predictions: null,
    };
  }

  const aiPayload = {
    cycleDay,

    sleepQuality: latestCheckIn.sleepQuality,

    mood: latestCheckIn.mood,

    subjectiveEnergy: latestCheckIn.energy,

    bloating: latestCheckIn.bloating,

    cravings: latestCheckIn.cravings,

    workoutType: latestCheckIn.workoutType,

    plannedWorkoutTime: "Morning",

    goals: user.goals || ["General Fitness"]
  };

  const aiResult = await generateMorningPlan({
    profile: {
      weight: user.weight,
      goals: user.goals,
      cycleLength: user.cycleLength,
      lastPeriodDate: user.lastPeriodDate,
      age: user.age,
    },

    checkin: {
      cycleDay,

      sleepQuality: latestCheckIn.sleepQuality,

      subjectiveEnergy: latestCheckIn.energy,

      soreness: latestCheckIn.soreness,

      stress: latestCheckIn.stress,

      yesterdayWorkout: latestCheckIn.yesterdayWorkout,

      targetIntensity: latestCheckIn.targetIntensity,

      mood: latestCheckIn.mood,

      bloating: latestCheckIn.bloating,

      cravings: latestCheckIn.cravings,

      workoutType:
        latestCheckIn.workoutType ||
        latestCheckIn.targetIntensity,

      workoutIntensity:
        latestCheckIn.workoutIntensity ||
        latestCheckIn.targetIntensity,

      plannedWorkoutTime: "Morning",
    },
  });

  const todayPlan = aiResult.todayPlan;

  let latestWorkoutSession = await WorkoutSession.findOne({ userId })
    .sort({ createdAt: -1 })
    .lean();

  if (!latestWorkoutSession) {
    let morningRec = await MorningRecommendation.findOne({ userId }).sort({ createdAt: -1 });
    if (!morningRec) {
      morningRec = await MorningRecommendation.create({
        userId,
        checkIn: {
          sleepQuality: "Good",
          subjectiveEnergy: 3,
          workoutType: "General Fitness",
          plannedWorkoutTime: "Morning",
        },
        phase: { name: "Follicular", description: "Follicular Phase" },
        readiness: { score: 75, label: "Training Ready" },
      });
    }

    const newSession = await WorkoutSession.create({
      userId,
      morningRecommendationId: morningRec._id,
      status: "PLANNED",
      workoutType: todayPlan?.workout?.workoutObjective || "General Fitness",
      intensity: todayPlan?.workout?.intensity || "Moderate",
    });
    latestWorkoutSession = newSession.toObject ? newSession.toObject() : newSession;
  }

  if (latestWorkoutSession && todayPlan) {
    const sessionIdStr = String(latestWorkoutSession._id);

    if (todayPlan.workout) {
      todayPlan.workout.id = sessionIdStr;
      todayPlan.workout._id = sessionIdStr;
      todayPlan.workout.sessionId = sessionIdStr;
      todayPlan.workout.workoutSessionId = sessionIdStr;
    }
    todayPlan.workoutSessionId = sessionIdStr;

    if (latestWorkoutSession.status === "COMPLETED") {
      if (todayPlan.workout) {
        todayPlan.workout.completed = true;
        todayPlan.workout.status = "COMPLETED";
      }

      todayPlan.mode = "RECOVERY";

      const recoveryRec = await RecoveryRecommendation.findOne({
        workoutSessionId: latestWorkoutSession._id,
      }).lean();

      let recoveryItems = [
        { id: "hydrate", label: "Hydrate with electrolytes & 500ml water", completed: false },
        { id: "protein", label: "Consume post-workout protein within 45 min", completed: false },
        { id: "stretching", label: "Perform 10 min gentle post-workout stretching", completed: false },
      ];

      if (recoveryRec?.recoveryNutrition?.checklist?.length > 0) {
        recoveryItems = recoveryRec.recoveryNutrition.checklist.map((item, idx) => ({
          id: `rec_${idx}`,
          label: item,
          completed: false,
        }));
      }

      todayPlan.checklist = {
        title: "Recovery Checklist",
        subtitle: "Post-Workout Recovery",
        completed: 0,
        total: recoveryItems.length,
        items: recoveryItems,
      };
    }
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },

    todayPlan: todayPlan,

    predictions: aiResult.predictions,
  };
}

module.exports = {
  getDashboard,
};