import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const getDashboard = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/${userId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "DASHBOARD SERVICE ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};