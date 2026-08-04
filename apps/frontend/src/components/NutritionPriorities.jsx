import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";

export default function NutritionPriorities({ nutrients = [], mode }) {
  const topNutrients = nutrients.slice(0, 3);

  return (
    <Card className="min-h-[240px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-5">
          <SectionTitle>
            {mode === "RECOVERY" ? "Recovery Nutrients" : "Priority Nutrients"}
          </SectionTitle>
          <span className="text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-display">
            Targeted
          </span>
        </div>

        <div className="space-y-3.5">
          {topNutrients.length > 0 ? (
            topNutrients.map((item, idx) => {
              const name = typeof item === "object" ? (item.name || item.title) : item;
              const reason = typeof item === "object" ? item.reasoning || item.reason : null;

              return (
                <div
                  key={idx}
                  className="
                    bg-white/[0.05]
                    border border-white/12
                    rounded-2xl
                    px-5
                    py-4
                    flex items-center justify-between
                    transition-all
                    hover:border-purple-400/40
                  "
                >
                  <div>
                    <p className="font-bold text-base md:text-lg capitalize text-slate-100 font-display">
                      {name}
                    </p>
                    {reason && (
                      <p className="text-xs text-slate-400 font-light mt-0.5">
                        {reason}
                      </p>
                    )}
                  </div>
                  <span className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)] shrink-0"></span>
                </div>
              );
            })
          ) : (
            <p className="text-slate-400 text-base">
              No nutrient recommendations available.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}