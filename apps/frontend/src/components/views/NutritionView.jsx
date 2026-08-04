import Card from "../../ui/Card";
import PredictionCard from "../PredictionCard";
import { FiSend, FiHeart } from "react-icons/fi";

export default function NutritionView({ nutrition, foods: propFoods, mode }) {
  const macros = nutrition?.macros || { calories: 378, protein: 19, carbs: 53, fats: 9, fiber: 8 };
  const hydration = nutrition?.hydration || "980 mL";
  const priorityNutrients = nutrition?.priorityNutrients || ["Protein", "Carbohydrates", "Hydration"];
  const foods = nutrition?.recommendedFoods || nutrition?.foods || propFoods || [];
  const coachMessage = nutrition?.coachMessage || nutrition?.tip || "Fuel your body with nutrient-dense foods aligned with today's activity level.";
  const mealSuggestions = nutrition?.mealSuggestions || [
    { type: "Breakfast", title: "Overnight Oats + Almond Butter & Berries", text: "Low glycemic index for sustained morning energy", calories: 320, protein: 14 },
    { type: "Lunch", title: "Grilled Chicken Bowl & Quinoa", text: "Leucine-rich for muscle synthesis", calories: 480, protein: 42 },
    { type: "Dinner", title: "Baked Salmon & Roasted Sweet Potato", text: "Omega-3 anti-inflammatory profile", calories: 420, protein: 35 },
    { type: "Snacks", title: "Greek Yogurt + Honey & Walnuts", text: "Probiotics for gut health and casein", calories: 180, protein: 18 }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Purpose & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-light font-display text-white">
            Nutrition & <span className="font-serif-title italic text-pink-300">Food Matching</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Purpose: Personalized food recommendations & phase-specific fuel protocols.
          </p>
        </div>

        <div className="floating-chip px-5 py-2 text-xs font-semibold text-emerald-300 self-start sm:self-auto flex items-center gap-2">
          <FiHeart className="text-emerald-400" />
          <span>Nutrition Score: 92/100 (Optimal Match)</span>
        </div>
      </div>

      {/* Coach Guidance Banner if available */}
      {coachMessage && (
        <Card className="soft-surface p-6 border-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 block mb-1 font-display">
            AI Nutrition Guidance:
          </span>
          <p className="text-xs md:text-sm text-slate-200 font-light leading-relaxed">
            {coachMessage}
          </p>
        </Card>
      )}

      {/* 6 Key Biological Metrics (Calories, Protein, Carbs, Fat, Fiber, Hydration) */}
      <Card className="soft-surface p-8 border-0 space-y-4">
        <h3 className="text-xl font-light font-display text-white mb-4">
          Daily Targets & <span className="font-serif-title italic text-pink-300">Macro Progress</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Calories */}
          <div className="p-4 rounded-2xl bg-white/[0.03] space-y-2 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Calories</span>
            <span className="text-base font-bold font-display text-white">{macros.calories} kcal</span>
            <span className="text-[10px] text-slate-400 block">/ 2,100 Target</span>
          </div>

          {/* Protein */}
          <div className="p-4 rounded-2xl bg-white/[0.03] space-y-2 text-center">
            <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider block">Protein</span>
            <span className="text-base font-bold font-display text-pink-300">{macros.protein}g</span>
            <span className="text-[10px] text-slate-400 block">/ 120g Target</span>
          </div>

          {/* Carbs */}
          <div className="p-4 rounded-2xl bg-white/[0.03] space-y-2 text-center">
            <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">Carbs</span>
            <span className="text-base font-bold font-display text-purple-300">{macros.carbs}g</span>
            <span className="text-[10px] text-slate-400 block">/ 220g Target</span>
          </div>

          {/* Fat */}
          <div className="p-4 rounded-2xl bg-white/[0.03] space-y-2 text-center">
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Fat</span>
            <span className="text-base font-bold font-display text-indigo-300">{macros.fats}g</span>
            <span className="text-[10px] text-slate-400 block">/ 65g Target</span>
          </div>

          {/* Fiber */}
          <div className="p-4 rounded-2xl bg-white/[0.03] space-y-2 text-center">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Fiber</span>
            <span className="text-base font-bold font-display text-emerald-300">{macros.fiber || 8}g</span>
            <span className="text-[10px] text-slate-400 block">/ 28g Target</span>
          </div>

          {/* Hydration */}
          <div className="p-4 rounded-2xl bg-white/[0.03] space-y-2 text-center">
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">Hydration</span>
            <span className="text-base font-bold font-display text-cyan-300">{hydration}</span>
            <span className="text-[10px] text-slate-400 block">/ 2,500 mL Target</span>
          </div>
        </div>
      </Card>

      {/* Meal Plan Breakdown (Breakfast, Lunch, Dinner, Snacks) */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* Meal Plan */}
        <div className="col-span-12 lg:col-span-7">
          <Card className="soft-surface p-8 h-full border-0 space-y-4">
            <h3 className="text-xl font-light font-display text-white mb-2">
              Personalized <span className="font-serif-title italic text-pink-300">Meal Plan</span>
            </h3>

            <div className="space-y-3">
              {mealSuggestions.map((meal, idx) => {
                const title = meal.title || meal.name || meal;
                const type = meal.type || `Meal ${idx + 1}`;
                const text = meal.text || meal.description || "";
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-pink-300 uppercase tracking-wider block font-bold">{type}</span>
                      <h4 className="text-sm font-bold text-white font-display">{title}</h4>
                      {text && <span className="text-[11px] text-slate-400">{text}</span>}
                    </div>
                    {meal.calories && (
                      <div className="text-right">
                        <span className="text-xs font-bold text-white block">{meal.calories} kcal</span>
                        {meal.protein && <span className="text-[10px] text-pink-300 font-semibold">{meal.protein}g Protein</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* AI Ranked Best Match Foods */}
        <div className="col-span-12 lg:col-span-5">
          <PredictionCard foods={foods} mode={mode} />
        </div>
      </div>

      {/* Nutrition AI Assistant */}
      <Card className="soft-surface p-8 border-0 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-light font-display text-white mb-2">
            Nutrition <span className="font-serif-title italic text-pink-300">AI Assistant</span>
          </h3>
          <p className="text-xs text-slate-400">
            Ask Nutrition AI for custom dietary swaps, vegetarian recipes, or macro adjustments.
          </p>

          <div className="flex flex-wrap gap-2 my-4">
            <button className="floating-chip px-3.5 py-1.5 text-xs text-slate-300 hover:text-white">
              "Suggest vegetarian high-protein meals"
            </button>
            <button className="floating-chip px-3.5 py-1.5 text-xs text-slate-300 hover:text-white">
              "Swap chicken for plant protein"
            </button>
          </div>
        </div>

        <div className="relative mt-2">
          <input
            type="text"
            placeholder="Ask Nutrition AI..."
            className="w-full p-4 pr-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button className="absolute right-3 top-3 w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs">
            <FiSend />
          </button>
        </div>
      </Card>
    </div>
  );
}
