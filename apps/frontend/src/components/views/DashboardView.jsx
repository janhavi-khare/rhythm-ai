import { useState } from "react";
import Card from "../../ui/Card";
import CircularProgress from "../../ui/CircularProgress";
import {
  FiZap,
  FiActivity,
  FiMoon,
  FiCalendar,
  FiArrowRight,
  FiCheckSquare,
  FiSquare,
  FiCpu,
  FiDroplet,
  FiTarget,
  FiTrendingUp
} from "react-icons/fi";
import { getReadinessLabel, getTrainingLoadLabel } from "../../utils/labels";

export default function DashboardView({
  user,
  todayPlan: propTodayPlan,
  setActiveTab,
  onStartWorkout
}) {
  if (!propTodayPlan) {
    return null;
  }

  const todayPlan = propTodayPlan;
  const greeting = todayPlan.greeting;
  const streak = todayPlan.streak;
  const userName = user.name.split(" ")[0];
  const bodySnapshot = todayPlan.bodySnapshot;
  const workout = todayPlan.workout;
  const nutrition = todayPlan.nutrition || {};
  const rawChecklist = todayPlan.checklist || todayPlan.preWorkoutNutrition?.checklist;
  const recommendationFactors = todayPlan.recommendationFactors || [];
  const hydration = nutrition.hydration || { value: "980", unit: "mL", badge: "Target", title: "Hydration", subtitle: "Fluid Target" };
  const showNutritionButton = Boolean(nutrition.hasNutritionPlan ?? true);

  const readinessScore = bodySnapshot.readiness.score;
  const readinessLabel = getReadinessLabel(readinessScore);
  const workoutObjective = workout.workoutObjective || workout.title;
  const loadLabel = getTrainingLoadLabel(workout.trainingLoad || workout.intensity);
  const coachSummary = workout.coachSummary || workout.reasoning?.[0]?.text || workout.reasoning?.[0] || "Listen to your body and execute today's target session.";

  // Dynamic Fuel Up Checklist State & Normalization
  const checklistTitle = rawChecklist?.title || "Fuel Up Checklist";
  const checklistSubtitle = rawChecklist?.subtitle || "Pre-Workout Preparation";
  const checklistItems = Array.isArray(rawChecklist)
    ? rawChecklist
    : (rawChecklist?.items || []);

  const [completedItems, setCompletedItems] = useState({});

  const toggleChecklistItem = (id, defaultCompleted) => {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : !defaultCompleted,
    }));
  };

  const getChecklistItemState = (item, idx) => {
    if (typeof item === "object" && item !== null) {
      const id = item.id || item.label || `item_${idx}`;
      const isDone = completedItems[id] !== undefined ? Boolean(completedItems[id]) : Boolean(item.completed);
      return { id, label: item.label, isDone };
    }
    const id = String(item);
    const isDone = Boolean(completedItems[id]);
    return { id, label: id, isDone };
  };

  const normalizedChecklist = checklistItems.map(getChecklistItemState);
  const completedCount = normalizedChecklist.filter((item) => item.isDone).length;
  const totalCount = normalizedChecklist.length;

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "water":
        return <FiDroplet className="text-cyan-300" />;
      case "protein":
        return <FiTarget className="text-pink-300" />;
      case "fatigue":
        return <FiMoon className="text-indigo-300" />;
      case "energy":
        return <FiZap className="text-amber-300" />;
      default:
        return <FiTrendingUp className="text-emerald-300" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* 1. LIGHTWEIGHT "TODAY'S BODY SNAPSHOT" HERO */}
      <div className="soft-surface-hero p-6 md:p-8 border-0 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-br from-pink-500/15 via-purple-600/15 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 flex-1">
            {/* DYNAMIC GREETING & SNAPSHOT BADGE & STREAK */}
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-light font-display text-white">
                {greeting}, <span className="font-serif-title italic text-pink-300">{userName}</span>
              </h2>

              <div className="flex items-center gap-2 pt-1">
                <span className="floating-chip px-3 py-1 text-xs font-semibold text-pink-300 font-display flex items-center gap-1.5">
                  <FiCpu className="text-pink-400" />
                  <span>Today's Body Snapshot</span>
                </span>
                <span className="floating-chip px-3 py-1 text-xs font-bold text-amber-300 flex items-center gap-1">
                  <FiZap className="text-amber-400" />
                  <span>{streak} Day Streak</span>
                </span>
              </div>
            </div>

            {/* 4 Implemented Model Outputs: Cycle Phase, Readiness, Fatigue, Recommended Workout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block font-display">Cycle Phase</span>
                <span className="text-sm font-bold text-white font-display mt-0.5 block">{bodySnapshot.phase.name}</span>
                <span className="text-[10px] text-slate-400 block">{bodySnapshot.phase.description}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block font-display">Workout Readiness</span>
                <span className="text-sm font-bold text-emerald-400 font-display mt-0.5 block">{readinessScore} / 100</span>
                <span className="text-[10px] text-emerald-300 block font-semibold">{readinessLabel}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
                <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider block font-display">Fatigue Score</span>
                <span className="text-sm font-bold text-pink-300 font-display mt-0.5 block">{bodySnapshot.fatigue.label}</span>
                <span className="text-[10px] text-slate-400 block">{bodySnapshot.fatigue.score} / 100 Score</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block font-display">Recommended Workout</span>
                <span className="text-sm font-bold text-white font-display mt-0.5 block truncate">{workoutObjective}</span>
                <span className="text-[10px] text-indigo-300 block">{workout.duration}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
            <button
              onClick={onStartWorkout}
              disabled={Boolean(workout?.completed)}
              className={`px-6 py-3 rounded-2xl font-bold text-xs transition ${
                workout?.completed
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                  : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]"
              }`}
            >
              {workout?.completed ? "Workout Complete" : "Start Workout"}
            </button>
            <button
              onClick={() => setActiveTab("workout")}
              className="floating-chip px-5 py-3 text-xs font-bold text-slate-200 hover:text-white transition"
            >
              View Plan
            </button>
          </div>
        </div>
      </div>

      {/* 2 & 3. RHYTHM SCORE & TODAY'S RECOMMENDATION GRID */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* 2. RHYTHM SCORE HERO */}
        <div className="col-span-12 lg:col-span-5">
          <Card className="soft-surface p-6 md:p-8 h-full flex flex-col justify-between border-0">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-light font-display text-white">Rhythm <span className="font-serif-title italic text-pink-300">Score</span></h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                    {readinessLabel}
                  </p>
                </div>
                <span className="floating-chip px-3.5 py-1 text-emerald-300 text-xs font-semibold">
                  {readinessLabel}
                </span>
              </div>

              <div className="flex items-center justify-around my-4">
                <CircularProgress
                  value={readinessScore}
                />
              </div>

              {/* 4 Indicators under score derived from latest check-in */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/[0.05] text-center">
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <FiActivity className="text-pink-400 mx-auto mb-1 text-sm" />
                  <span className="text-[10px] text-slate-400 block">Soreness</span>
                  <span className="text-xs font-bold text-white">{bodySnapshot.soreness}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <FiZap className="text-amber-400 mx-auto mb-1 text-sm" />
                  <span className="text-[10px] text-slate-400 block">Energy</span>
                  <span className="text-xs font-bold text-white">Lvl {bodySnapshot.energy.level}/5</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <FiMoon className="text-indigo-400 mx-auto mb-1 text-sm" />
                  <span className="text-[10px] text-slate-400 block">Sleep</span>
                  <span className="text-xs font-bold text-white">{bodySnapshot.sleep.quality}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <FiCalendar className="text-purple-400 mx-auto mb-1 text-sm" />
                  <span className="text-[10px] text-slate-400 block">Phase</span>
                  <span className="text-xs font-bold text-white">{bodySnapshot.phase.name}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 3. TODAY'S RECOMMENDATION */}
        <div className="col-span-12 lg:col-span-7">
          <Card className="soft-surface-hero p-6 md:p-8 h-full flex flex-col justify-between border-0">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 font-display">
                  Today's Primary Focus
                </span>
                <span className="floating-chip px-3 py-1 text-xs font-semibold text-slate-200">
                  {workout.badge || loadLabel}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-light font-display text-white">
                {workoutObjective}
              </h2>

              <div className="flex items-center gap-3 my-4">
                <span className="floating-chip px-4 py-1.5 text-xs font-semibold text-slate-200">
                  ⏱ {workout.duration}
                </span>
                <span className="floating-chip px-4 py-1.5 text-xs font-semibold text-pink-300">
                  ⚡ Load: {loadLabel}
                </span>
                {workout.intensity && (
                  <span className="floating-chip px-4 py-1.5 text-xs font-semibold text-purple-300">
                    Intensity: {workout.intensity}
                  </span>
                )}
              </div>

              <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed my-2">
                {coachSummary}
              </p>

              {/* RECOMMENDATION FACTORS ARRAY FROM PYTHON BACKEND */}
              <div className="mt-4 pt-4 border-t border-white/[0.05] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 font-display">
                  Recommendation Factors:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  {recommendationFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab(workout.available ? "workout" : "dashboard")}
              className="mt-6 w-full py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-slate-100 transition flex items-center justify-center gap-2"
            >
              <span>{workout.available ? "Explore Workout Plan" : "Generate Plan"}</span>
              <FiArrowRight />
            </button>
          </Card>
        </div>
      </div>

      {/* 4 & 5. TODAY'S NUTRITION PRIORITIES & DYNAMIC CHECKLIST GRID */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* TODAY'S NUTRITION PRIORITIES */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-6 md:p-8 h-full flex flex-col justify-between border-0">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-light font-display text-white">
                  Today's <span className="font-serif-title italic text-pink-300">Nutrition Priorities</span>
                </h3>
                {showNutritionButton && (
                  <button
                    onClick={() => setActiveTab("nutrition")}
                    className="text-xs text-pink-300 font-semibold hover:underline flex items-center gap-1"
                  >
                    View Nutrition Plan →
                  </button>
                )}
              </div>

              {nutrition.tip && (
                <p className="text-[11px] text-slate-400 mb-3 italic">
                  "{nutrition.tip}"
                </p>
              )}

              {/* Priority Nutrients rendered with backend metadata */}
              <div className="space-y-2.5">
                {Array.isArray(nutrition.priorityNutrients) && nutrition.priorityNutrients.length > 0 ? (
                  nutrition.priorityNutrients.map((item, idx) => {
                    const name = typeof item === "object" ? (item.name || item.title) : String(item);
                    const rank = typeof item === "object" ? (item.rank || idx + 1) : idx + 1;
                    const priorityTag = typeof item === "object" ? (item.priority || "High Priority") : "Essential";
                    const iconName = typeof item === "object" ? item.icon : (name.toLowerCase().includes("protein") ? "protein" : "water");
                    const reasoningText = typeof item === "object" ? (item.reason || item.reasoning || item.description) : null;
                    const targetText = typeof item === "object" ? item.target : null;

                    return (
                      <div key={idx} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] shrink-0">
                            {renderIcon(iconName)}
                          </div>
                          <div>
                            <span className="text-[10px] text-pink-300 uppercase tracking-wider font-bold block font-display">
                              Priority {rank}
                            </span>
                            <h4 className="text-xs font-bold text-white font-display">{name}</h4>
                            {reasoningText && <p className="text-[10px] text-slate-400 mt-0.5">{reasoningText}</p>}
                            {targetText && <p className="text-[10px] text-emerald-400 mt-0.5 font-semibold">Target: {targetText}</p>}
                          </div>
                        </div>
                        <span className="floating-chip px-3 py-1 text-[11px] font-bold text-pink-300 shrink-0">
                          {priorityTag}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 italic">No nutrition priorities specified for today.</p>
                )}

                {typeof hydration === "object" && (
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05]">
                        {renderIcon(hydration.icon || "water")}
                      </div>
                      <div>
                        <span className="text-[10px] text-cyan-300 uppercase tracking-wider font-bold block font-display">{hydration.title || "Hydration"}</span>
                        <h4 className="text-xs font-bold text-white font-display">{hydration.subtitle || "Fluid Intake Target"}</h4>
                      </div>
                    </div>
                    <span className="floating-chip px-3 py-1 text-[11px] font-bold text-cyan-300">
                      {hydration.badge || "Target"} {hydration.value || "980"} {hydration.unit || "mL"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* DYNAMIC FUEL UP CHECKLIST */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-6 md:p-8 h-full flex flex-col justify-between border-0">
            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-lg font-light font-display text-white">
                    {checklistTitle}
                  </h3>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {checklistSubtitle}
                  </span>
                </div>
                <span className="floating-chip px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/20">
                  {totalCount > 0 ? `${completedCount}/${totalCount} Completed` : "Action Plan"}
                </span>
              </div>

              {totalCount > 0 && (
                <div className="w-full h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              )}

              <div className="space-y-2.5 my-3">
                {totalCount > 0 ? (
                  normalizedChecklist.map(({ id, label, isDone }) => {
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleChecklistItem(id, isDone)}
                        className={`w-full p-3.5 rounded-2xl text-left text-xs font-semibold flex items-center justify-between gap-3 transition cursor-pointer border ${
                          isDone
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : "bg-white/[0.03] text-slate-200 border-white/[0.04] hover:bg-white/[0.06] hover:border-cyan-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isDone ? (
                            <FiCheckSquare className="text-emerald-400 text-base shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                          ) : (
                            <FiSquare className="text-slate-400 text-base shrink-0" />
                          )}
                          <span className={isDone ? "line-through opacity-70" : ""}>{label}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isDone ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-slate-400"
                        }`}>
                          {isDone ? "Done" : "Pending"}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">
                    Checklist will appear after AI recommendation.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
