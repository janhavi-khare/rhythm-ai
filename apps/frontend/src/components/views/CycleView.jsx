import Card from "../../ui/Card";
import PhaseCard from "../PhaseCard";
import { FiCalendar, FiActivity, FiSmile, FiShield, FiHeart, FiCpu, FiClock } from "react-icons/fi";

export default function CycleView({ phase }) {
  const phaseName = typeof phase === "object" ? phase?.prediction : phase || "Luteal Phase";
  const confidence = typeof phase === "object" ? phase?.confidence : 0.85;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Purpose & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-light font-display text-white">
            Cycle Intelligence & <span className="font-serif-title italic text-pink-300">Biology</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Purpose: Biological intelligence, phase timeline & hormonal training optimization.
          </p>
        </div>

        <span className="floating-chip px-5 py-2 text-xs font-semibold text-purple-300 self-start sm:self-auto flex items-center gap-2">
          <FiCalendar />
          <span>Day 22 of 28 • 6 Days Remaining</span>
        </span>
      </div>

      {/* 1. CURRENT PHASE HERO */}
      <Card className="soft-surface-hero p-8 border-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse shadow-[0_0_10px_rgba(244,114,182,0.8)]"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-300 font-display">
                Current Active Phase
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light font-display text-white">
              {phaseName}
            </h2>
            <p className="text-xs text-slate-300">
              6 Days Remaining in Phase • Progesterone Peak Window
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="p-4 rounded-2xl bg-white/[0.04] text-center border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">AI Confidence</span>
              <span className="text-lg font-bold text-pink-300 font-display mt-0.5 block">
                {Math.round(confidence * 100)}%
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.04] text-center border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Next Phase</span>
              <span className="text-lg font-bold text-purple-300 font-display mt-0.5 block">
                Menstrual
              </span>
            </div>
          </div>
        </div>

        {/* 2. PHASE TIMELINE NODES */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/[0.05]">
          {[
            { phase: "Menstrual", days: "Days 1–5", active: false },
            { phase: "Follicular", days: "Days 6–13", active: false },
            { phase: "Ovulation", days: "Days 14–16", active: false },
            { phase: "Luteal", days: "Days 17–28", active: true },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl transition-all ${
                item.active
                  ? "bg-white/[0.08] border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                  : "bg-white/[0.03] border border-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.active ? "bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]" : "bg-white/20"}`} />
                <span className="text-[10px] text-slate-400 font-medium">{item.days}</span>
              </div>
              <h4 className={`text-sm font-bold font-display ${item.active ? "text-white" : "text-slate-400"}`}>
                {item.phase}
              </h4>
              {item.active && <span className="text-[10px] text-pink-300 font-semibold block mt-0.5">● Active Phase</span>}
            </div>
          ))}
        </div>
      </Card>

      {/* 3. TODAY'S BIOLOGY & 4. UPCOMING CHANGES GRID */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* 3. TODAY'S BIOLOGY */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-8 h-full border-0 space-y-4">
            <h3 className="text-xl font-light font-display text-white mb-2">
              Today's <span className="font-serif-title italic text-pink-300">Biology</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Energy</span>
                <span className="font-bold text-emerald-400">Steady & Moderate (78/100)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Hormones</span>
                <span className="font-bold text-purple-300">Progesterone Peak • Estrogen Dip</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Mood</span>
                <span className="font-bold text-white">Calm & Focused Mindset</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Recovery Needs</span>
                <span className="font-bold text-pink-300">High Protein Demand (+18g)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Cravings</span>
                <span className="font-bold text-indigo-300">Mild Carb & Magnesium Cravings</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 4. UPCOMING CHANGES & FORECAST */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-8 h-full border-0 space-y-4">
            <h3 className="text-xl font-light font-display text-white mb-2">
              Upcoming <span className="font-serif-title italic text-pink-300">Changes & Forecast</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Expected Symptoms</span>
                <span className="font-bold text-amber-300">Mild lower back tightness</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Expected Energy</span>
                <span className="font-bold text-slate-200">Gradual dip 2 days before cycle</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Predicted Mood</span>
                <span className="font-bold text-purple-300">Restorative & Introspective</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Recovery Changes</span>
                <span className="font-bold text-pink-300">Extended recovery window (+12 hrs)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 5. RECOMMENDATIONS & 6. CYCLE HISTORY GRID */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* 5. RECOMMENDATIONS */}
        <div className="col-span-12 lg:col-span-7">
          <Card className="soft-surface p-8 h-full border-0 space-y-4">
            <h3 className="text-xl font-light font-display text-white mb-2">
              Phase-Specific <span className="font-serif-title italic text-pink-300">Recommendations</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.03] space-y-1">
                <span className="text-[10px] text-pink-300 font-bold uppercase block">Workout</span>
                <p className="text-slate-200 font-semibold">Upper Body Strength & Moderate Zone 2</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] space-y-1">
                <span className="text-[10px] text-purple-300 font-bold uppercase block">Nutrition</span>
                <p className="text-slate-200 font-semibold">High Leucine Protein (19g) + Magnesium</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] space-y-1">
                <span className="text-[10px] text-indigo-300 font-bold uppercase block">Sleep</span>
                <p className="text-slate-200 font-semibold">8.0+ Hours Parasympathetic Sleep Target</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] space-y-1">
                <span className="text-[10px] text-emerald-300 font-bold uppercase block">Stress</span>
                <p className="text-slate-200 font-semibold">Diaphragmatic Breathwork & Meditation</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 6. CYCLE HISTORY */}
        <div className="col-span-12 lg:col-span-5">
          <Card className="soft-surface p-8 h-full border-0 space-y-4">
            <h3 className="text-xl font-light font-display text-white mb-2">
              Cycle <span className="font-serif-title italic text-pink-300">History & Stats</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/[0.05]">
                <span className="text-slate-400">Past Cycles Tracked</span>
                <span className="font-bold text-white font-display">6 Cycles</span>
              </div>

              <div className="flex justify-between py-2 border-b border-white/[0.05]">
                <span className="text-slate-400">Average Cycle Length</span>
                <span className="font-bold text-pink-300 font-display">28.2 Days</span>
              </div>

              <div className="flex justify-between py-2 border-b border-white/[0.05]">
                <span className="text-slate-400">Cycle Regularity</span>
                <span className="font-bold text-emerald-400 font-display">96% High Regularity</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-slate-400">Next Menstrual Phase</span>
                <span className="font-bold text-purple-300 font-display">Starts in 6 Days</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
