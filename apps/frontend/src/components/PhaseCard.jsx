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
    <div className="glass-card rounded-2xl p-4 text-white border border-pink-500/20 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent">
      <div className="flex items-center justify-between text-xs text-pink-300 font-semibold mb-1">
        <span>Current Phase</span>
        <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
      </div>

      <h3 className="text-xl font-bold font-display text-white mt-0.5">
        {phaseName || "Unknown"}
      </h3>

      <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2 text-[11px] text-slate-400">
        <span>Confidence</span>
        <span className="font-bold text-pink-300">
          {confidence != null
            ? `${Math.round(confidence * 100)}%`
            : "--"}
        </span>
      </div>
    </div>
  );
}