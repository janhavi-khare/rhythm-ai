import Card from "../ui/Card";
import CircularProgress from "../ui/CircularProgress";
import { FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import { getReadinessLabel } from "../utils/labels";

export default function RhythmScoreCard({ score }) {
  const numScore = typeof score === "number" ? score : 64;
  const label = getReadinessLabel(numScore);

  return (
    <Card className="soft-surface-hero relative overflow-hidden flex flex-col justify-between border-0 p-8 lg:p-10">
      {/* Huge Ambient Light Glow behind Score (Point 2) */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-light font-display text-white tracking-tight">
              Rhythm <span className="font-serif-title italic font-normal text-pink-300">Score</span>
            </h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">Biological State Index</p>
          </div>

          <span className="floating-chip px-4 py-1.5 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <FiCheckCircle className="text-sm text-emerald-400" />
            {label}
          </span>
        </div>

        {/* Circular Progress & Big Hero Number */}
        <div className="flex flex-col sm:flex-row items-center justify-around my-6 gap-6">
          <div className="relative flex items-center justify-center">
            <CircularProgress
              value={numScore}
              color="#D8B4FE"
              size={170}
            />
          </div>

          {/* Quick Metrics */}
          <div className="flex-1 space-y-2.5 w-full">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
              <span className="text-xs text-slate-300 font-light">Energy & Vitality</span>
              <span className="font-bold text-pink-300 text-sm font-display">+18%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
              <span className="text-xs text-slate-300 font-light">Overnight Recovery</span>
              <span className="font-bold text-purple-300 text-sm font-display">+22%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
              <span className="text-xs text-slate-300 font-light">Sleep Score</span>
              <span className="font-bold text-indigo-300 text-sm font-display">+20%</span>
            </div>
          </div>
        </div>

        {/* Weekly Trend Sparkline */}
        <div className="mt-6 p-4.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex justify-between items-center text-xs text-slate-400 font-light mb-3">
            <span>7-Day Biological Trend</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <FiTrendingUp /> +12% vs last week
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-16 pt-2">
            {[
              { day: "M", val: 58 },
              { day: "T", val: 72 },
              { day: "W", val: 85 },
              { day: "T", val: 64 },
              { day: "F", val: 78 },
              { day: "S", val: 82 },
              { day: "S", val: numScore, active: true },
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">{d.val}</span>
                <div
                  style={{ height: `${d.val}%` }}
                  className={`w-full rounded-t-lg transition-all ${
                    d.active
                      ? "bg-gradient-to-t from-pink-500 to-purple-500 shadow-[0_0_12px_rgba(236,72,153,0.5)]"
                      : "bg-white/10 group-hover:bg-purple-500/40"
                  }`}
                />
                <span className={`text-[11px] font-semibold ${d.active ? "text-pink-300" : "text-slate-500"}`}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}