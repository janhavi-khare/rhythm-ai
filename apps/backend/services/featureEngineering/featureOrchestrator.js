const User = require("../../models/User");
const HealthMemory = require("../../models/HealthMemory");
const WorkoutSession = require("../../models/Workoutsession");
const getCycleDay = require("../../utils/cycleDay");

const {
  calculateSleepDebt,
  calculateAverageSleep,
} = require("./sleepEngine");

const {
  calculateTrainingLoad,
  calculateAcuteLoad,
  calculateChronicLoad,
} = require("./trainingEngine");

function buildSleepRecords(healthMemory) {
  if (!healthMemory || !healthMemory.sleep) {
    return [];
  }

  const records = [];
  const { avgSleep7d, avgSleep30d } = healthMemory.sleep;

  if (avgSleep7d != null) {
    for (let i = 0; i < 7; i += 1) {
      records.push({ duration: avgSleep7d });
    }
  }

  if (avgSleep30d != null) {
    for (let i = 0; i < 30; i += 1) {
      records.push({ duration: avgSleep30d });
    }
  }

  return records;
}

async function generateFeatureVector(userId) {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new Error("User not found");
  }

  const healthMemory = await HealthMemory.findOne({ userId }).lean();
  const latestWorkout = await WorkoutSession.findOne({ userId })
    .sort({ date: -1 })
    .lean();

  const workouts = await WorkoutSession.find({ userId })
    .sort({ date: 1 })
    .lean();

  const sleepRecords = buildSleepRecords(healthMemory);

  const sleepDebt = calculateSleepDebt(sleepRecords);
  const avgSleep7d = calculateAverageSleep(sleepRecords, 7);
  const avgSleep30d = calculateAverageSleep(sleepRecords, 30);

  const trainingLoad = calculateTrainingLoad(workouts);
  const acuteLoad = calculateAcuteLoad(workouts);
  const chronicLoad = calculateChronicLoad(workouts);

  const cycleDay = getCycleDay(
    user.lastPeriodDate,
    user.cycleLength
  );

  const phase = getCurrentPhase(
    cycleDay,
    user.cycleLength
);

  return {
    sleepDebt,
    avgSleep7d,
    avgSleep30d,
    trainingLoad,
    acuteLoad,
    chronicLoad,
    muscleSoreness: latestWorkout?.muscleSoreness || 0,
    mood: latestWorkout?.mood || 0,
    energy: latestWorkout?.energy || 0,
    phase: phase || null,
    cycleDay,
  };
}

module.exports = {
  generateFeatureVector,
};
