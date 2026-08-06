import {
  FiHome,
  FiActivity,
  FiPieChart,
  FiCalendar,
  FiUser,
  FiZap
} from "react-icons/fi";
import PhaseCard from "../components/PhaseCard";

export default function Sidebar({ phase, activeTab = "dashboard", setActiveTab }) {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "workout", label: "Workout", icon: FiZap },
    { id: "nutrition", label: "Nutrition", icon: FiActivity },
    { id: "insights", label: "Insights", icon: FiPieChart },
    { id: "cycle", label: "Cycle", icon: FiCalendar },
    { id: "profile", label: "Profile", icon: FiUser },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#07030C]/90 backdrop-blur-2xl border-r border-white/[0.05] flex flex-col justify-between p-6 h-screen sticky top-0 text-slate-200 z-30">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Rhythm Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <h2 className="text-2xl font-bold tracking-tight font-display glow-gradient-text">
              Rhythm
            </h2>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === "workout" && activeTab === "workout-session");
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`relative flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl transition-all ${isActive
                    ? "bg-white/[0.08] text-white font-semibold text-[17px] shadow-[0_0_15px_rgba(163,81,248,0.2)]"
                    : "text-slate-300 font-medium text-base hover:text-white hover:bg-white/[0.04]"
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full brand-gradient-bg shadow-[0_0_12px_rgba(163,81,248,0.8)]"></span>
                )}
                <Icon className={isActive ? "text-[#2EA8DE] text-base" : "text-base"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4">
        <PhaseCard phase={phase} />

        {/* Mini User Profile Avatar at Bottom */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
            {userName?.[0] || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {userName || "User"}
            </p>

            <p className="text-[10px] text-slate-400 truncate">
              {userEmail || "No email"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}