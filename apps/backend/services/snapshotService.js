const DailyHealthSnapshot = require("../models/DailyHealthSnapshot");

async function createSnapshot(userId, snapshotData) {
  const payload = {
    userId,
    ...snapshotData,
  };

  const snapshot = await DailyHealthSnapshot.create(payload);
  return snapshot.toObject ? snapshot.toObject() : snapshot;
}

async function getLatestSnapshot(userId) {
  return DailyHealthSnapshot.findOne({ userId })
    .sort({ date: -1 })
    .lean();
}

async function updateSnapshot(snapshotId, updateData) {
  return DailyHealthSnapshot.findByIdAndUpdate(
    snapshotId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).lean();
}

async function getSnapshotsBetweenDates(
  userId,
  startDate,
  endDate
) {
  const query = {
    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  return DailyHealthSnapshot.find(query)
    .sort({ date: 1 })
    .lean();
}

module.exports = {
  createSnapshot,
  getLatestSnapshot,
  updateSnapshot,
  getSnapshotsBetweenDates,
};
