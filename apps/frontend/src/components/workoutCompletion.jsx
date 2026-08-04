import { useState } from "react";

export default function WorkoutCompletionModal({
  open,
  onClose,
  onSubmit,
  busy = false,
}) {
  const [intensity, setIntensity] = useState("Moderate");
  const [duration, setDuration] = useState(60);
  const [rpe, setRpe] = useState(6);
  const [muscleSoreness, setMuscleSoreness] = useState("None");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="glass-panel-glow rounded-[32px] p-8 w-full max-w-md border border-pink-500/30 text-white shadow-[0_0_50px_rgba(236,72,153,0.2)]">
        <h2 className="text-3xl font-extrabold glow-gradient-text">
          Workout Complete 🎉
        </h2>

        <p className="text-slate-300 text-sm mt-2">
          Tell Rhythm how today's training session felt to generate your personalized recovery plan.
        </p>

        <div className="space-y-4 mt-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Intensity Level
            </label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full mt-1.5 bg-white/[0.06] border border-white/15 rounded-2xl p-3 text-white focus:outline-none focus:border-pink-500"
            >
              <option className="bg-[#120824] text-white">Low</option>
              <option className="bg-[#120824] text-white">Moderate</option>
              <option className="bg-[#120824] text-white">High</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full mt-1.5 bg-white/[0.06] border border-white/15 rounded-2xl p-3 text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              RPE Effort (1-10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={rpe}
              onChange={(e) => setRpe(Number(e.target.value))}
              className="w-full mt-1.5 bg-white/[0.06] border border-white/15 rounded-2xl p-3 text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Muscle Soreness
            </label>
            <select
              value={muscleSoreness}
              onChange={(e) => setMuscleSoreness(e.target.value)}
              className="w-full mt-1.5 bg-white/[0.06] border border-white/15 rounded-2xl p-3 text-white focus:outline-none focus:border-pink-500"
            >
              <option className="bg-[#120824] text-white">None</option>
              <option className="bg-[#120824] text-white">Mild</option>
              <option className="bg-[#120824] text-white">Moderate</option>
              <option className="bg-[#120824] text-white">Severe</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={busy}
            className="flex-1 border border-white/20 bg-white/5 rounded-2xl py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSubmit({
                intensity,
                duration,
                rpe,
                muscleSoreness,
              })
            }
            disabled={busy}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl py-3 text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] transition disabled:opacity-50"
          >
            {busy ? "Generating..." : "Generate Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}