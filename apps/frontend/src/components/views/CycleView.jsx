import Card from "../../ui/Card";
import {
  FiCalendar,
  FiActivity,
  FiZap,
  FiHeart,
  FiCpu,
  FiCheckCircle,
  FiArrowRight,
  FiTarget,
  FiMoon
} from "react-icons/fi";

// Calculate Cycle Day dynamically from lastPeriodDate & cycleLength
function calculateCycleDay(lastPeriodDate, cycleLength = 30) {
  if (!lastPeriodDate) return 12;
  const start = new Date(lastPeriodDate);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return (diffDays % cycleLength) + 1;
}

// Generate phase boundaries dynamically from user's custom cycleLength
function getDynamicPhases(cycleLength = 30) {
  const cl = Number(cycleLength) || 30;
  const mEnd = Math.max(4, Math.round(cl * 0.18));
  const fEnd = Math.max(mEnd + 3, Math.round(cl * 0.46));
  const oEnd = Math.max(fEnd + 2, Math.round(cl * 0.57));
  const elEnd = Math.max(oEnd + 4, Math.round(cl * 0.78));

  return [
    { key: "menstrual", name: "Menstrual", start: 1, end: mEnd, label: `Days 1–${mEnd}` },
    { key: "follicular", name: "Follicular", start: mEnd + 1, end: fEnd, label: `Days ${mEnd + 1}–${fEnd}` },
    { key: "ovulation", name: "Ovulation", start: fEnd + 1, end: oEnd, label: `Days ${fEnd + 1}–${oEnd}` },
    { key: "early_luteal", name: "Early Luteal", start: oEnd + 1, end: elEnd, label: `Days ${oEnd + 1}–${elEnd}` },
    { key: "late_luteal", name: "Late Luteal", start: elEnd + 1, end: cl, label: `Days ${elEnd + 1}–${cl}` },
  ];
}

// Map phase info and concise 3-4 line coach insights
function getPhaseMetaData(rawPhaseName, cycleDay = 12, cycleLength = 30) {
  const p = String(rawPhaseName || "").toLowerCase();
  const phases = getDynamicPhases(cycleLength);

  let currentPhase = phases[1]; // default follicular
  if (p.includes("follicular")) currentPhase = phases[1];
  else if (p.includes("ovulat")) currentPhase = phases[2];
  else if (p.includes("late luteal") || (p.includes("luteal") && cycleDay > phases[3].end)) currentPhase = phases[4];
  else if (p.includes("luteal") || p.includes("early luteal")) currentPhase = phases[3];
  else if (p.includes("menstru")) currentPhase = phases[0];

  // Calculate days remaining in current phase
  const daysUntilNext = Math.max(1, currentPhase.end - cycleDay + 1);
  const currentIdx = phases.findIndex((ph) => ph.key === currentPhase.key);
  const nextPhase = phases[(currentIdx + 1) % phases.length];

  if (currentPhase.key === "follicular") {
    return {
      key: "follicular",
      name: "Follicular Phase",
      subtitle: "Energy Rising & Estrogen Surge",
      daysUntilNext,
      nextPhaseName: nextPhase.name,
      coachInsight: "Rising estrogen during the Follicular phase increases insulin sensitivity and muscle force production. This is your optimal window for high-volume strength training and progressive overload.",
      expectations: {
        energy: "High stamina and rapid physical activation",
        mood: "Focused, ambitious, and motivated",
        recovery: "Rapid cellular repair and minimal soreness",
        performance: "Peak power output and strength capacity",
        cravings: "Stable appetite with efficient carb utilization",
        sleep: "Deep slow-wave sleep with fast sleep onset"
      }
    };
  }

  if (currentPhase.key === "ovulation") {
    return {
      key: "ovulation",
      name: "Ovulatory Phase",
      subtitle: "Peak Neuromuscular Power",
      daysUntilNext,
      nextPhaseName: nextPhase.name,
      coachInsight: "Estrogen reaches its monthly peak during Ovulation, boosting neuromuscular drive and max force output. Ensure thorough warmups as joint laxity increases slightly during this 48-hour peak window.",
      expectations: {
        energy: "Peak physiological energy and high drive",
        mood: "Confident, outgoing, and social",
        recovery: "Fast muscle repair with high protein synthesis",
        performance: "Maximum personal record (PR) capacity",
        cravings: "Mild craving suppression from peak estrogen",
        sleep: "High energy may slightly delay sleep onset"
      }
    };
  }

  if (currentPhase.key === "late_luteal") {
    return {
      key: "late_luteal",
      name: "Late Luteal Phase",
      subtitle: "Restorative Transition & Deload",
      daysUntilNext,
      nextPhaseName: nextPhase.name,
      coachInsight: "As both estrogen and progesterone drop prior to menstruation, core temperature shifts and recovery slows. Prioritize magnesium-rich foods, 8+ hours of parasympathetic rest, and active mobility.",
      expectations: {
        energy: "Fluctuating energy; benefits from lower volume",
        mood: "Introspective and sensitive to stress",
        recovery: "Extended recovery window needed after load",
        performance: "Best suited for mobility and light technique",
        cravings: "Increased appetite for complex carbohydrates",
        sleep: "Prioritize 8+ hours of parasympathetic rest"
      }
    };
  }

  if (currentPhase.key === "early_luteal") {
    return {
      key: "early_luteal",
      name: "Early Luteal Phase",
      subtitle: "Progesterone Surge & Steady Endurance",
      daysUntilNext,
      nextPhaseName: nextPhase.name,
      coachInsight: "Progesterone rises significantly after ovulation, elevating core temperature and metabolic rate. Focus on steady-state endurance, hydration with electrolytes, and leucine-rich recovery protein.",
      expectations: {
        energy: "Sustained moderate endurance without sharp spikes",
        mood: "Calm, steady, and detail-oriented",
        recovery: "Requires higher protein intake for muscle maintenance",
        performance: "Strong steady-state aerobic performance",
        cravings: "Increased protein and complex carbohydrate demand",
        sleep: "Progesterone promotes natural drowsiness"
      }
    };
  }

  // Menstrual Phase
  return {
    key: "menstrual",
    name: "Menstrual Phase",
    subtitle: "Rest & Cellular Regeneration",
    daysUntilNext,
    nextPhaseName: nextPhase.name,
    coachInsight: "Hormones are at their lowest baseline during the Menstrual phase. Honor rest, focus on iron-rich nutrition, and gentle dynamic mobility to support natural physiological regeneration.",
    expectations: {
      energy: "Lower baseline; best supported by gentle walking",
      mood: "Reflective and seeking restorative downtime",
      recovery: "Focus on anti-inflammatory nutrients & hydration",
      performance: "Light mobility, stretching, and low-RPE movement",
      cravings: "Iron-rich foods, dark chocolate, and warm meals",
      sleep: "High sleep need for uterine and systemic recovery"
    }
  };
}

export default function CycleView({ todayPlan, phase: propPhase, user, predictions, setActiveTab }) {
  const phaseObj = todayPlan?.bodySnapshot?.phase || propPhase;
  const rawPhaseName = typeof phaseObj === "object" ? (phaseObj?.name || phaseObj?.prediction) : String(phaseObj || "");
  const confidence = typeof phaseObj === "object" ? (phaseObj?.confidence || 0.95) : 0.95;

  // Use dynamic user cycleLength from backend (no hardcoded values)
  const cycleLength = Number(todayPlan?.cycleLength || user?.cycleLength || 30);
  const cycleDay = Number(todayPlan?.cycleDay || calculateCycleDay(user?.lastPeriodDate, cycleLength));
  const meta = getPhaseMetaData(rawPhaseName, cycleDay, cycleLength);

  // Read dynamic backend phaseTimeline if available, otherwise compute dynamically for user.cycleLength
  const timelinePhases = todayPlan?.phaseTimeline || getDynamicPhases(cycleLength);
  const nextPhaseName = todayPlan?.nextPhase?.name || meta.nextPhaseName;
  const daysUntilNext = todayPlan?.nextPhase?.daysUntil ?? meta.daysUntilNext;

  // EMPTY STATE
  if (!todayPlan && !propPhase) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-pink-400 text-2xl shadow-[0_0_30px_rgba(236,72,153,0.2)]">
          <FiActivity />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white">
            Body Intelligence <span className="font-serif-title italic text-pink-300">Unavailable</span>
          </h2>
          <p className="text-base text-slate-300 max-w-md mx-auto leading-relaxed font-normal">
            Complete today's check-in to unlock body intelligence recommendations, phase tracking, and hormonal training insights.
          </p>
        </div>
        {setActiveTab && (
          <button
            onClick={() => setActiveTab("dashboard")}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-base shadow-[0_0_20px_rgba(236,72,153,0.4)] transition inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Complete Today's Check-In</span>
            <FiArrowRight />
          </button>
        )}
      </div>
    );
  }

  // Backend dynamic data
  const nutrition = todayPlan?.nutrition || {};
  const workout = todayPlan?.workout || {};
  const priorityNutrients = nutrition.priorityNutrients || ["Complex Carbs", "Leucine Protein"];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* 1. HERO SECTION (Current Phase, Confidence, Next Phase, Cycle Day) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-white">
              Daily <span className="font-serif-title italic text-[#2EA8DE]">Body Briefing</span>
            </h1>
            <p className="text-slate-300 text-base mt-1 font-normal leading-relaxed">
              30-Second Briefing: <strong className="text-white">What is happening inside your body today?</strong>
            </p>
          </div>

          <div className="floating-chip px-4 py-2 text-sm font-semibold text-purple-300 self-start sm:self-auto flex items-center gap-2">
            <FiCalendar className="text-[#2EA8DE]" />
            <span>Day {cycleDay} of {cycleLength} • {daysUntilNext} Days Until {nextPhaseName}</span>
          </div>
        </div>

        <Card className="soft-surface-hero p-6 md:p-8 border-0 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-br from-[#8F37FA]/15 via-[#6163F3]/15 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A351F8] animate-pulse shadow-[0_0_10px_rgba(163,81,248,0.8)]"></span>
                <span className="text-sm font-semibold uppercase tracking-wider text-[#A351F8] font-display">
                  Current Active Phase
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-white">
                {meta.name}
              </h2>
              <p className="text-base text-slate-300 font-normal leading-relaxed">
                {meta.subtitle} • Day {cycleDay} of {cycleLength}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-4.5 rounded-2xl bg-white/[0.04] text-center border border-white/[0.06] space-y-1">
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-300 block font-display">AI Confidence</span>
                <span className="text-3xl md:text-4xl font-bold text-[#2EA8DE] font-display block">
                  {Math.round(confidence * 100)}%
                </span>
              </div>
              <div className="p-4.5 rounded-2xl bg-white/[0.04] text-center border border-white/[0.06] space-y-1">
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-300 block font-display">Next Phase</span>
                <span className="text-xl font-bold text-purple-300 font-display block">
                  {nextPhaseName}
                </span>
                <span className="text-sm font-semibold text-slate-300 block">In {daysUntilNext} Days</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. COACH BIOLOGICAL INSIGHT (Explanatory copy in 16px) */}
      <Card className="soft-surface-hero p-6 md:p-8 border-0 relative overflow-hidden space-y-2.5">
        <div className="flex items-center gap-2 relative z-10">
          <FiCpu className="text-[#2EA8DE] text-lg" />
          <span className="text-sm font-semibold uppercase tracking-wider text-[#A351F8] font-display">
            Coach Biological Insight
          </span>
        </div>
        <p className="text-base md:text-lg font-normal text-slate-100 leading-[1.65] relative z-10 max-w-4xl">
          "{meta.coachInsight}"
        </p>
      </Card>

      {/* 3. DYNAMIC CYCLE TIMELINE (Titles: 34-38px, Phase Names: 28-32px, Day Ranges & Badges: 14px) */}
      <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-4 gap-2">
          <div>
            <h3 className="text-3xl md:text-[34px] font-bold font-display text-white">
              Cycle <span className="font-serif-title italic text-[#2EA8DE]">Phase Timeline</span>
            </h3>
            <p className="text-base text-slate-300 font-normal leading-relaxed mt-1">
              Personalized {cycleLength}-day biological progression. Highlighted phase is active today.
            </p>
          </div>
          <span className="floating-chip px-4 py-1.5 text-sm font-semibold text-purple-300 self-start sm:self-auto shrink-0">
            {cycleLength}-Day Cycle
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {timelinePhases.map((item, idx) => {
            const isActive = item.active !== undefined ? item.active : (meta.key === item.key);
            return (
              <div
                key={idx}
                className={`p-4 md:p-5 rounded-2xl transition-all flex flex-col justify-between space-y-3 ${
                  isActive
                    ? "bg-white/[0.08] border border-[#A351F8]/40 shadow-[0_0_20px_rgba(163,81,248,0.25)]"
                    : "bg-white/[0.03] border border-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-[#A351F8] shadow-[0_0_8px_rgba(163,81,248,0.8)] animate-pulse" : "bg-white/20"}`} />
                  <span className="text-sm font-semibold text-slate-300">{item.label}</span>
                </div>
                <div>
                  <h4 className={`text-2xl md:text-[28px] font-bold font-display leading-tight ${isActive ? "text-white" : "text-slate-300"}`}>
                    {item.name}
                  </h4>
                  {isActive && (
                    <span className="text-sm font-semibold text-[#38E6B8] block mt-2">
                      ● Active Phase
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. TODAY'S FOCUS (Card Labels: 13-14px uppercase semibold, Titles: 28-32px bold, Descriptions: 16px 1.6 line-height) */}
      <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-4 gap-2">
          <div>
            <h3 className="text-3xl md:text-[34px] font-bold font-display text-white">
              Today's <span className="font-serif-title italic text-[#2EA8DE]">Focus</span>
            </h3>
            <p className="text-base text-slate-300 font-normal leading-relaxed mt-1">
              Biological alignment across nutrition, training, and recovery.
            </p>
          </div>
          <span className="floating-chip px-4 py-1.5 text-sm font-semibold text-slate-200 self-start sm:self-auto shrink-0">
            3 Core Pillars
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2 flex flex-col justify-between">
            <span className="text-sm text-[#A351F8] font-semibold uppercase tracking-wider block font-display">Nutrition Focus</span>
            <h4 className="text-2xl md:text-3xl font-bold text-white font-display leading-snug">
              {typeof priorityNutrients[0] === "object" ? priorityNutrients[0].name : priorityNutrients[0] || "Complex Carbohydrates"}
            </h4>
            <p className="text-base text-slate-300 font-normal leading-[1.6]">
              Fuel with easily digestible complex carbs & leucine-rich protein.
            </p>
          </div>

          <div className="p-5.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2 flex flex-col justify-between">
            <span className="text-sm text-purple-300 font-semibold uppercase tracking-wider block font-display">Training Focus</span>
            <h4 className="text-2xl md:text-3xl font-bold text-white font-display leading-snug">
              {workout.title || workout.workoutObjective || "Progressive Resistance"}
            </h4>
            <p className="text-base text-slate-300 font-normal leading-[1.6]">
              Target intensity: <strong className="text-[#2EA8DE]">{workout.intensity || "Moderate Target"}</strong>.
            </p>
          </div>

          <div className="p-5.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-2 flex flex-col justify-between">
            <span className="text-sm text-cyan-300 font-semibold uppercase tracking-wider block font-display">Recovery Focus</span>
            <h4 className="text-2xl md:text-3xl font-bold text-white font-display leading-snug">
              Hydration Target & 8h Sleep
            </h4>
            <p className="text-base text-slate-300 font-normal leading-[1.6]">
              Fluid goal: {nutrition.hydrationTarget || "800–1000 mL"}. Deep sleep rest.
            </p>
          </div>
        </div>
      </Card>

      {/* 5. WHAT TO EXPECT TODAY (Domain Cards with 14px Labels & 16px Explanatory Copy) */}
      <Card className="soft-surface p-6 md:p-8 border-0 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-4 gap-2">
          <div>
            <h3 className="text-3xl md:text-[34px] font-bold font-display text-white">
              What to <span className="font-serif-title italic text-[#2EA8DE]">Expect Today</span>
            </h3>
            <p className="text-base text-slate-300 font-normal leading-relaxed mt-1">
              Predicted biological expectations across 6 core physiological domains.
            </p>
          </div>
          <span className="floating-chip px-4 py-1.5 text-sm font-semibold text-slate-200 self-start sm:self-auto shrink-0">
            Daily Forecast
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1.5">
            <span className="text-sm text-amber-300 font-semibold uppercase tracking-wider block font-display">Energy</span>
            <p className="text-base text-slate-200 font-normal leading-relaxed">{meta.expectations.energy}</p>
          </div>

          <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1.5">
            <span className="text-sm text-purple-300 font-semibold uppercase tracking-wider block font-display">Mood</span>
            <p className="text-base text-slate-200 font-normal leading-relaxed">{meta.expectations.mood}</p>
          </div>

          <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1.5">
            <span className="text-sm text-emerald-300 font-semibold uppercase tracking-wider block font-display">Recovery</span>
            <p className="text-base text-slate-200 font-normal leading-relaxed">{meta.expectations.recovery}</p>
          </div>

          <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1.5">
            <span className="text-sm text-[#A351F8] font-semibold uppercase tracking-wider block font-display">Performance</span>
            <p className="text-base text-slate-200 font-normal leading-relaxed">{meta.expectations.performance}</p>
          </div>

          <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1.5">
            <span className="text-sm text-indigo-300 font-semibold uppercase tracking-wider block font-display">Cravings</span>
            <p className="text-base text-slate-200 font-normal leading-relaxed">{meta.expectations.cravings}</p>
          </div>

          <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.04] space-y-1.5">
            <span className="text-sm text-cyan-300 font-semibold uppercase tracking-wider block font-display">Sleep</span>
            <p className="text-base text-slate-200 font-normal leading-relaxed">{meta.expectations.sleep}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
