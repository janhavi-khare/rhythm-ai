import axios from "axios";

const API = "http://localhost:5000";

export async function submitCheckIn(userId,data){

    const response = await axios.post(

        `${API}/checkin/${userId}`,

        data

    );

    return response.data;

}