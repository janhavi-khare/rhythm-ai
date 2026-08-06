import { useState, useEffect } from "react";
import Card from "../../ui/Card";
import {
  FiDroplet,
  FiTarget,
  FiZap,
  FiActivity,
  FiCpu,
  FiClock,
  FiSunrise,
  FiSun,
  FiMoon,
  FiCoffee,
  FiArrowRight,
  FiTrendingUp,
  FiInfo,
  FiCheckCircle,
  FiHeart,
  FiCheckSquare,
  FiSquare,
  FiAward
} from "react-icons/fi";

// Intelligent Hydration Value Formatter
function formatHydrationTarget(raw) {
  if (!raw) return "800–1000 mL";
  const str = String(raw);
  const numbers = str.match(/\d+/g);
  if (numbers && numbers.length >= 2) {
    let min = parseInt(numbers[0], 10);
    let max = parseInt(numbers[1], 10);
    min = Math.round(min / 50) * 50;
    max = Math.round(max / 50) * 50;
    if (min >= 1000) {
      return `${(min / 1000).toFixed(1)}–${(max / 1000).toFixed(1)} L`;
    }
    return `${min}–${max} mL`;
  }
  if (numbers && numbers.length === 1) {
    let val = parseInt(numbers[0], 10);
    val = Math.round(val / 50) * 50;
    return val >= 1000 ? `${(val / 1000).toFixed(1)} L` : `${val} mL`;
  }
  return str;
}

// Rationale Explanatory Transformer (Answers: "What effect did this have?")
function formatRationaleFactor(factor, isCompleted) {
  if (typeof factor === "object" && factor !== null) {
    const title = factor.type || factor.title || factor.category || "Biological Factor";
    const description = factor.text || factor.description || factor.explanation || String(factor);
    return { title, description };
  }

  const str = String(factor);

  if (str.includes("Sleep Quality")) {
    const val = str.split(":")[1]?.trim() || "Average";
    return {
      title: "Sleep Quality Impact",
      description: isCompleted
        ? `${val} sleep quality requires sustained protein and electrolyte replenishment for muscle cell repair.`
        : `${val} sleep slightly reduces recovery efficiency, so today's plan prioritizes steady pre-workout energy.`
    };
  }
  if (str.includes("Energy Level") || str.includes("Energy")) {
    const val = str.split(":")[1]?.trim() || "Moderate";
    return {
      title: "Energy & Glycogen Demand",
      description: isCompleted
        ? `Energy level (${val}) determines post-session carbohydrate refueling to restore depleted muscle glycogen.`
        : `Subjective energy (${val}) increases pre-workout carbohydrate priority to maintain stamina during training.`
    };
  }
  if (str.includes("Stress Level") || str.includes("Stress")) {
    const val = str.split(":")[1]?.trim() || "Moderate";
    return {
      title: "Stress & Cortisol Response",
      description: `${val} stress levels call for magnesium-rich recovery foods and stable blood sugar management.`
    };
  }
  if (str.includes("Phase") || str.includes("Cycle")) {
    const val = str.split(":")[1]?.trim() || "Follicular";
    return {
      title: "Cycle Phase Fueling",
      description: isCompleted
        ? `${val} phase enhances amino acid absorption and post-workout protein synthesis.`
        : `${val} phase supports higher training intensity and optimal pre-workout carbohydrate utilization.`
    };
  }
  if (str.includes("Yesterday") || str.includes("Workout")) {
    return {
      title: "Workout Load Effect",
      description: isCompleted
        ? "Today's completed session triggered muscle micro-tears requiring immediate leucine-rich protein and fluid recovery."
        : "Yesterday's training session increased today's baseline pre-workout carbohydrate and hydration targets."
    };
  }

  return {
    title: "Biological Factor",
    description: str
  };
}

export default function NutritionView({ todayPlan, nutrition: propNutrition, setActiveTab }) {
  const nutrition = propNutrition || todayPlan?.nutrition;
  const bodySnapshot = todayPlan?.bodySnapshot;
  const workout = todayPlan?.workout;

  // WORKOUT COMPLETION STATE RECOGNITION
  const isWorkoutCompleted = Boolean(
    workout?.completed ||
    workout?.status === "COMPLETED" ||
    todayPlan?.mode === "RECOVERY"
  );

  const hasWorkoutPlanned = Boolean(workout && workout.available !== false);

  // Checklist Completion state with localStorage persistence
  const [checklistState, setChecklistState] = useState(() => {
    try {
      const saved = localStorage.getItem("rhythm_nutrition_checklist");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("rhythm_nutrition_checklist", JSON.stringify(checklistState));
    } catch (e) {
      console.error("Failed to save checklist state:", e);
    }
  }, [checklistState]);

  // EMPTY STATE
  if (!todayPlan || !nutrition) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-pink-400 text-2xl shadow-[0_0_30px_rgba(236,72,153,0.2)]">
          <FiTarget />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-light font-display text-white">
            Nutrition Protocol <span className="font-serif-title italic text-pink-300">Pending</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-light">
            Complete today's check-in to generate nutrition recommendations tailored to your cycle phase, readiness, and training load.
          </p>
        </div>
        {setActiveTab && (
          <button
            onClick={() => setActiveTab("dashboard")}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-[0_0_20px_rgba(236,72,153,0.4)] transition inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Complete Today's Check-In</span>
            <FiArrowRight />
          </button>
        )}
      </div>
    );
  }

  // NUTRITION DATA NORMALIZATION
  const preWorkoutData = nutrition.preWorkoutNutrition || todayPlan.preWorkoutNutrition || {};
  const recoveryData = nutrition.recoveryNutrition || todayPlan.recoveryNutrition || {};

  // Pre-Workout Values
  const preProtein = preWorkoutData.proteinTarget || (nutrition.macros?.protein ? `${Math.round(nutrition.macros.protein * 0.4)}–${Math.round(nutrition.macros.protein * 0.5)} g` : "15–20 g");
  const preCarbs = preWorkoutData.carbsTarget || (nutrition.macros?.carbs ? `${Math.round(nutrition.macros.carbs * 0.5)}–${Math.round(nutrition.macros.carbs * 0.6)} g` : "30–45 g");
  const preHydration = preWorkoutData.hydrationTarget || "300–400 mL";
  const preTiming = preWorkoutData.timing || "30–60 minutes before training";
  const preMeals = preWorkoutData.recommendedFoods || preWorkoutData.meals || (Array.isArray(nutrition.recommendedFoods) ? nutrition.recommendedFoods.slice(0, 2) : ["Overnight Oats + Almond Butter", "Banana & Greek Yogurt"]);

  // Post-Workout Values
  const postProtein = recoveryData.macros?.protein ? `${recoveryData.macros.protein} g` : (nutrition.macros?.protein ? `${nutrition.macros.protein} g` : "25–35 g");
  const postCarbs = recoveryData.macros?.carbs ? `${recoveryData.macros.carbs} g` : (nutrition.macros?.carbs ? `${nutrition.macros.carbs} g` : "40–60 g");
  const postHydration = formatHydrationTarget(recoveryData.hydration || nutrition.hydrationTarget || "800–1000 mL");
  const postWindow = recoveryData.recoveryWindow || "Within 45–60 minutes post-session";
  const postMeals = recoveryData.recoveryFoods || recoveryData.foods || (Array.isArray(nutrition.recommendedFoods) ? nutrition.recommendedFoods.slice(1, 3) : ["Grilled Chicken Bowl & Quinoa", "Baked Salmon & Sweet Potato"]);

  // Checklist Items Normalization (Fuel Up or Recovery)
  const checklistObj = isWorkoutCompleted
    ? (recoveryData.checklist || todayPlan.checklist)
    : (todayPlan.checklist || preWorkoutData.checklist);

  const checklistItemsRaw = Array.isArray(checklistObj)
    ? checklistObj
    : (checklistObj?.items || []);

  const toggleChecklistItem = (id, defaultDone) => {
    setChecklistState((prev) => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : !defaultDone,
    }));
  };

  const normalizedChecklist = checklistItemsRaw.map((item, idx) => {
    if (typeof item === "object" && item !== null) {
      const id = item.id || item.label || `item_${idx}`;
      const isDone = checklistState[id] !== undefined ? Boolean(checklistState[id]) : Boolean(item.completed);
      return { id, label: item.label, isDone };
    }
    const id = String(item);
    const isDone = Boolean(checklistState[id]);
    return { id, label: id, isDone };
  });

  const checklistCompletedCount = normalizedChecklist.filter((item) => item.isDone).length;
  const checklistTotalCount = normalizedChecklist.length;
  const checklistProgressPercent = checklistTotalCount > 0 ? Math.round((checklistCompletedCount / checklistTotalCount) * 100) : 0;

  // AI Reasoning Factors
  const rawReasoning = nutrition.reasoning || todayPlan.recommendationFactors || workout?.reasoning || [];
  const reasoningList = Array.isArray(rawReasoning) ? rawReasoning.map((r) => formatRationaleFactor(r, isWorkoutCompleted)) : [];

  // Coach Message
  const coachMessage = isWorkoutCompleted
    ? (recoveryData.message || nutrition.coachMessage || "Great job completing today's session! Shift focus to protein synthesis, fluid replenishment, and rest.")
    : (nutrition.coachMessage || nutrition.tip || workout?.coachSummary || "Fuel your body with easily digestible carbs and hydration prior to today's workout.");

  // Priority Nutrients
  const priorityNutrientsRaw = nutrition.priorityNutrients || [];
  const priorityNutrientsList = Array.isArray(priorityNutrientsRaw) ? priorityNutrientsRaw.slice(0, 3) : [];

  // Meal Suggestions
  const rawMealSuggestions = nutrition.mealSuggestions || [];

  // ----------------------------------------------------
  // STATE 1: AFTER WORKOUT (RECOVERY NUTRITION VIEW)
  // ----------------------------------------------------
  if (isWorkoutCompleted) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto pb-16">
        {/* HEADER & RECOVERY SUMMARY */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-light font-display text-white flex items-center gap-3">
                <span>Post-Workout</span>
                <span className="font-serif-title italic text-emerald-300">Recovery Nutrition</span>
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1 font-light">
                Session Completed — Anabolic recovery window active.
              </p>
            </div>

            <div className="floating-chip px-4 py-2 text-xs font-bold text-emerald-300 self-start sm:self-auto flex items-center gap-2 border border-emerald-500/30">
              <FiAward className="text-emerald-400" />
              <span>Workout Completed</span>
            </div>
          </div>

          <Card className="soft-surface-hero p-6 md:p-8 border-0 relative overflow-hidden space-y-6">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-br from-emerald-500/15 via-teal-600/15 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-display flex items-center gap-2">
                  <FiHeart className="text-emerald-400" />
                  <span>Recovery Nutrition Summary</span>
                </span>
                <span className="floating-chip px-3 py-1 text-xs font-bold text-cyan-300">
                  Refuel Window: {postWindow}
                </span>
              </div>

              <p className="text-sm md:text-base font-light text-slate-100 leading-relaxed max-w-3xl">
                "{coachMessage}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] relative z-10">
              <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 block font-display">
                  Post-Workout Protein Target
                </span>
                <span className="text-2xl md:text-3xl font-bold text-white font-display block">
                  {postProtein}
                </span>
                <span className="text-xs font-medium text-slate-300 block">Leucine-rich muscle repair</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 block font-display">
                  Recovery Carbohydrates
                </span>
                <span className="text-2xl md:text-3xl font-bold text-purple-300 font-display block">
                  {postCarbs}
                </span>
                <span className="text-xs font-medium text-slate-300 block">Glycogen replenishment</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 block font-display">
                  Hydration Goal
                </span>
                <span className="text-2xl md:text-3xl font-bold text-cyan-300 font-display block">
                  {postHydration}
                </span>
                <span className="text-xs font-medium text-slate-300 block">Fluid + electrolyte balance</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RECOVERY MEAL SUGGESTIONS */}
        <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
            <div>
              <h3 className="text-xl font-light font-display text-white">
                Recovery <span className="font-serif-title italic text-emerald-300">Meal Suggestions</span>
              </h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Post-session meal options designed for rapid muscle synthesis and glycogen replenishment.
              </p>
            </div>
            <span className="floating-chip px-3 py-1 text-xs font-semibold text-emerald-300">
              Anabolic Window
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {postMeals.map((meal, idx) => {
              const title = typeof meal === "object" ? (meal.title || meal.name) : String(meal);
              const text = typeof meal === "object" ? (meal.text || meal.description) : "Optimal leucine-to-carb ratio for recovery.";
              return (
                <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2 flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-emerald-400 text-sm shrink-0" />
                    <span className="text-sm text-emerald-300 uppercase tracking-wider font-semibold block font-display">Post-Workout Meal #{idx + 1}</span>
                  </div>
                  <h4 className="text-2xl font-bold text-white font-display pt-1">{title}</h4>
                  <p className="text-base text-slate-300 font-normal leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI RECOVERY NUTRITION REASONING */}
        <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-4">
            <FiCpu className="text-emerald-400 text-xl" />
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold font-display text-white">
                AI Recovery Nutrition <span className="font-serif-title italic text-emerald-300">Reasoning</span>
              </h3>
              <p className="text-sm text-slate-300 font-normal mt-0.5">
                Post-session biological rationale explaining recovery fueling targets.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reasoningList.length > 0 ? (
              reasoningList.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2">
                  <span className="text-sm text-emerald-300 uppercase tracking-wider font-semibold block font-display">
                    {item.title}
                  </span>
                  <p className="text-base text-slate-200 font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-300 italic py-4">No explicit rationale factors recorded for recovery.</p>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // ----------------------------------------------------
  // STATE 2: BEFORE WORKOUT (PRE-WORKOUT FUELING VIEW)
  // ----------------------------------------------------
  if (hasWorkoutPlanned) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto pb-16">
        {/* HEADER & COACH SUMMARY */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-display text-white">
                Pre-Workout <span className="font-serif-title italic text-amber-300">Fueling Guide</span>
              </h1>
              <p className="text-slate-300 text-base mt-1 font-normal">
                State-Aware Pre-Workout Fueling — Optimizing glycogen stores, stamina, and cellular hydration.
              </p>
            </div>

            {bodySnapshot?.phase?.name && (
              <div className="floating-chip px-4 py-2 text-sm font-semibold text-[#2EA8DE] self-start sm:self-auto flex items-center gap-1.5">
                <FiActivity className="text-[#A351F8]" />
                <span>{bodySnapshot.phase.name} Phase Protocol</span>
              </div>
            )}
          </div>

          <Card className="soft-surface-hero p-6 md:p-8 border-0 relative overflow-hidden space-y-6">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-amber-300 font-display flex items-center gap-2">
                  <FiZap />
                  <span>Coach Biological Guidance</span>
                </span>
                <span className="floating-chip px-3.5 py-1 text-sm font-bold text-amber-300">
                  Pre-Training Protocol
                </span>
              </div>

              <p className="text-base md:text-lg font-normal text-slate-100 leading-relaxed max-w-3xl">
                "{coachMessage}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] relative z-10">
              <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1">
                <span className="text-sm font-semibold uppercase tracking-wider text-amber-300 block font-display">
                  Pre-Workout Carbs Target
                </span>
                <span className="text-3xl md:text-4xl font-bold text-white font-display block">
                  {preCarbs}
                </span>
                <span className="text-sm font-normal text-slate-300 block">Sustained stamina</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1">
                <span className="text-sm font-semibold uppercase tracking-wider text-[#A351F8] block font-display">
                  Pre-Workout Protein Target
                </span>
                <span className="text-3xl md:text-4xl font-bold text-[#2EA8DE] font-display block">
                  {preProtein}
                </span>
                <span className="text-sm font-normal text-slate-300 block">Easily digestible</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1">
                <span className="text-sm font-semibold uppercase tracking-wider text-cyan-300 block font-display">
                  Pre-Hydration Target
                </span>
                <span className="text-3xl md:text-4xl font-bold text-cyan-300 font-display block">
                  {preHydration}
                </span>
                <span className="text-sm font-normal text-slate-300 block">Fluid balance</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RECOMMENDED PRE-WORKOUT MEALS */}
        <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold font-display text-white">
                Recommended <span className="font-serif-title italic text-amber-300">Pre-Workout Meals</span>
              </h3>
              <p className="text-sm text-slate-300 font-normal mt-0.5">
                Light, easily digestible meal options to consume 30–60 minutes before training.
              </p>
            </div>
            <span className="floating-chip px-4 py-1.5 text-sm font-semibold text-amber-300">
              Pre-Training Fuel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preMeals.map((meal, idx) => {
              const title = typeof meal === "object" ? (meal.title || meal.name) : String(meal);
              const text = typeof meal === "object" ? (meal.text || meal.description) : "Low-GI complex carbs for steady energy release.";
              return (
                <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FiSunrise className="text-amber-400 text-sm shrink-0" />
                      <span className="text-sm text-amber-300 uppercase tracking-wider font-semibold block font-display">Pre-Workout Option #{idx + 1}</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white font-display pt-1">{title}</h4>
                    <p className="text-base text-slate-300 font-normal leading-relaxed">{text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI NUTRITION REASONING */}
        <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-4">
            <FiCpu className="text-amber-400 text-xl" />
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold font-display text-white">
                AI Pre-Workout <span className="font-serif-title italic text-amber-300">Reasoning</span>
              </h3>
              <p className="text-sm text-slate-300 font-normal mt-0.5">
                Biological rationale explaining pre-workout fueling targets.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reasoningList.length > 0 ? (
              reasoningList.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2">
                  <span className="text-sm text-amber-300 uppercase tracking-wider font-semibold block font-display">
                    {item.title}
                  </span>
                  <p className="text-base text-slate-200 font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-300 italic py-4">No explicit rationale factors recorded for pre-workout.</p>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // ----------------------------------------------------
  // STATE 3: GENERAL DAILY NUTRITION (NO WORKOUT PLANNED)
  // ----------------------------------------------------
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-light font-display text-white">
              Daily <span className="font-serif-title italic text-pink-300">Nutrition Guidance</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 font-light">
              Rest Day Guidance — Balanced meal distribution and cellular hydration.
            </p>
          </div>
        </div>

        <Card className="soft-surface-hero p-6 md:p-8 border-0 relative overflow-hidden space-y-6">
          <p className="text-sm md:text-base font-light text-slate-100 leading-relaxed max-w-3xl">
            "{coachMessage}"
          </p>
        </Card>
      </div>

      <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
        <h3 className="text-xl font-light font-display text-white mb-4">
          General <span className="font-serif-title italic text-pink-300">Priority Nutrients</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priorityNutrientsList.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2">
              <h4 className="text-sm font-bold text-white font-display">{typeof item === "object" ? item.name : String(item)}</h4>
              <p className="text-xs text-slate-300 font-light">Balanced daily nutrient intake for optimal health.</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
