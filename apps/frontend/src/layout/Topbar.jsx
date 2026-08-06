import { FiCalendar, FiZap } from "react-icons/fi";

export default function Topbar({ user, phase }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const userName = user?.name ? user.name.split(" ")[0] : "Janhavi";
  const phaseName = phase?.name;
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Date & Phase Capsule */}
      <div className="flex items-center gap-3">
        <span className="floating-chip px-4 py-2 text-sm font-semibold text-slate-200 flex items-center gap-2">
          <FiCalendar className="text-[#2EA8DE]" />
          {today}
        </span>
        <span className="floating-chip px-4 py-2 text-sm font-semibold text-purple-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A351F8] animate-pulse"></span>
          {phaseName} Phase
        </span>
      </div>

      {/* User Capsule */}
      <div className="flex items-center gap-3 self-start md:self-auto floating-chip p-2 px-4">
        <div className="text-right">
          <h3 className="font-bold text-sm text-white font-display">
            {user?.name || "Janhavi Khare"}
          </h3>
          <p className="text-sm font-semibold text-amber-300 flex items-center justify-end gap-1">
            <FiZap className="text-amber-400" />
            <span>{user?.streak !== undefined ? `${user.streak} Day Streak` : "0 Day Streak"}</span>
          </p>
        </div>

        <div className="w-10 h-10 rounded-full brand-gradient-bg flex items-center justify-center font-bold text-white text-sm shadow-[0_0_20px_rgba(163,81,248,0.4)]">
          {userName[0]}
        </div>
      </div>
    </div>
  );
}