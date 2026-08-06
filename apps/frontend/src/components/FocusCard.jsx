import Card from "../ui/Card";
import { getTrainingLoadLabel } from "../utils/labels";

export default function FocusCard({
  mode,
  gamePlan,
  nutrition,
  recovery,
  workout,
}) {
  const isRecovery = mode === "RECOVERY";
  const nutrients = nutrition?.priorityNutrients || workout?.todayRecoveryFocus;
  const macros = nutrition?.macros;
  const hydration = nutrition?.hydration;

  const objective = workout?.workoutObjective || workout?.title || workout?.workoutType;
  const loadLabel = getTrainingLoadLabel(workout?.trainingLoad || workout?.intensity);
  const coachSummary = workout?.coachSummary || gamePlan?.message;

  return (
    <Card className="soft-surface relative overflow-hidden flex flex-col justify-between border-0 p-8 lg:p-10">
      {/* Ambient Blurred Background Light Gradient (Point 2) */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/15 via-purple-600/15 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

      <div>
        {/* Header Title & Workout Session Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="floating-chip px-4 py-1.5 text-xs font-semibold text-pink-300">
            {objective}
          </span>

          {(workout?.workoutType || workout?.trainingLoad || loadLabel) && (
            <span className="floating-chip px-4 py-1.5 text-xs font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Load: <strong className="text-white">{loadLabel}</strong></span>
              {workout?.duration != null && <span className="text-slate-400">• {workout.duration}</span>}
              {workout?.intensity && <span className="text-pink-300">• {workout.intensity}</span>}
            </span>
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-light font-display text-white tracking-tight">
          {objective}
        </h2>

        {/* Conversational AI Coach Summary */}
        <p className="text-slate-200 mt-3 text-base md:text-lg leading-relaxed font-light max-w-3xl">
          {coachSummary}
        </p>

        {/* Minimalist Visual Chips (Point 8 & 11) */}
        <div className="flex flex-wrap gap-3 my-6">
          <div className="floating-chip px-5 py-3 flex items-center gap-2.5">
            <span className="text-lg">⚡</span>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Calories</span>
              <span className="text-sm font-bold font-display text-white">{macros.calories} kcal</span>
            </div>
          </div>

          <div className="floating-chip px-5 py-3 flex items-center gap-2.5">
            <span className="text-lg">🍗</span>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Protein</span>
              <span className="text-sm font-bold font-display text-white">{macros.protein}g</span>
            </div>
          </div>

          <div className="floating-chip px-5 py-3 flex items-center gap-2.5">
            <span className="text-lg">🌾</span>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Carbs</span>
              <span className="text-sm font-bold font-display text-white">{macros.carbs}g</span>
            </div>
          </div>

          <div className="floating-chip px-5 py-3 flex items-center gap-2.5">
            <span className="text-lg">💧</span>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Water</span>
              <span className="text-sm font-bold font-display text-white">{hydration}</span>
            </div>
          </div>
        </div>

        {/* Floating Nutrient Pills (Point 3: Floating Chips instead of Rectangles) */}
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-3">Priority Floating Nutrients</span>
          <div className="flex flex-wrap gap-3">
            {nutrients.map((item) => (
              <div key={item} className="floating-chip px-5 py-2.5 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]"></span>
                <span className="text-sm font-bold font-display text-white capitalize">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}