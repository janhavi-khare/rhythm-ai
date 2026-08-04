export default function mapDashboard(response) {
    return {
        user: response.user,
        todayPlan: response.todayPlan,
        predictions: response.predictions
    };
}