import { useState } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import { FiCpu, FiCheckCircle, FiX } from "react-icons/fi";

export default function InsightCard() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Card className="glass-card border border-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiCpu className="text-emerald-400 text-sm" />
              <SectionTitle>Explainable AI Rationale</SectionTitle>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-display">
              91% Confidence
            </span>
          </div>

          <p className="text-base md:text-lg font-bold font-display text-white leading-snug my-2">
            Your workout readiness increased by +18% because sleep quality reached 8.0 hrs and sleep debt dropped to 0.5 hrs.
          </p>

          <p className="text-xs text-slate-300 leading-relaxed mt-2 font-normal">
            SHAP TreeExplainer feature attributions identified minimal sleep debt (+6.7 pts) and low muscle soreness (+5.2 pts) as your primary performance drivers today.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Model: Random Forest Regressor</span>
          
          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <span>See AI Reasoning</span>
            <span>→</span>
          </button>
        </div>
      </Card>

      {/* AI Reasoning Explainability Modal (Point 15) */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card-hero rounded-3xl p-8 max-w-lg w-full border border-pink-500/30 text-white relative shadow-[0_0_50px_rgba(236,72,153,0.2)]">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <FiX />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <FiCpu className="text-pink-400 text-lg" />
              <h3 className="text-2xl font-bold font-display glow-gradient-text">
                SHAP AI Feature Attribution
              </h3>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Rhythm's ML model calculates your recovery score using SHAP TreeExplainer attributions to ensure 100% explainable recommendations.
            </p>

            <div className="space-y-3 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-display">
                Positive Feature Drivers
              </p>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-200 flex justify-between items-center">
                <span className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Minimal Sleep Debt</span>
                <span className="font-bold text-emerald-400">+6.74 pts</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-200 flex justify-between items-center">
                <span className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Sufficient Sleep Duration</span>
                <span className="font-bold text-emerald-400">+6.60 pts</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-200 flex justify-between items-center">
                <span className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Low Muscle Soreness</span>
                <span className="font-bold text-emerald-400">+5.18 pts</span>
              </div>
            </div>

            <button
              onClick={() => setOpenModal(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xs text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]"
            >
              Close Rationale
            </button>
          </div>
        </div>
      )}
    </>
  );
}