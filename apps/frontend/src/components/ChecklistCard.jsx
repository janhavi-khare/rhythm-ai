import { useState, useEffect } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import { FiCheckSquare, FiSquare } from "react-icons/fi";

export default function ChecklistCard({ mode, checklist: rawChecklist = [] }) {
  const title = mode === "RECOVERY" ? "Recovery Checklist" : "Pre-Workout Checklist";

  // Normalize checklist array if passed as object or array
  const checklistItems = Array.isArray(rawChecklist)
    ? rawChecklist
    : (rawChecklist?.items || []);

  // Persistent completion state by item key
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem(`checklist_${mode}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`checklist_${mode}`, JSON.stringify(completed));
    } catch (e) {
      console.error("Failed to save checklist state:", e);
    }
  }, [completed, mode]);

  const toggleItem = (key, initialCompleted) => {
    setCompleted((prev) => ({
      ...prev,
      [key]: prev[key] !== undefined ? !prev[key] : !initialCompleted,
    }));
  };

  const getItemState = (item, idx) => {
    if (typeof item === "object" && item !== null) {
      const key = item.id || item.label || `item_${idx}`;
      const isChecked = completed[key] !== undefined ? !!completed[key] : !!item.completed;
      return { key, label: item.label, isChecked };
    }
    const key = String(item);
    const isChecked = !!completed[key];
    return { key, label: key, isChecked };
  };

  const normalizedList = checklistItems.map(getItemState);
  const completedCount = normalizedList.filter((item) => item.isChecked).length;

  return (
    <Card className="min-h-[240px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <SectionTitle>{title}</SectionTitle>
          <span className="text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-display shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            {normalizedList.length > 0 ? `${completedCount}/${normalizedList.length} Completed` : "Action Plan"}
          </span>
        </div>

        {normalizedList.length > 0 && (
          <div className="w-full h-2 bg-white/10 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              style={{ width: `${(completedCount / normalizedList.length) * 100}%` }}
            />
          </div>
        )}

        <div className="space-y-3">
          {normalizedList.length > 0 ? (
            normalizedList.map(({ key, label, isChecked }) => {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleItem(key, isChecked)}
                  className={`
                    w-full
                    flex
                    items-start
                    gap-3.5
                    p-4
                    rounded-2xl
                    text-left
                    transition-all
                    duration-200
                    border
                    cursor-pointer
                    ${
                      isChecked
                        ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                        : "bg-white/[0.04] border-white/12 text-slate-100 hover:bg-white/[0.08] hover:border-cyan-500/40"
                    }
                  `}
                >
                  {isChecked ? (
                    <FiCheckSquare className="text-emerald-400 text-xl mt-0.5 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  ) : (
                    <FiSquare className="text-slate-400 text-xl mt-0.5 shrink-0 group-hover:text-cyan-400" />
                  )}
                  <span
                    className={`text-sm md:text-base leading-relaxed font-semibold transition-all ${
                      isChecked ? "line-through opacity-70 text-slate-400" : ""
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })
          ) : (
            <p className="text-slate-400 text-base">
              Checklist will appear after AI recommendation.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}