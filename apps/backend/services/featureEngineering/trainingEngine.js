const intensityRpeMap = {
  Light: 3,
  Moderate: 6,
  High: 9,
};

function mapIntensityToRpe(intensity) {
  return intensityRpeMap[intensity] ?? 5;
}

function calculateTrainingLoad(workouts = []) {
  // Placeholder: training load is volume * RPE summed over workouts.
  if (!Array.isArray(workouts) || workouts.length === 0) {
    return 0;
  }

  return workouts.reduce((totalLoad, workout) => {
    const intensityRpe = mapIntensityToRpe(workout.intensity);
    const duration = workout.duration || 0;
    return totalLoad + intensityRpe * duration;
  }, 0);
}

function calculateAcuteLoad(workouts = [], days = 7) {
  if (!Array.isArray(workouts) || workouts.length === 0) {
    return 0;
  }

  const recentWorkouts = workouts.slice(-days);
  return calculateTrainingLoad(recentWorkouts);
}

function calculateChronicLoad(workouts = [], days = 28) {
  if (!Array.isArray(workouts) || workouts.length === 0) {
    return 0;
  }

  const longTermWorkouts = workouts.slice(-days);
  return calculateTrainingLoad(longTermWorkouts);
}

function calculateWorkoutFrequency(workouts = [], days = 7) {
  if (!Array.isArray(workouts) || workouts.length === 0) {
    return 0;
  }

  const recentWorkouts = workouts.slice(-days);
  const uniqueDates = new Set(
    recentWorkouts.map((workout) =>
      workout.date ? new Date(workout.date).toDateString() : null
    )
  );

  return uniqueDates.size;
}

function calculateConsecutiveWorkoutDays(workouts = []) {
  if (!Array.isArray(workouts) || workouts.length === 0) {
    return 0;
  }

  const sortedDates = workouts
    .map((workout) =>
      workout.date ? new Date(workout.date).toISOString().slice(0, 10) : null
    )
    .filter(Boolean)
    .sort();

  let consecutiveDays = 0;
  let previousDate = null;

  for (const dateString of sortedDates) {
    const currentDate = new Date(dateString);

    if (!previousDate) {
      consecutiveDays = 1;
    } else {
      const diffDays =
        (currentDate - previousDate) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        consecutiveDays += 1;
      } else if (diffDays > 1) {
        consecutiveDays = 1;
      }
    }

    previousDate = currentDate;
  }

  return consecutiveDays;
}

module.exports = {
  calculateTrainingLoad,
  calculateAcuteLoad,
  calculateChronicLoad,
  calculateWorkoutFrequency,
  calculateConsecutiveWorkoutDays,
};
