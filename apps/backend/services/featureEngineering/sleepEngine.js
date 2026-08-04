function calculateSleepDebt(sleepRecords = []) {
  // Placeholder: calculate the gap between ideal and actual sleep.
  // In future, this should compare actual sleep duration against a target window.
  if (!Array.isArray(sleepRecords) || sleepRecords.length === 0) {
    return 0;
  }

  const totalSleep = sleepRecords.reduce(
    (sum, record) => sum + (record.duration || 0),
    0
  );

  const averageSleep = totalSleep / sleepRecords.length;
  const idealSleep = 8;

  return Math.max(0, idealSleep - averageSleep);
}

function calculateAverageSleep(sleepRecords = [], days = 7) {
  // Placeholder: return average sleep hours across the requested window.
  if (!Array.isArray(sleepRecords) || sleepRecords.length === 0) {
    return 0;
  }

  const relevantRecords = sleepRecords.slice(-days);
  const totalSleep = relevantRecords.reduce(
    (sum, record) => sum + (record.duration || 0),
    0
  );

  return totalSleep / relevantRecords.length;
}

function calculateSleepConsistency(sleepRecords = []) {
  // Placeholder: compute consistency as inverse of standard deviation of sleep duration.
  if (!Array.isArray(sleepRecords) || sleepRecords.length === 0) {
    return 0;
  }

  const durations = sleepRecords.map((record) => record.duration || 0);
  const average = durations.reduce((sum, value) => sum + value, 0) / durations.length;
  const variance =
    durations.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) /
    durations.length;

  const stdDev = Math.sqrt(variance);
  const consistency = Math.max(0, 100 - stdDev * 10);

  return consistency;
}

function calculateSleepTrend(sleepRecords = []) {
  // Placeholder: return a simple trend value based on change from earliest to latest sleep duration.
  if (!Array.isArray(sleepRecords) || sleepRecords.length < 2) {
    return 0;
  }

  const first = sleepRecords[0]?.duration || 0;
  const last = sleepRecords[sleepRecords.length - 1]?.duration || 0;

  return last - first;
}

module.exports = {
  calculateSleepDebt,
  calculateAverageSleep,
  calculateSleepConsistency,
  calculateSleepTrend,
};
