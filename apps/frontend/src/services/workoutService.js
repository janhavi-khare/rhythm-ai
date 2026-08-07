import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

export const completeWorkout = async (
  sessionId,
  workoutData
) => {
  if (!sessionId || sessionId === "undefined" || sessionId === "null") {
    const errorMsg = "Cannot complete workout: WorkoutSession ID is missing.";
    console.error("WORKOUT COMPLETION ERROR:", errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const response = await axios.post(
      `${API_URL}/workout/complete/${sessionId}`,
      workoutData
    );

    return response.data;
  } catch (error) {
    console.error(
      "WORKOUT COMPLETION ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const skipWorkout = async (sessionId) => {
  if (!sessionId || sessionId === "undefined" || sessionId === "null") {
    const errorMsg = "Cannot skip workout: WorkoutSession ID is missing.";
    console.error("WORKOUT SKIP ERROR:", errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const response = await axios.post(
      `${API_URL}/workout/skip/${sessionId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "WORKOUT SKIP ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};