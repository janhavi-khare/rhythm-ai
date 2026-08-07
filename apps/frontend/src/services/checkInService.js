import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export async function submitCheckIn(userId,data){

    const response = await axios.post(

        `${API}/checkin/${userId}`,

        data

    );

    return response.data;

}