const FITNESS_GOALS = [
  {
    id: "weight_loss",
    label: "Weight Loss",
    aliases: ["Weight Loss", "Fat Loss", "Lose Fat"]
  },
  {
    id: "muscle_gain",
    label: "Muscle Gain",
    aliases: ["Muscle Gain", "Gain Muscle", "Strength"]
  },
  {
    id: "maintenance",
    label: "Maintenance",
    aliases: ["Maintenance", "Maintain Fitness", "Maintain"]
  },
  {
    id: "improved_energy",
    label: "Improved Energy",
    aliases: ["Improved Energy", "Endurance & Stamina", "Energy"]
  },
  {
    id: "better_sleep",
    label: "Better Sleep",
    aliases: ["Better Sleep", "Sleep & Recovery", "Sleep"]
  },
  {
    id: "hormonal_balance",
    label: "Hormonal Balance",
    aliases: ["Hormonal Balance", "Cycle Health", "Balance"]
  }
];

const GOAL_LABELS = FITNESS_GOALS.map((g) => g.label);

function normalizeGoal(goalString) {
  if (!goalString) return "";
  const cleaned = String(goalString).trim().toLowerCase();

  for (const item of FITNESS_GOALS) {
    if (item.label.toLowerCase() === cleaned) return item.label;
    if (item.id.toLowerCase() === cleaned) return item.label;
    for (const alias of item.aliases) {
      if (alias.toLowerCase() === cleaned) return item.label;
    }
  }

  return goalString;
}

function normalizeGoals(goalsArray) {
  if (!Array.isArray(goalsArray)) return [];
  const normalized = goalsArray.map(normalizeGoal).filter(Boolean);
  return Array.from(new Set(normalized));
}

module.exports = {
  FITNESS_GOALS,
  GOAL_LABELS,
  normalizeGoal,
  normalizeGoals
};
