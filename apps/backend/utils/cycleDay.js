function getCycleDay(lastPeriodDate, cycleLength) {
  const today = new Date();

  const lastPeriod = new Date(lastPeriodDate);

  const diffDays = Math.floor(
    (today - lastPeriod) / (1000 * 60 * 60 * 24)
  );

  return ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
}

module.exports = getCycleDay;