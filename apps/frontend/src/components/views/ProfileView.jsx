import { useState } from "react";
import Card from "../../ui/Card";
import { FiCpu, FiShield, FiCheck } from "react-icons/fi";

export default function ProfileView({ user }) {
  const userName = user?.name || "Janhavi Khare";
  const userEmail = user?.email || "janhavikhare09@gmail.com";

  const [selectedGoal, setSelectedGoal] = useState("Gain Muscle");

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Purpose & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-light font-display text-white">
            Personal Settings & <span className="font-serif-title italic text-pink-300">Profile</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Purpose: Personal settings, biological health preferences, and AI preferences.
          </p>
        </div>
      </div>

      {/* 1. PERSONAL INFORMATION & USER SPECS */}
      <Card className="soft-surface-hero p-8 border-0">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold font-display shadow-[0_0_25px_rgba(236,72,153,0.5)]">
            {userName[0]}
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold font-display text-white">{userName}</h2>
            <p className="text-xs text-slate-300">{userEmail}</p>
            <span className="floating-chip px-3 py-1 text-[11px] text-pink-300 inline-block mt-1">
              Premium AI Companion Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.05] text-center">
          <div className="p-4 rounded-2xl bg-white/[0.03]">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Age</span>
            <span className="text-base font-bold text-white font-display mt-0.5 block">26 Years</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03]">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Height</span>
            <span className="text-base font-bold text-pink-300 font-display mt-0.5 block">168 cm</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03]">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Weight</span>
            <span className="text-base font-bold text-purple-300 font-display mt-0.5 block">62 kg</span>
          </div>
        </div>
      </Card>

      {/* 2. FITNESS GOALS & 3. HEALTH PREFERENCES */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* 2. FITNESS GOALS */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-8 h-full border-0 space-y-4">
            <h3 className="text-xl font-light font-display text-white mb-2">
              Fitness <span className="font-serif-title italic text-pink-300">Goals</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {["Lose Fat", "Gain Muscle", "Maintain", "Improve Endurance"].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={`p-4 rounded-2xl text-left text-xs font-semibold transition ${
                    selectedGoal === goal
                      ? "bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                      : "bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="block font-bold">{goal}</span>
                  {selectedGoal === goal && <span className="text-[10px] opacity-80 mt-0.5 block">Active Target</span>}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* 3. HEALTH PREFERENCES */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-8 h-full border-0 space-y-4">
            <h3 className="text-xl font-light font-display text-white mb-2">
              Health <span className="font-serif-title italic text-pink-300">Preferences</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Dietary Preference</span>
                <span className="font-bold text-pink-300 font-display">Vegetarian</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Food Allergies</span>
                <span className="font-bold text-slate-200">None Reported</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Daily Supplements</span>
                <span className="font-bold text-purple-300">Magnesium, Vitamin D3, Omega-3</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Medical Conditions</span>
                <span className="font-bold text-emerald-400">None</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. AI PREFERENCES & 5. APP SETTINGS */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* 4. AI PREFERENCES */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-8 h-full border-0 space-y-4">
            <h3 className="text-xl font-light font-display text-white mb-2 flex items-center gap-2">
              <FiCpu className="text-purple-300" />
              AI <span className="font-serif-title italic text-pink-300">Preferences</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Recommendation Style</span>
                <span className="font-bold text-pink-300">Explainable & Analytical</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Model Confidence</span>
                <span className="font-bold text-purple-300 font-display">91% Random Forest</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Explain Predictions (SHAP)</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <FiCheck /> Enabled
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* 5. APP SETTINGS */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="soft-surface p-8 h-full border-0 space-y-4">
            <h3 className="text-xl font-light font-display text-white mb-2 flex items-center gap-2">
              <FiShield className="text-emerald-400" />
              App <span className="font-serif-title italic text-pink-300">Settings & Privacy</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Theme</span>
                <span className="font-bold text-pink-300">Dark Atmosphere (Default)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Units</span>
                <span className="font-bold text-white">Metric (kg, cm, mL)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Privacy & Encryption</span>
                <span className="font-bold text-emerald-400">256-Bit E2E Encrypted</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
