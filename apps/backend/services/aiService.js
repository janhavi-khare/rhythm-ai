const axios = require("axios");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const generateMorningPlan = async (payload) => {
  const url = `${AI_SERVICE_URL}/morning-plan`;

  console.log("========== AI REQUEST ==========");
  console.log("AI_SERVICE_URL:", AI_SERVICE_URL);
  console.log("Calling URL:", url);

  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.error("========== AI ERROR ==========");
    console.error("URL:", url);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    } else {
      console.error(error.message);
    }

    throw new Error("Failed to generate morning plan");
  }
};