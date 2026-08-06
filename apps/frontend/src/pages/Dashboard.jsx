import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getDashboard } from "../services/dashboardService";
import mapDashboard from "../services/dashboardMapper";
import { completeWorkout } from "../services/workoutService";
import SkeletonLoader from "../ui/SkeletonLoader";

import Sidebar from "../layout/Sidebar";
import TopBar from "../layout/Topbar";

import DashboardView from "../components/views/DashboardView";
import WorkoutSessionView from "../components/views/WorkoutSessionView";
import WorkoutView from "../components/views/WorkoutView";
import NutritionView from "../components/views/NutritionView";
import InsightsView from "../components/views/InsightsView";
import CycleView from "../components/views/CycleView";
import ProfileView from "../components/views/ProfileView";

import WorkoutCompletionModal from "../components/workoutCompletion";

function isValidUserId(id) {
  return typeof id === "string" && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
}

export default function Dashboard({ initialTab = "dashboard" }) {
  const { userId: routeUserId } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const userId = (() => {
    if (isValidUserId(routeUserId)) return routeUserId;
    const storedId = localStorage.getItem("userId");
    return isValidUserId(storedId) ? storedId : null;
  })();

  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dashboardVM, setDashboardVM] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setLoadError("");
      const data = await getDashboard(userId);
      setDashboard(data);
      setDashboardVM(mapDashboard(data));
    } catch (err) {
      console.error(err);
      setLoadError(
        err.response?.data?.message ||
        "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadDashboard();
    }
  }, [userId]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06030B] text-slate-100 p-6">
        <div className="max-w-xl w-full rounded-[36px] soft-surface p-8 text-center shadow-2xl">
          <h1 className="text-3xl font-light font-display text-white">
            Connection <span className="font-serif-title italic text-pink-300">Issue</span>
          </h1>
          <p className="mt-4 text-slate-300 text-sm font-light">
            {loadError}
          </p>
          <button
            onClick={loadDashboard}
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-7 py-3.5 text-white font-bold hover:opacity-90 transition shadow-[0_0_20px_rgba(236,72,153,0.4)] text-sm"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06030B] text-slate-100 p-6">
        <div className="max-w-xl w-full rounded-[36px] soft-surface p-8 text-center shadow-2xl">
          <h1 className="text-3xl font-light font-display text-white">
            Invalid <span className="font-serif-title italic text-pink-300">User</span>
          </h1>
          <p className="mt-4 text-slate-300 text-sm font-light">
            Unable to load dashboard because the user identifier is invalid.
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const { user, predictions } = dashboardVM;
  const todayPlan = dashboardVM.todayPlan;
  const workout = todayPlan?.workout;

  const phase = todayPlan?.bodySnapshot?.phase;
  const readiness = todayPlan?.bodySnapshot?.readiness;
  const fatigue = todayPlan?.bodySnapshot?.fatigue;
  const nutrition = todayPlan?.nutrition;

  const handleWorkoutSubmit = async (data) => {
    let sessionId = workout?.id || workout?._id || workout?.sessionId || workout?.workoutSessionId || todayPlan?.workoutSessionId;
    if (!sessionId || sessionId === "undefined" || sessionId === "null") {
      sessionId = "650000000000000000000001";
    }

    try {
      setSubmitError("");
      setSubmitting(true);
      setShowWorkoutModal(false);
      setActiveTab("dashboard");
      await completeWorkout(sessionId, data);
      await loadDashboard();
    } catch (err) {
      console.error("WORKOUT SUBMIT ERROR:", err);
      setShowWorkoutModal(false);
      setActiveTab("dashboard");
      await loadDashboard();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-[#06030B] bg-mesh-atmosphere text-slate-100 relative overflow-hidden">
        {/* Ambient Light Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none"></div>

        <Sidebar
          phase={todayPlan?.bodySnapshot?.phase}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto z-10 space-y-8">
          <TopBar
            user={user}
            phase={todayPlan?.bodySnapshot?.phase}
          />

          {submitError && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-300 backdrop-blur-md">
              {submitError}
            </div>
          )}

          {/* TAB ROUTING VIEWS */}
          {activeTab === "dashboard" && (
            <DashboardView
              user={user}
              todayPlan={todayPlan}
              setActiveTab={setActiveTab}
              onStartWorkout={() => setActiveTab("workout-session")}
            />
          )}

          {activeTab === "workout-session" && (
            <WorkoutSessionView
              workout={workout}
              onComplete={() => setShowWorkoutModal(true)}
              onBack={() => setActiveTab("dashboard")}
            />
          )}

          {activeTab === "workout" && (
            <WorkoutView
              workout={workout}
              readiness={readiness}
              fatigue={fatigue}
            />
          )}

          {activeTab === "nutrition" && (
            <NutritionView
              todayPlan={todayPlan}
              nutrition={nutrition}
              foods={nutrition?.foods || []}
              mode={todayPlan?.mode}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "insights" && (
            <InsightsView
              todayPlan={todayPlan}
              predictions={predictions}
              user={user}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "cycle" && (
            <CycleView
              todayPlan={todayPlan}
              phase={phase}
              user={user}
              predictions={predictions}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "profile" && (
            <ProfileView
              user={user}
              todayPlan={todayPlan}
              predictions={predictions}
              onUpdateUser={loadDashboard}
            />
          )}
        </main>
      </div>

      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="rounded-3xl soft-surface border border-pink-500/30 px-10 py-12 text-center shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
            </div>
            <p className="text-xl font-light font-display text-white">
              Calculating Post-Workout AI Recovery...
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Updating SHAP feature attributions and nutrient targets.
            </p>
          </div>
        </div>
      )}

      <WorkoutCompletionModal
        open={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        onSubmit={handleWorkoutSubmit}
        busy={submitting}
      />
    </>
  );
}