import Card from "../../ui/Card";
import { FiCpu, FiCheckCircle, FiActivity, FiZap, FiMoon } from "react-icons/fi";

export default function InsightsView() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Purpose & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-light font-display text-white">
            Weekly Insights & <span className="font-serif-title italic text-pink-300">Pattern Discovery</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Purpose: Weekly trends, biological pattern discovery & ML recovery forecasting.
          </p>
        </div>

        <span className="floating-chip px-5 py-2 text-xs font-semibold text-purple-300 self-start sm:self-auto flex items-center gap-2">
          <FiCpu />
          <span>Random Forest ML Regressor</span>
        </span>
      </div>

      {/* 1. WEEKLY INSIGHTS (TRENDS, RECOVERY SUMMARY, ENERGY TRENDS, CONSISTENCY SCORE) */}
      <Card className="soft-surface p-8 border-0 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.05] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-300 font-display">
              7-Day Performance & Trends
            </span>
            <h3 className="text-2xl font-light font-display text-white mt-0.5">
              Weekly <span className="font-serif-title italic text-pink-300">Insights</span>
            </h3>
          </div>
          <span className="floating-chip px-4 py-1.5 text-xs font-bold text-emerald-300">
            94% Consistency Score
          </span>
        </div>

        {/* 4 Summary Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white/[0.03] space-y-1">
            <FiCheckCircle className="text-emerald-400 mx-auto text-base" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Avg Readiness</span>
            <span className="text-xl font-bold text-white font-display">84 / 100</span>
            <span className="text-[10px] text-emerald-400 block font-semibold">↑ +6% vs last week</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] space-y-1">
            <FiActivity className="text-pink-400 mx-auto text-base" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recovery Summary</span>
            <span className="text-xl font-bold text-pink-300 font-display">88% Optimal</span>
            <span className="text-[10px] text-pink-300 block font-semibold">+12% Overnight Surge</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] space-y-1">
            <FiZap className="text-amber-400 mx-auto text-base" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Energy Trends</span>
            <span className="text-xl font-bold text-amber-300 font-display">High Vitality</span>
            <span className="text-[10px] text-amber-300 block font-semibold">Peak in Follicular/Luteal</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] space-y-1">
            <FiMoon className="text-indigo-400 mx-auto text-base" />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Consistency Score</span>
            <span className="text-xl font-bold text-indigo-300 font-display">94%</span>
            <span className="text-[10px] text-indigo-300 block font-semibold">7/7 Days Check-In</span>
          </div>
        </div>

        {/* 3 Sparkline Trend Graphs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Readiness Sparkline */}
          <div className="p-5 rounded-2xl bg-white/[0.03] space-y-3">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>Readiness Trend</span>
              <span className="text-emerald-400">+12%</span>
            </div>
            <div className="flex items-end gap-1.5 h-12 pt-2">
              {[58, 65, 72, 85, 64, 78, 84].map((v, i) => (
                <div key={i} style={{ height: `${v}%` }} className="flex-1 bg-emerald-400/40 rounded-t" />
              ))}
            </div>
          </div>

          {/* Energy Trend */}
          <div className="p-5 rounded-2xl bg-white/[0.03] space-y-3">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>Energy Curve</span>
              <span className="text-amber-300">+18% Peak</span>
            </div>
            <div className="flex items-end gap-1.5 h-12 pt-2">
              {[62, 70, 78, 88, 80, 85, 92].map((v, i) => (
                <div key={i} style={{ height: `${v}%` }} className="flex-1 bg-amber-400/40 rounded-t" />
              ))}
            </div>
          </div>

          {/* Fatigue Load Ratio */}
          <div className="p-5 rounded-2xl bg-white/[0.03] space-y-3">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>Fatigue Load</span>
              <span className="text-purple-300">36/100 Low</span>
            </div>
            <div className="flex items-end gap-1.5 h-12 pt-2">
              {[52, 48, 60, 42, 38, 40, 36].map((v, i) => (
                <div key={i} style={{ height: `${v}%` }} className="flex-1 bg-purple-500/40 rounded-t" />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 2. PERSONALIZED PATTERN DISCOVERY */}
      <Card className="soft-surface-hero p-8 border-0 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-300 font-display">
            Self-Learning Machine Learning Engine
          </span>
          <h3 className="text-2xl font-light font-display text-white mt-0.5">
            Personalized <span className="font-serif-title italic text-pink-300">Pattern Discovery</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            As you check in daily, Rhythm's AI gets smarter by detecting individual biological correlations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
            <span className="text-xs font-bold text-pink-300 uppercase tracking-wider block font-display">Sleep Correlation</span>
            <p className="text-xs text-white font-medium leading-relaxed">
              "You recover <strong className="text-pink-300 font-bold">21% faster</strong> after 8+ hours of sleep."
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block font-display">High-Intensity Load</span>
            <p className="text-xs text-white font-medium leading-relaxed">
              "Your fatigue increases after <strong className="text-purple-300 font-bold">consecutive high-intensity</strong> workouts."
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block font-display">Cycle Sensitivity</span>
            <p className="text-xs text-white font-medium leading-relaxed">
              "Luteal phase increases overall recovery time by <strong className="text-indigo-300 font-bold">1.2 days</strong>."
            </p>
          </div>
        </div>
      </Card>

      {/* 3. RECOVERY FORECAST & SHAP EXPLAINABILITY */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* RECOVERY FORECAST */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-8 h-full border-0 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 font-display">
                  Predictive ML Engine
                </span>
                <h3 className="text-xl font-light font-display text-white mt-0.5">
                  Recovery <span className="font-serif-title italic text-pink-300">Forecast</span>
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-semibold floating-chip px-3 py-1">
                91% Confidence
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Tomorrow's Readiness</span>
                  <h4 className="text-base font-bold text-emerald-400 font-display">88 / 100 (Peak Window)</h4>
                </div>
                <span className="text-xs text-emerald-300 floating-chip px-3 py-1">↑ +4 pts</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Tomorrow's Fatigue</span>
                  <h4 className="text-base font-bold text-purple-300 font-display">22 / 100 (Very Low)</h4>
                </div>
                <span className="text-xs text-purple-300 floating-chip px-3 py-1">↓ -14 pts</span>
              </div>

              {/* 3-Day Timeline */}
              <div className="p-4 rounded-2xl bg-white/[0.03] space-y-2">
                <span className="text-[10px] text-pink-300 uppercase tracking-wider block font-bold">3-Day Recovery Forecast</span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/[0.02]">
                    <span className="text-[10px] text-slate-400 block">Fri (Tomorrow)</span>
                    <span className="font-bold text-emerald-400">88% Ready</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.02]">
                    <span className="text-[10px] text-slate-400 block">Sat</span>
                    <span className="font-bold text-pink-300">92% Peak</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.02]">
                    <span className="text-[10px] text-slate-400 block">Sun</span>
                    <span className="font-bold text-purple-300">80% Active</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* SHAP EXPLAINABILITY */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-8 h-full border-0 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 font-display">
                  Model Explainability
                </span>
                <h3 className="text-xl font-light font-display text-white mt-0.5">
                  SHAP Feature <span className="font-serif-title italic text-pink-300">Importance</span>
                </h3>
              </div>
              <span className="text-xs text-slate-400">TreeExplainer</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Sleep Quality & Duration</span>
                  <span className="text-pink-300">38.4%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Cycle Phase (Luteal)</span>
                  <span className="text-purple-300">26.2%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: "66%" }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Stress & CNS Load</span>
                  <span className="text-indigo-300">18.5%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Hydration Level</span>
                  <span className="text-cyan-300">12.1%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" style={{ width: "30%" }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
