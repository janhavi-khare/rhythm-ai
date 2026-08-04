import React from "react";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-pink-400 font-bold">{Math.round(progress)}%</span>
      </div>

      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_12px_rgba(236,72,153,0.8)] transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;