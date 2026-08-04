import React from "react";

export default function QuestionCard({ question, value, onChange }) {
  if (question.type === "slider") {
    return (
      <div>
        <input
          type="range"
          min={question.min}
          max={question.max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-pink-500 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
        />

        <div className="flex justify-between text-xs text-slate-400 font-semibold mt-3">
          <span>Low ({question.min})</span>
          <span>High ({question.max})</span>
        </div>

        <div className="text-center mt-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-600/20 border border-pink-500/40 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            <h2 className="text-5xl font-black glow-gradient-text">
              {value}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {question.options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            w-full
            rounded-2xl
            p-4.5
            px-6
            text-left
            font-semibold
            text-sm
            transition-all
            duration-200
            border
            flex items-center justify-between
            ${
              value === option
                ? "bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 border-pink-500/60 text-white shadow-[0_0_20px_rgba(236,72,153,0.25)]"
                : "bg-white/[0.03] border-white/10 text-slate-300 hover:border-pink-500/30 hover:bg-white/[0.06]"
            }
          `}
        >
          <span>{option}</span>
          <span
            className={`w-4 h-4 rounded-full border ${
              value === option
                ? "border-pink-400 bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]"
                : "border-white/20"
            }`}
          ></span>
        </button>
      ))}
    </div>
  );
}