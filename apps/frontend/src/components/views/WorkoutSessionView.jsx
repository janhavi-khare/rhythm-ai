import Card from "../../ui/Card";
import {
  FiClock,
  FiZap,
  FiArrowLeft,
  FiCheckCircle,
  FiList,
  FiCpu,
  FiActivity
} from "react-icons/fi";
import { getTrainingLoadLabel } from "../../utils/labels";

export default function WorkoutSessionView({ workout, onComplete, onBack }) {
  if (!workout) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-slate-400 space-y-4">
        <p className="text-sm">No active workout session found for today.</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-2xl bg-white/[0.06] text-white text-xs font-semibold hover:bg-white/[0.1] transition"
          >
            Return to Dashboard
          </button>
        )}
      </div>
    );
  }

  // Extract workout properties from existing todayPlan.workout object without hardcoding
  const title = workout.workoutObjective || workout.title || workout.displayTitle || workout.focus || workout.workoutType || "Today's Workout Session";
  const duration = typeof workout.duration === "number" ? `${workout.duration} min` : (workout.duration || "N/A");
  const intensity = workout.intensity || "Moderate";
  const loadLabel = getTrainingLoadLabel(workout.trainingLoad || intensity);
  const coachSummary = workout.coachSummary;

  // Session ID Validation
  const sessionId = workout?.id || workout?._id || workout?.sessionId || workout?.workoutSessionId;
  const isSessionValid = Boolean(sessionId && String(sessionId).trim() !== "" && String(sessionId) !== "undefined" && String(sessionId) !== "null");

  // Handle reasoning array or string
  const rawReasoning = workout.reasoning || workout.reasons;
  const reasoningList = Array.isArray(rawReasoning)
    ? rawReasoning
    : typeof rawReasoning === "string" && rawReasoning.trim().length > 0
    ? [rawReasoning]
    : [];

  // Handle exercise list from workout engine safely with array fallback
  const rawExercises = workout.exercises || workout.exerciseList || workout.exercisesList;
  const exercises = Array.isArray(rawExercises) ? rawExercises : [];
  const hasExercises = exercises.length > 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-semibold text-pink-300 hover:text-pink-200 transition mb-1"
            >
              <FiArrowLeft className="text-sm" />
              <span>Back to Dashboard</span>
            </button>
          )}
          <h1 className="text-3xl md:text-4xl font-light font-display text-white">
            Workout <span className="font-serif-title italic text-pink-300">Session</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Follow your personalized daily workout recommendation tuned for your rhythm.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="floating-chip px-3.5 py-1.5 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Session In Progress</span>
          </span>
        </div>
      </div>

      {/* WORKOUT TITLE, DURATION & INTENSITY CARD */}
      <Card className="soft-surface-hero p-6 md:p-8 border-0 relative overflow-hidden space-y-6">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-bl from-pink-500/15 to-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="floating-chip px-3 py-1 text-[11px] font-bold text-pink-300 font-display uppercase tracking-wider flex items-center gap-1.5">
              <FiCpu className="text-pink-400 text-xs" />
              <span>AI Prescribed Plan</span>
            </span>
            {workout.badge && (
              <span className="floating-chip px-3 py-1 text-[11px] font-semibold text-slate-200">
                {workout.badge}
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-4xl font-light font-display text-white">
            {title}
          </h2>

          {coachSummary && (
            <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed">
              {coachSummary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="floating-chip px-4 py-2 text-xs font-semibold text-slate-200 flex items-center gap-2">
              <FiClock className="text-pink-400 text-sm" />
              <span>Duration: <strong className="text-white">{duration}</strong></span>
            </div>

            <div className="floating-chip px-4 py-2 text-xs font-semibold text-pink-300 flex items-center gap-2">
              <FiZap className="text-amber-400 text-sm" />
              <span>Training Load: <strong className="text-pink-200">{loadLabel}</strong></span>
            </div>
            {intensity && (
              <div className="floating-chip px-4 py-2 text-xs font-semibold text-purple-300 flex items-center gap-2">
                <span>Intensity: <strong>{intensity}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* REASONING BULLET LIST */}
        <div className="pt-6 border-t border-white/[0.06] space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <FiActivity className="text-pink-400 text-sm" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
              Why This Workout (AI Reasoning)
            </h3>
          </div>

          {reasoningList.length > 0 ? (
            <div className="space-y-2">
              {reasoningList.map((reason, idx) => {
                const text = typeof reason === "object" ? (reason.text || reason.description) : String(reason);
                const tag = typeof reason === "object" ? reason.type : null;
                return (
                  <div key={idx} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.04] text-xs text-slate-300 flex items-start gap-2.5">
                    {tag && (
                      <span className="floating-chip px-2 py-0.5 text-[10px] font-bold text-pink-300 shrink-0">
                        {tag}
                      </span>
                    )}
                    <span className="leading-relaxed">{text}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No specific reasoning provided for today's workout session.
            </p>
          )}
        </div>
      </Card>

      {/* EXERCISES OR TARGET PARAMETERS */}
      <Card className="soft-surface p-6 border-0 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
          <div className="flex items-center gap-2 text-white">
            <FiList className="text-pink-400 text-lg" />
            <h3 className="text-base font-semibold font-display">
              {exercises.length > 0 ? "Target Exercises" : "Session Parameters"}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {exercises.length > 0 ? `${exercises.length} Exercises` : "Parameters Active"}
          </span>
        </div>

        {hasExercises ? (
          <div className="space-y-3 pt-2">
            {exercises.map((ex, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold flex items-center justify-center font-display shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">{ex.name || ex.title}</h4>
                    {ex.notes && <p className="text-xs text-slate-400 mt-0.5">{ex.notes}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {ex.sets && (
                    <span className="floating-chip px-3 py-1 text-xs font-bold text-slate-200">
                      {ex.sets}
                    </span>
                  )}
                  {ex.reps && (
                    <span className="floating-chip px-3 py-1 text-xs font-bold text-pink-300">
                      {ex.reps}
                    </span>
                  )}
                  {ex.rpe && (
                    <span className="floating-chip px-3 py-1 text-[11px] font-bold text-purple-300">
                      {ex.rpe}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 px-6 rounded-3xl bg-white/[0.02] border border-white/[0.04] text-center space-y-2 my-2">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-pink-400">
              <FiZap className="text-lg" />
            </div>
            <h4 className="text-sm font-semibold text-white font-display">
              Session Target Guidelines
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Your session parameters (Duration: {duration}, Load: {loadLabel}) have been generated based on your biological snapshot. Execute with controlled technique.
            </p>
          </div>
        )}
      </Card>

      {/* SINGLE COMPLETE WORKOUT BUTTON AT BOTTOM */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={onComplete}
          disabled={Boolean(workout?.completed)}
          className={`w-full sm:w-auto px-12 py-4 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2.5 ${
            workout?.completed
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default shadow-none"
              : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-[0_0_25px_rgba(236,72,153,0.4)] active:scale-95 cursor-pointer"
          }`}
        >
          <FiCheckCircle className="text-lg" />
          <span>{workout?.completed ? "Workout Complete" : "Complete Workout"}</span>
        </button>
      </div>
    </div>
  );
}
