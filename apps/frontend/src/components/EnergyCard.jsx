import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import { FiZap, FiMoon } from "react-icons/fi";
import { getReadinessLabel } from "../utils/labels";

export default function EnergyCard({ readiness }) {
  const score = readiness?.score ?? 64;
  const category = readiness?.category || getReadinessLabel(score);
  const positiveFactors = readiness?.positiveFactors || ["Sufficient sleep duration", "Low muscle soreness"];

  return (
    <Card className="min-h-[260px] flex flex-col justify-between border border-white/[0.05]">
      <div>
        <div className="flex justify-between items-center mb-4">
          <SectionTitle>Workout Readiness</SectionTitle>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 font-display">
            {category}
          </span>
        </div>

        <div className="flex items-baseline gap-3 my-3">
          <div className="text-5xl font-extrabold font-display text-emerald-400">
            {score}
          </div>
          <span className="text-xs text-slate-400 font-medium">/ 100 Readiness Score</span>
        </div>

        {/* Progress Bar (Point 11) */}
        <div className="w-full h-2 bg-white/10 rounded-full my-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="space-y-2 mt-4 text-xs text-slate-300">
          {positiveFactors.slice(0, 2).map((factor, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>{factor}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1"><FiZap className="text-pink-400" /> {readiness?.intensityTip || "Optimal intensity"}</span>
        <span className="flex items-center gap-1"><FiMoon className="text-indigo-400" /> {readiness?.sleepQuality ? `${readiness.sleepQuality} sleep` : "Restorative sleep"}</span>
      </div>
    </Card>
  );
}