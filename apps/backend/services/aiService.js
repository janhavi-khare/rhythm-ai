const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

// ======================
// MORNING PLAN
// ======================
const generateMorningPlan = async (payload) => {
  try {
    const url = `${AI_SERVICE_URL}/morning-plan`;

    console.log("========== AI REQUEST ==========");
    console.log("Calling:", url);

    const response = await axios.post(url, payload);

    return response.data;
  } catch (error) {
    console.error("========== AI SERVICE ERROR ==========");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }

    throw new Error("Failed to generate morning plan");
  }
};

// ======================
// RECOVERY PLAN
// ======================
const generateRecoveryPlan = async (payload) => {
  try {
    const url = `${AI_SERVICE_URL}/recovery-plan`;

    console.log("========== RECOVERY AI REQUEST ==========");
    console.log("Calling:", url);

    const response = await axios.post(url, payload);

    return response.data;
  } catch (error) {
    console.error("========== RECOVERY AI SERVICE ERROR ==========");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }

    // Fallback so the app never crashes
    return {
      status: "Good",
      recoveryDemand:
        payload.workoutIntensity === "High" ? "High" : "Moderate",
      score: 75,
      coachTone: "Balanced",
      coachSummary: "Rest, hydrate, and refuel after today's workout.",
      recoveryNutrition: {
        hydration: "800-1000 mL",
        protein: 25,
        carbs: 45,
        checklist: [
          "Drink 800-1000 mL water",
          "Consume 25g protein",
          "Stretch for 10 minutes",
        ],
      },
      recoveryFocus: ["Hydration", "Protein", "Sleep"],
      message: "Recovery service unavailable. Showing fallback recommendations.",
    };
  }
};

module.exports = {
  generateMorningPlan,
  generateRecoveryPlan,
};