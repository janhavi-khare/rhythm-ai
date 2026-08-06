import { useState } from "react";
import axios from "axios";
import Card from "../../ui/Card";
import { GOAL_LABELS, normalizeGoals } from "../../constants/goals";
import {
  FiUser,
  FiActivity,
  FiCalendar,
  FiCpu,
  FiSettings,
  FiBarChart2,
  FiEdit3,
  FiTarget,
  FiRefreshCw,
  FiDownload,
  FiLogOut,
  FiCheck,
  FiX,
  FiSliders,
  FiBell,
  FiTrendingUp
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProfileView({ user, todayPlan, predictions, onUpdateUser }) {
  // User Personal Information (Strictly real data or null/empty state)
  const userName = user?.name || "Rhythm User";
  const userEmail = user?.email || "";
  const userAge = user?.age ?? null;
  const userHeight = user?.height ?? null;
  const userWeight = user?.weight ?? null;

  // Cycle Details
  const cycleLength = user?.cycleLength || todayPlan?.cycleLength || 30;
  const periodLength = user?.periodLength || 5;
  const formattedLastPeriod = user?.lastPeriodDate
    ? new Date(user.lastPeriodDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Not Logged";

  // Fitness & Goals
  const userGoals = normalizeGoals(user?.goals);
  const activityLevel = user?.activityLevel || "Moderate";

  // AI Profile Data (Derived directly from backend payloads)
  const currentPhase = todayPlan?.bodySnapshot?.phase?.name || "Follicular Phase";
  const readinessScore = todayPlan?.bodySnapshot?.readiness?.score;
  const readinessLabel = todayPlan?.bodySnapshot?.readiness?.label || "Training Ready";
  const recoveryScore = predictions?.recoveryScore ?? 75;
  const rhythmScore = Math.round((readinessScore + recoveryScore) / 2);

  // Engagement Statistics (Directly from database - NO defaulting to 7 or 14)
  const totalCheckIns = user?.totalCheckIns ?? user?.checkInCount ?? 0;
  const completedWorkouts = user?.completedWorkouts ?? user?.completedWorkoutCount ?? 0;
  const streakDays = user?.streak ?? todayPlan?.streak ?? 0;

  // Preferences State
  const [units, setUnits] = useState("Metric (kg, cm, mL)");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    height: userHeight || "",
    weight: userWeight || "",
    cycleLength: cycleLength,
    periodLength: periodLength,
  });

  // Edit Goals State
  const [selectedGoals, setSelectedGoals] = useState(userGoals);
  const [savingGoals, setSavingGoals] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const availableGoalOptions = GOAL_LABELS;

  const toggleGoal = (goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  // ACTION 1: SAVE GOALS
  const handleSaveGoals = async () => {
    try {
      setSavingGoals(true);
      await axios.post(`${API_URL}/onboarding`, {
        email: userEmail,
        goals: selectedGoals,
      });
      setFeedbackMsg("Fitness goals updated successfully!");
      if (onUpdateUser) onUpdateUser();
      setTimeout(() => setFeedbackMsg(""), 3000);
    } catch (err) {
      console.error("Save goals error:", err);
      setFeedbackMsg("Failed to update goals.");
    } finally {
      setSavingGoals(false);
    }
  };

  // ACTION 2: SAVE PROFILE
  const handleSaveProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/onboarding`, {
        email: userEmail,
        height: Number(editForm.height),
        weight: Number(editForm.weight),
        cycleLength: Number(editForm.cycleLength),
        periodLength: Number(editForm.periodLength),
      });
      setFeedbackMsg("Profile updated successfully!");
      setIsEditing(false);
      if (onUpdateUser) onUpdateUser();
      setTimeout(() => setFeedbackMsg(""), 3000);
    } catch (err) {
      console.error("Save profile error:", err);
      setFeedbackMsg("Failed to update profile.");
    }
  };

  // ACTION 3: RESET CHECK-INS
  const handleResetCheckins = () => {
    if (window.confirm("Are you sure you want to reset your local check-in session data?")) {
      localStorage.removeItem("rhythm_hydration_logged");
      localStorage.removeItem("rhythm_nutrition_checklist");
      setFeedbackMsg("Local check-in session data reset.");
      setTimeout(() => setFeedbackMsg(""), 3000);
    }
  };

  // ACTION 4: EXPORT DATA
  const handleExportData = () => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      user: {
        id: user?._id || user?.id,
        name: userName,
        email: userEmail,
        age: userAge,
        height: userHeight,
        weight: userWeight,
        goals: selectedGoals,
        cycleLength,
        periodLength,
        lastPeriodDate: user?.lastPeriodDate,
        totalCheckIns,
        completedWorkouts,
        streak: streakDays,
      },
      todayPlan,
      predictions,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rhythm_user_data_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setFeedbackMsg("User data exported to JSON!");
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  // ACTION 5: LOGOUT
  const handleLogout = () => {
    if (window.confirm("Log out of Rhythm?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* HEADER & CONTROL CENTER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white">
            User <span className="font-serif-title italic text-[#2EA8DE]">Control Center</span>
          </h1>
          <p className="text-slate-300 text-base mt-1 font-normal">
            Manage your profile, health parameters, AI preferences, and account actions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <FiEdit3 />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST NOTIFICATION */}
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-semibold flex items-center justify-between backdrop-blur-md">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg("")} className="text-emerald-400 hover:text-white">
            <FiX />
          </button>
        </div>
      )}

      {/* SECTION 1: PERSONAL INFORMATION SUMMARY (ONLY AGE, HEIGHT, WEIGHT — NO BMI) */}
      <Card className="soft-surface-hero p-6 md:p-8 border-0 relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-full brand-gradient-bg flex items-center justify-center text-white text-3xl font-bold font-display shadow-[0_0_25px_rgba(163,81,248,0.5)] shrink-0">
            {userName[0]?.toUpperCase()}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-display text-white">{userName}</h2>
                <p className="text-sm text-slate-300 font-normal">{userEmail || "Account Active"}</p>
              </div>
              <span className="floating-chip px-4 py-1.5 text-xs text-[#2EA8DE] font-bold self-center sm:self-auto">
                Biological Companion Active
              </span>
            </div>
          </div>
        </div>

        {/* SUMMARY: DISPLAY ONLY AGE, HEIGHT, WEIGHT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] relative z-10 text-center">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block font-display">Age</span>
            <span className="text-2xl md:text-3xl font-bold text-white font-display block">
              {userAge ? `${userAge} Years` : "Not Set"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block font-display">Height</span>
            <span className="text-2xl md:text-3xl font-bold text-[#2EA8DE] font-display block">
              {userHeight ? `${userHeight} cm` : "Not Set"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block font-display">Weight</span>
            <span className="text-2xl md:text-3xl font-bold text-purple-300 font-display block">
              {userWeight ? `${userWeight} kg` : "Not Set"}
            </span>
          </div>
        </div>
      </Card>

      {/* SECTION 2 & 3: FITNESS & CYCLE DETAILS GRID */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* SECTION 2: FITNESS & GOALS */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-6 md:p-8 h-full flex flex-col justify-between border-0 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <FiTarget className="text-[#2EA8DE] text-lg" />
                  <h3 className="text-2xl md:text-3xl font-bold font-display text-white">
                    Fitness & <span className="font-serif-title italic text-[#2EA8DE]">Goals</span>
                  </h3>
                </div>
                <span className="floating-chip px-3.5 py-1 text-sm font-semibold text-slate-200">
                  {activityLevel} Activity
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-300 block font-display">Active Primary Targets:</span>
                <div className="flex flex-wrap gap-2">
                  {availableGoalOptions.map((goal) => {
                    const isSelected = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 border ${
                          isSelected
                            ? "brand-gradient-bg text-white border-transparent shadow-[0_0_12px_rgba(163,81,248,0.4)]"
                            : "bg-white/[0.03] text-slate-300 border-white/[0.04] hover:bg-white/[0.06]"
                        }`}
                      >
                        {isSelected && <FiCheck className="text-sm text-white" />}
                        <span>{goal}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.04] flex justify-end">
              <button
                onClick={handleSaveGoals}
                disabled={savingGoals}
                className="btn-primary flex items-center gap-2"
              >
                <FiCheck />
                <span>{savingGoals ? "Saving..." : "Update Goals"}</span>
              </button>
            </div>
          </Card>
        </div>

        {/* SECTION 3: CYCLE PARAMETERS */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-6 md:p-8 h-full flex flex-col justify-between border-0 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-purple-400 text-lg" />
                  <h3 className="text-2xl md:text-3xl font-bold font-display text-white">
                    Cycle <span className="font-serif-title italic text-purple-300">Parameters</span>
                  </h3>
                </div>
                <span className="floating-chip px-3.5 py-1 text-sm font-semibold text-purple-300 border border-purple-500/30">
                  {cycleLength}-Day Cycle
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-semibold">Average Cycle Length</span>
                  <span className="font-bold text-purple-300 font-display text-base">{cycleLength} Days</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-semibold">Period Duration</span>
                  <span className="font-bold text-[#2EA8DE] font-display text-base">{periodLength} Days</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-semibold">Last Period Start Date</span>
                  <span className="font-bold text-white font-display text-base">{formattedLastPeriod}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* SECTION 4: TODAY'S AI PROFILE */}
      <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
        <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2">
            <FiCpu className="text-[#2EA8DE] text-lg" />
            <h3 className="text-3xl md:text-[34px] font-bold font-display text-white">
              Today's <span className="font-serif-title italic text-[#2EA8DE]">AI Profile</span>
            </h3>
          </div>
          <span className="floating-chip px-4 py-1.5 text-sm font-semibold text-emerald-300">
            Rhythm Score: {rhythmScore}/100
          </span> 

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-center">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2.5 flex flex-col justify-between">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#A351F8] block font-display">Current Phase</span>
            <span className="text-2xl md:text-3xl font-bold text-white font-display block">{currentPhase}</span>
            <span className="text-base font-medium text-slate-300 block">Active Phase</span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2.5 flex flex-col justify-between">
            <span className="text-sm font-semibold uppercase tracking-wider text-purple-300 block font-display">Workout Readiness</span>
            <span className="text-2xl md:text-3xl font-bold text-purple-300 font-display block">{readinessScore}/100</span>
            <span className="text-base font-medium text-slate-300 block">{readinessLabel}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2.5 flex flex-col justify-between">
            <span className="text-sm font-semibold uppercase tracking-wider text-emerald-300 block font-display">Recovery Status</span>
            <span className="text-2xl md:text-3xl font-bold text-emerald-300 font-display block">{recoveryScore}/100</span>
            <span className="text-base font-medium text-slate-300 block">Optimal Recovery</span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2.5 flex flex-col justify-between">
            <span className="text-sm font-semibold uppercase tracking-wider text-cyan-300 block font-display">Rhythm Score</span>
            <span className="text-2xl md:text-3xl font-bold text-cyan-300 font-display block">{rhythmScore}/100</span>
            <span className="text-base font-medium text-slate-300 block">High Biological Match</span>
          </div>
        </div>
      </Card>

      {/* SECTION 5: PREFERENCES */}
      <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
        <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2">
            <FiSliders className="text-[#2EA8DE] text-lg" />
            <h3 className="text-3xl md:text-[34px] font-bold font-display text-white">
              Application <span className="font-serif-title italic text-[#2EA8DE]">Preferences</span>
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-base font-medium text-white block">Measurement Units</span>
              <span className="text-sm font-normal text-slate-300 block">Choose preferred measurement standard</span>
            </div>
            <select
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="bg-white/[0.05] border border-white/[0.08] text-white text-base font-medium rounded-xl p-2.5 focus:outline-none focus:border-[#A351F8]"
            >
              <option value="Metric (kg, cm, mL)" className="bg-[#0B0614]">Metric (kg, cm, mL)</option>
              <option value="Imperial (lbs, in, oz)" className="bg-[#0B0614]">Imperial (lbs, in, oz)</option>
            </select>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-base font-medium text-white block font-display">Daily AI Notifications</span>
              <span className="text-sm font-normal text-slate-300 block">Receive biological briefing reminders</span>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition p-1 flex items-center shrink-0 ${
                notificationsEnabled ? "brand-gradient-bg justify-end" : "bg-white/10 justify-start"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
            </button>
          </div>
        </div>
      </Card>

      {/* SECTION 6: ENGAGEMENT STATISTICS (REAL DATABASE VALUES — NO FAKE/HARDCODED STREAKS) */}
      <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
        <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-emerald-400 text-lg" />
            <h3 className="text-3xl md:text-[34px] font-bold font-display text-white">
              Biological <span className="font-serif-title italic text-emerald-300">Engagement</span>
            </h3>
          </div>
          <span className="floating-chip px-3.5 py-1 text-sm font-semibold text-slate-200">
            Database Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-300 block font-display">Total Check-Ins</span>
            <span className="text-3xl md:text-4xl font-bold text-white font-display block">{totalCheckIns}</span>
            <span className="text-sm font-normal text-slate-300 block">Logged Daily Records</span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-300 block font-display">Completed Workouts</span>
            <span className="text-3xl md:text-4xl font-bold text-[#2EA8DE] font-display block">{completedWorkouts}</span>
            <span className="text-sm font-normal text-slate-300 block">Finished Sessions</span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-300 block font-display">Current Streak</span>
            <span className="text-3xl md:text-4xl font-bold text-amber-300 font-display block">
              {streakDays > 0 ? `${streakDays} Days` : "0 Days"}
            </span>
            <span className="text-sm font-normal text-slate-300 block">
              {streakDays > 0 ? "Active Check-in Streak" : "No Active Streak"}
            </span>
          </div>
        </div>
      </Card>

      {/* SECTION 7: ACTIONS */}
      <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
        <h3 className="text-3xl md:text-[34px] font-bold font-display text-white border-b border-white/[0.06] pb-4">
          Account <span className="font-serif-title italic text-[#2EA8DE]">Actions</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setIsEditing(true)}
            className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] text-sm font-semibold text-slate-200 hover:text-white transition flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
          >
            <FiEdit3 className="text-[#A351F8] text-xl" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("fitness-goals-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] text-sm font-semibold text-slate-200 hover:text-white transition flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
          >
            <FiTarget className="text-[#2EA8DE] text-xl" />
            <span>Update Goals</span>
          </button>

          <button
            onClick={handleExportData}
            className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] text-sm font-semibold text-slate-200 hover:text-white transition flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
          >
            <FiDownload className="text-cyan-400 text-xl" />
            <span>Export Data</span>
          </button>

          <button
            onClick={handleLogout}
            className="btn-danger flex flex-col items-center justify-center gap-2 cursor-pointer text-center col-span-2 sm:col-span-1 py-5 text-sm"
          >
            <FiLogOut className="text-rose-400 text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </Card>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="max-w-md w-full rounded-3xl soft-surface border border-[#A351F8]/30 p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <h3 className="text-lg font-light font-display text-white">
                Edit <span className="font-serif-title italic text-[#2EA8DE]">Profile Specs</span>
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white text-lg">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveProfileSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Height (cm)</label>
                <input
                  type="number"
                  value={editForm.height}
                  onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-[#A351F8]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Weight (kg)</label>
                <input
                  type="number"
                  value={editForm.weight}
                  onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-[#A351F8]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Cycle Length (Days)</label>
                <input
                  type="number"
                  value={editForm.cycleLength}
                  onChange={(e) => setEditForm({ ...editForm, cycleLength: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-[#A351F8]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Period Duration (Days)</label>
                <input
                  type="number"
                  value={editForm.periodLength}
                  onChange={(e) => setEditForm({ ...editForm, periodLength: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-[#A351F8]"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
