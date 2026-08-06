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
  const greeting = todayPlan?.greeting || "Hello";
  const streak = user?.streak ?? todayPlan?.streak ?? 0;
  const userName = user?.name ? user.name.split(" ")[0] : "User";
  const bodySnapshot = todayPlan.bodySnapshot;
  const workout = todayPlan.workout;
  const nutrition = todayPlan.nutrition || {};
  const rawChecklist = todayPlan.checklist || todayPlan.preWorkoutNutrition?.checklist;
  const recommendationFactors = todayPlan.recommendationFactors || [];
  const hydration = nutrition.hydration;
  const showNutritionButton = Boolean(nutrition.hasNutritionPlan ?? true);

  const readinessScore = bodySnapshot.readiness.score;
  const readinessLabel = getReadinessLabel(readinessScore);
  const workoutObjective = workout.workoutObjective || workout.title;
  const loadLabel = getTrainingLoadLabel(workout.trainingLoad || workout.intensity);
  const coachSummary = workout.coachSummary || workout.reasoning?.[0]?.text || workout.reasoning?.[0] || "Listen to your body and execute today's target session.";

  // Dynamic Fuel Up Checklist State & Normalization
  const checklistTitle = "Fuel Up Checklist";
  const checklistSubtitle = "Pre-Workout Preparation";
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
      {/* 1. HIGH-HIERARCHY HERO SECTION (OURA / APPLE HEALTH STYLE) */}
      <div className="space-y-6 mb-8">
        {/* DYNAMIC GREETING & SNAPSHOT HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-[42px] font-bold font-display text-white">
              {greeting}, <span className="font-serif-title italic text-[#2EA8DE]">{userName}</span>
            </h1>
            <p className="text-slate-300 text-base font-normal">
              Your daily biological briefing and prescribed training recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <span className="floating-chip px-4 py-2 text-sm font-semibold text-[#2EA8DE] font-display flex items-center gap-2">
              <FiCpu className="text-[#A351F8]" />
              <span>Body Intelligence</span>
            </span>
            <span className="floating-chip px-4 py-2 text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <FiZap className="text-amber-400" />
              <span>{streak} Day Streak</span>
            </span>
          </div>
        </div>

        {/* HERO GRID: PRIMARY WORKOUT HERO (7 COLS) + SUPPORTING METRICS (5 COLS) */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* PRIMARY FOCAL HERO CARD: TODAY'S WORKOUT */}
          <div className="col-span-12 lg:col-span-7">
            <Card className="soft-surface-hero p-6 md:p-8 h-full flex flex-col justify-between border-0 relative overflow-hidden space-y-6">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-[#8F37FA]/20 via-[#6163F3]/15 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#A351F8] font-display flex items-center gap-2">
                    <FiZap className="text-[#2EA8DE]" />
                    <span>Today</span>
                  </span>
                  <span className="floating-chip px-3.5 py-1 text-sm font-bold text-slate-200">
                    {workout.badge || loadLabel}
                  </span>
                </div>

                {/* Dominant Objective Headline */}
                <h2 className="text-3xl md:text-4xl font-bold font-display text-white leading-tight">
                  {workoutObjective}
                </h2>

                {/* Workout Attributes Chips */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="floating-chip px-4 py-1.5 text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    ⏱ {workout.duration}
                  </span>
                  <span className="floating-chip px-4 py-1.5 text-sm font-semibold text-[#2EA8DE]">
                    ⚡ Load: {loadLabel}
                  </span>
                  {workout.intensity && (
                    <span className="floating-chip px-4 py-1.5 text-sm font-semibold text-purple-300">
                      Intensity: {workout.intensity}
                    </span>
                  )}
                </div>
                {/* Structured Coach Guidance Box */}
                <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A351F8] block font-display">
                    Biological Insight & Guidance
                  </span>
                  <p className="text-base text-slate-200 font-normal leading-relaxed">
                    {coachSummary}
                  </p>
                </div>

                {/* Session Target Structure Tiles */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.04] text-center space-y-0.5">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider font-display">Warm-up</span>
                    <span className="text-sm font-bold text-white block">
                      {typeof workout?.warmup === "object" ? (workout.warmup.duration ? `${workout.warmup.duration} min` : "10 min Dynamic") : (typeof workout?.warmup === "string" ? workout.warmup : "10 min Dynamic")}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.04] text-center space-y-0.5">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider font-display">Session Focus</span>
                    <span className="text-sm font-bold text-[#2EA8DE] block truncate">
                      {typeof workout?.trainingStyle === "string" ? workout.trainingStyle : (Array.isArray(workout?.todayRecoveryFocus) ? workout.todayRecoveryFocus[0] : (typeof workout?.todayRecoveryFocus === "string" ? workout.todayRecoveryFocus : "Strength & Power"))}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.04] text-center space-y-0.5">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider font-display">Rest Interval</span>
                    <span className="text-sm font-bold text-emerald-400 block">
                      {typeof workout?.restIntervals === "string" ? workout.restIntervals : "90s Recovery"}
                    </span>
                  </div>
                </div>

                {/* Biological Recommendation Factors Grid */}
                {recommendationFactors.length > 0 && (
                  <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block font-display">
                      Biological Signals Evaluated:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {recommendationFactors.map((factor, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center gap-2.5 hover:bg-white/[0.05] transition-all">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">✓</span>
                          <span className="text-sm font-medium text-slate-200">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* INTEGRATED CTA BUTTONS */}
              <div className="flex flex-wrap items-center gap-3 pt-4 relative z-10 border-t border-white/[0.06]">
                <button
                  onClick={onStartWorkout}
                  disabled={Boolean(workout?.completed)}
                  className={workout?.completed ? "px-6 py-3.5 rounded-2xl font-semibold text-base bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default" : "btn-primary text-base font-semibold px-7 py-3.5 shadow-[0_0_30px_rgba(163,81,248,0.5)]"}
                >
                  {workout?.completed ? "Workout Complete" : "Start Workout"}
                </button>
                <button
                  onClick={() => setActiveTab("workout")}
                  className="btn-ghost text-base font-semibold px-6 py-3.5 flex items-center gap-2"
                >
                  <span>Explore Workout Plan</span>
                  <FiArrowRight />
                </button>
              </div>
            </Card>
          </div>

          {/* SUPPORTING METRIC CARDS (5 COLS - OURA / GENTLER STREAK / APPLE HEALTH STYLE) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-between gap-4">
            {/* CARD 1: WORKOUT READINESS */}
            <Card className="soft-surface p-5 md:p-6 border-0 flex-1 flex flex-col justify-between space-y-3">
              {/* Top Header Label & Icon Anchor */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-base">
                    🏋️
                  </span>
                  <span className="text-[14px] font-semibold uppercase tracking-wider text-emerald-300 font-display">
                    Workout Readiness
                  </span>
                </div>
                <span className="text-[13px] font-medium text-slate-400">Biological Index</span>
              </div>

              {/* Primary Hero Metric & Secondary Status Group */}
              <div className="py-1 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-bold text-white font-display">
                    {readinessScore}
                  </span>
                  <span className="text-lg font-medium text-slate-400">/100</span>
                </div>

                <span className="text-[17px] font-semibold text-emerald-400 block">
                  {readinessLabel}
                </span>
              </div>

              {/* Supporting Text & Divider */}
              <div className="pt-2 border-t border-white/[0.06]">
                <span className="text-[15px] font-normal text-slate-300 block">
                  {bodySnapshot.readinessSummary || bodySnapshot.readiness?.summary || todayPlan.readinessSummary || (readinessScore >= 80 ? "Recovery score and sleep quality support today's prescribed workload." : readinessScore >= 60 ? "Balanced recovery supports productive training with controlled intensity." : "Reduced recovery suggests lowering today's overall training demand.")}
                </span>
              </div>
            </Card>

            {/* CARD 2: FATIGUE STATUS */}
            <Card className="soft-surface p-5 md:p-6 border-0 flex-1 flex flex-col justify-between space-y-3">
              {/* Top Header Label & Icon Anchor */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#A351F8]/10 text-[#2EA8DE] text-base">
                    ⚡
                  </span>
                  <span className="text-[14px] font-semibold uppercase tracking-wider text-[#A351F8] font-display">
                    Fatigue Status
                  </span>
                </div>
                <span className="text-[13px] font-medium text-slate-400">System Load</span>
              </div>

              {/* Primary Hero Metric & Secondary Status Group */}
              <div className="py-1 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl md:text-4xl font-bold text-white font-display">
                    {bodySnapshot.fatigue.score}
                  </span>
                  <span className="text-lg font-medium text-slate-400">/100</span>
                </div>

                <span className="text-[17px] font-semibold text-[#2EA8DE] block">
                  {bodySnapshot.fatigue.label} Fatigue
                </span>
              </div>

              {/* Supporting Text & Divider */}
              <div className="pt-2 border-t border-white/[0.06]">
                <span className="text-[15px] font-normal text-slate-300 block">
                  {bodySnapshot.fatigueSummary || bodySnapshot.fatigue?.summary || todayPlan.fatigueSummary || (bodySnapshot.fatigue.score >= 60 ? "Elevated fatigue warrants lighter training and greater recovery emphasis." : bodySnapshot.fatigue.score >= 35 ? "Fatigue remains manageable with today's adjusted training volume." : "Minimal system fatigue allows optimal adaptation to training stimulus.")}
                </span>
              </div>
            </Card>

            {/* CARD 3: ACTIVE CYCLE PHASE */}
            <Card className="soft-surface p-5 md:p-6 border-0 flex-1 flex flex-col justify-between space-y-3">
              {/* Top Header Label & Icon Anchor */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-300 text-base">
                    🌙
                  </span>
                  <span className="text-[14px] font-semibold uppercase tracking-wider text-purple-300 font-display">
                    Current Phase
                  </span>
                </div>
                <span className="text-[13px] font-medium text-slate-400">Hormonal Cycle</span>
              </div>

              {/* Primary Hero Metric & Secondary Status Group */}
              <div className="py-1 space-y-1">
                <span className="text-3xl md:text-4xl font-bold text-white font-display block leading-tight">
                  {bodySnapshot.phase.name}
                </span>

                <span className="text-[17px] font-semibold text-purple-300 block">
                  Day {user?.cycleDay || bodySnapshot?.phase?.day || 22} of {user?.cycleLength || 28}
                </span>
              </div>

              {/* Supporting Text & Divider */}
              <div className="pt-2 border-t border-white/[0.06]">
                <span className="text-[15px] font-normal text-slate-300 block">
                  {bodySnapshot.phaseSummary || bodySnapshot.phase?.summary || todayPlan.phaseSummary || (bodySnapshot.phase.name?.toLowerCase().includes("follicular") ? "Current hormonal profile supports progressive training and energy production." : bodySnapshot.phase.name?.toLowerCase().includes("ovulation") ? "Estrogen peak provides high neurological drive and strength capacity." : bodySnapshot.phase.name?.toLowerCase().includes("luteal") ? "Recovery-focused training better aligns with today's biological state." : "Restorative movement supports biological recovery during active menses.")}
                </span>
              </div>
            </Card>
          </div>
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

              {/* Priority Nutrients rendered with luxury health soft glass styling */}
              <div className="space-y-3">
                {Array.isArray(nutrition.priorityNutrients) && nutrition.priorityNutrients.length > 0 ? (
                  nutrition.priorityNutrients.map((item, idx) => {
                    const name = typeof item === "object" ? (item.name || item.title) : String(item);
                    const rank = typeof item === "object" ? (item.rank || idx + 1) : idx + 1;
                    const priorityTag = typeof item === "object" ? (item.priority || "High Priority") : "Essential";
                    const iconName = typeof item === "object" ? item.icon : (name.toLowerCase().includes("protein") ? "protein" : "water");
                    const reasoningText = typeof item === "object" ? (item.reason || item.reasoning || item.description) : null;
                    const targetText = typeof item === "object" ? item.target : null;

                    return (
                      <div key={idx} className="p-4 rounded-[20px] bg-white/[0.03] border border-white/[0.05] flex items-center justify-between gap-4 hover:bg-white/[0.06] hover:shadow-[0_0_25px_rgba(163,81,248,0.12)] transition-all">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] shrink-0 text-lg">
                            {renderIcon(iconName)}
                          </div>
                          <div>
                            <span className="text-sm text-pink-300 uppercase tracking-wider font-semibold block font-display">
                              Priority {rank}
                            </span>
                            <h4 className="text-base font-bold text-white font-display">{name}</h4>
                            {reasoningText && <p className="text-sm text-slate-300 mt-0.5 font-normal">{reasoningText}</p>}
                            {targetText && <p className="text-sm text-emerald-400 mt-0.5 font-semibold">Target: {targetText}</p>}
                          </div>
                        </div>
                        <span className={priorityTag.toLowerCase().includes("high") ? "badge-high-priority shrink-0" : "badge-essential shrink-0"}>
                          {priorityTag}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-300 italic">No nutrition priorities specified for today.</p>
                )}

                {typeof hydration === "object" && (
                  <div className="p-4 rounded-[20px] bg-white/[0.03] border border-white/[0.05] flex items-center justify-between gap-4 hover:bg-white/[0.06] hover:shadow-[0_0_25px_rgba(46,168,222,0.12)] transition-all">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] text-lg">
                        {renderIcon(hydration.icon || "water")}
                      </div>
                      <div>
                        <span className="text-sm text-cyan-300 uppercase tracking-wider font-semibold block font-display">{hydration.title || "Hydration"}</span>
                        <h4 className="text-base font-bold text-white font-display">{hydration.subtitle || "Fluid Intake Target"}</h4>
                      </div>
                    </div>
                    <span className="badge-completed shrink-0">
                      {hydration.badge || "Target"} {hydration.value || "980"} {hydration.unit || "mL"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* DYNAMIC FUEL UP CHECKLIST — UNIFIED CONTAINER CARD */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-6 md:p-8 h-full flex flex-col justify-between border-0">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-light font-display text-white">
                    {checklistTitle}
                  </h3>
                  <span className="text-sm text-slate-300 block font-normal">
                    {checklistSubtitle}
                  </span>
                </div>
                <span className="badge-completed">
                  {totalCount > 0 ? `${completedCount}/${totalCount} Completed` : "Action Plan"}
                </span>
              </div>

              {totalCount > 0 && (
                <div className="w-full h-2 bg-white/10 rounded-full mb-5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-[#A351F8] to-emerald-400 transition-all duration-300 shadow-[0_0_12px_rgba(52,211,153,0.6)]"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              )}

              {/* UNIFIED CONTAINER CARD FOR CHECKLIST WITH SUBTLE DIVIDERS */}
              <div className="my-2 bg-white/[0.03] border border-white/[0.05] rounded-[20px] overflow-hidden divide-y divide-white/[0.06]">
                {totalCount > 0 ? (
                  normalizedChecklist.map(({ id, label, isDone }) => {
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleChecklistItem(id, isDone)}
                        className={`w-full p-4 px-5 text-left text-sm font-semibold flex items-center justify-between gap-4 transition cursor-pointer ${
                          isDone
                            ? "bg-emerald-500/[0.08] text-emerald-300"
                            : "bg-transparent text-slate-200 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {isDone ? (
                            <FiCheckSquare className="text-emerald-400 text-lg shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                          ) : (
                            <FiSquare className="text-slate-400 text-lg shrink-0" />
                          )}
                          <span className={isDone ? "line-through opacity-70" : "font-medium"}>{label}</span>
                        </div>
                        <span className={isDone ? "badge-completed shrink-0" : "badge-pending shrink-0"}>
                          {isDone ? "Done" : "Pending"}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-300 italic p-6">
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
