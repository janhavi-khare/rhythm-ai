export default function mapDashboard(response) {
    return {
        user: {
            ...response.user,
            totalCheckIns: response.user?.totalCheckIns ?? 0,
            completedWorkouts: response.user?.completedWorkouts ?? 0,
            streak: response.user?.streak ?? 0,
        },
        todayPlan: response.todayPlan,
        predictions: response.predictions,
        cycleLength: response.cycleLength || response.user?.cycleLength,
        cycleDay: response.cycleDay,
        currentPhase: response.currentPhase,
        nextPhase: response.nextPhase,
        phaseTimeline: response.phaseTimeline,
    };
}