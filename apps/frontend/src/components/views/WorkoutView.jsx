import { useState } from "react";
import Card from "../../ui/Card";
import CircularProgress from "../../ui/CircularProgress";
import { FiZap, FiActivity, FiClock, FiCpu } from "react-icons/fi";
import { getReadinessLabel, getTrainingLoadLabel } from "../../utils/labels";

export default function WorkoutView({ workout, readiness, fatigue }) {
  const score = readiness?.score ?? 84;
  const label = getReadinessLabel(score);
  const [selectedModality, setSelectedModality] = useState("Strength");

  const modalities = [
    { name: "Strength", label: "Strength Hypertrophy", active: true },
    { name: "Cardio", label: "Cardio Zone 2", active: false },
    { name: "Yoga", label: "Mobility & Flow", active: false },
    { name: "Rest", label: "Active Recovery", active: false },
  ];

  const workoutObjective = workout?.workoutObjective || workout?.title || "Upper Body Hypertrophy";
  const trainingLoad = getTrainingLoadLabel(workout?.trainingLoad || workout?.intensity);
  const volumeLabel = typeof workout?.volume === "object" ? workout.volume.label : (workout?.volume || "Moderate");
  const warmupDur = workout?.warmup?.duration ? `${workout.warmup.duration} min` : "8 min";
  const cooldownDur = workout?.cooldown?.duration ? `${workout.cooldown.duration} min` : "5 min";
  const restIntervals = workout?.restIntervals || "90 Seconds";
  const coachSummary = workout?.coachSummary || "Listen to your body and execute today's target session with controlled effort.";
  const rawReasoning = workout?.reasoning || workout?.reasons || [];
  const reasoningList = Array.isArray(rawReasoning) ? rawReasoning : [rawReasoning];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-light font-display text-white">
            Workout & <span className="font-serif-title italic text-pink-300">Session Planner</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Personalized workout objective, volume, and warm-up recommendations tuned for your biological rhythm.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="floating-chip px-4 py-2 text-xs font-semibold text-amber-300 flex items-center gap-1.5">
            <FiZap className="text-amber-400" />
            <span>AI Prescribed Plan</span>
          </span>
        </div>
      </div>

      {/* 1. WORKOUT READINESS HERO */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 lg:col-span-4">
          <Card className="soft-surface-hero p-8 h-full flex flex-col justify-between border-0">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-300 font-display">
                    Readiness Score
                  </span>
                  <h3 className="text-xl font-light font-display text-white mt-0.5">
                    Biological <span className="font-serif-title italic text-pink-300">State</span>
                  </h3>
                </div>
                <span className="floating-chip px-3.5 py-1 text-emerald-300 text-xs font-semibold">
                  {label}
                </span>
              </div>

              <div className="flex items-center justify-center my-4">
                <CircularProgress value={score} color="#D8B4FE" size={140} />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/[0.05] text-center">
                <div className="p-3 rounded-2xl bg-white/[0.03]">
                  <span className="text-[10px] text-slate-400 block uppercase">Volume</span>
                  <span className="text-xs font-bold text-emerald-400 font-display mt-0.5 block">{volumeLabel}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03]">
                  <span className="text-[10px] text-slate-400 block uppercase">Training Load</span>
                  <span className="text-xs font-bold text-purple-300 font-display mt-0.5 block">{trainingLoad}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 2. AI GENERATED WORKOUT PLANNER ROUTINE */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="soft-surface p-8 h-full flex flex-col justify-between border-0 space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-300 font-display flex items-center gap-1.5">
                    <FiCpu className="text-pink-400" />
                    <span>AI Prescribed Objective</span>
                  </span>
                  <h2 className="text-2xl md:text-3xl font-light font-display text-white mt-1">
                    {workoutObjective}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {workout?.duration && (
                    <span className="floating-chip px-3 py-1 text-xs text-slate-200">
                      ⏱ {workout.duration}
                    </span>
                  )}
                  <span className="floating-chip px-3 py-1 text-xs text-pink-300 font-semibold">
                    ⚡ Load: {trainingLoad}
                  </span>
                  <span className="floating-chip px-3 py-1 text-xs text-purple-300 font-semibold">
                    Volume: {volumeLabel}
                  </span>
                </div>
              </div>

              {/* Coach Summary */}
              <div className="my-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 block mb-1 font-display">
                  Coach Guidance:
                </span>
                <p className="text-xs md:text-sm text-slate-200 font-light leading-relaxed">
                  {coachSummary}
                </p>
              </div>

              {/* Structure Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                <div className="p-3 rounded-2xl bg-white/[0.03] text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-display">Warm-up</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{warmupDur}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-display">Cooldown</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{cooldownDur}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-display">Rest Intervals</span>
                  <span className="text-xs font-bold text-pink-300 mt-0.5 block">{restIntervals}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-display">Recovery Focus</span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5 block truncate">
                    {workout?.recoveryFocus?.items?.[0] || workout?.todayRecoveryFocus?.[0] || "Hydration"}
                  </span>
                </div>
              </div>

              {/* Reasoning Section */}
              <div className="mt-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block font-display">
                  AI Prescribed Reasoning:
                </span>

                <ul className="space-y-2 text-xs text-slate-300">
                  {reasoningList.map((reason, idx) => {
                    const text = typeof reason === "object" ? `${reason.type ? `[${reason.type}] ` : ""}${reason.text}` : String(reason);
                    return (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 shrink-0"></span>
                        <span className="leading-relaxed font-light">{text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
