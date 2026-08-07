const axios = require("axios");

const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const generateMorningPlan = async (payload) => {
  try {
    console.log("AI_SERVICE_URL raw value:", JSON.stringify(AI_SERVICE_URL));
    console.log("Full request URL:", JSON.stringify(`${AI_SERVICE_URL}/morning-plan`));

    const response = await axios.post(
      `${AI_SERVICE_URL}/morning-plan`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("========== AI SERVICE ERROR ==========");

    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }

    throw new Error("Failed to generate morning plan");
  }
};

const generateRecoveryPlan = async (workoutData) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/recovery-plan`,
      workoutData
    );

    return response.data;
  } catch (error) {
    console.error("========== RECOVERY AI SERVICE FALLBACK ==========", error.message);

    return {
      status: "Good",
      recoveryDemand: workoutData.intensity === "High" ? "High" : "Moderate",
      score: 75,
      coachTone: "Balanced",
      coachSummary: "Rest and refuel after today's session.",
      recoveryNutrition: {
        hydration: "800-1000 mL",
        protein: 25,
        carbs: 45,
        checklist: [
          "Drink 800-1000 mL water post-workout",
          "Consume 25g protein within 45 minutes",
          "Perform 10 min gentle post-workout stretching"
        ]
      },
      recoveryFocus: ["Hydration", "Protein", "Sleep"],
      message: "Great job completing your workout today!"
    };
  }
};

module.exports = {
  generateMorningPlan,
  generateRecoveryPlan,
};

