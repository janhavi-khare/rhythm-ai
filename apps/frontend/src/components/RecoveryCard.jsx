import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import { FiActivity, FiShield } from "react-icons/fi";

export default function RecoveryCard({ fatigue }) {
  const score = fatigue?.score ?? 36;
  const category = fatigue?.category ?? (score > 60 ? "High" : score > 35 ? "Moderate" : "Low");
  const recoveryDemand = fatigue?.recoveryDemand || (score > 60 ? "High Demand" : "Optimal Load");
  const cnsStatus = fatigue?.status || (score < 50 ? "Recovered" : "Adapting");
  const sorenessText = fatigue?.soreness ? `Soreness ${fatigue.soreness}` : "Soreness Low";

  return (
    <Card className="min-h-[260px] flex flex-col justify-between border border-white/[0.05]">
      <div>
        <div className="flex justify-between items-center mb-4">
          <SectionTitle>Fatigue & Load</SectionTitle>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-display">
            {category} Strain
          </span>
        </div>

        <div className="flex items-baseline gap-3 my-3">
          <div className="text-5xl font-extrabold font-display text-purple-300">
            {score}
          </div>
          <span className="text-xs text-slate-400 font-medium">/ 100 System Load</span>
        </div>

        {/* Progress Bar (Point 11) */}
        <div className="w-full h-2 bg-white/10 rounded-full my-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="space-y-2 mt-4 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Systemic Recovery Demand</span>
            <span className="font-bold text-slate-200">{recoveryDemand}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Central Nervous System</span>
            <span className="font-bold text-emerald-400">{cnsStatus}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1"><FiActivity className="text-purple-400" /> {fatigue?.estimatedRecovery || "12-24h Recovery"}</span>
        <span className="flex items-center gap-1"><FiShield className="text-emerald-400" /> {sorenessText}</span>
      </div>
    </Card>
  );
}