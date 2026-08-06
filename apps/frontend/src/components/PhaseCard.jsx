export default function PhaseCard({ phase }) {
  const phaseName =
    typeof phase === "object"
      ? phase?.name || phase?.prediction
      : phase;

  const confidence =
    typeof phase === "object"
      ? phase?.confidence
      : null;

  return (
    <div className="glass-card rounded-2xl p-4 text-white border border-[#A351F8]/20 bg-gradient-to-br from-[#8F37FA]/15 via-[#6163F3]/10 to-transparent">
      <div className="flex items-center justify-between text-xs text-[#2EA8DE] font-semibold mb-1">
        <span>Current Phase</span>
        <span className="w-2 h-2 rounded-full bg-[#A351F8] animate-pulse"></span>
      </div>

      <h3 className="text-xl font-bold font-display text-white mt-0.5">
        {phaseName || "Unknown"}
      </h3>

      <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2 text-xs text-slate-300">
        <span>AI Confidence</span>
        <span className="font-bold text-[#A351F8]">
          {confidence != null
            ? `${Math.round(confidence * 100)}%`
            : "--"}
        </span>
      </div>
    </div>
  );
}