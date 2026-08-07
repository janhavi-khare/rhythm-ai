import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiMoon } from "react-icons/fi";
import { FITNESS_GOALS } from "./constants/goals";

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        height: "",
        weight: "",
        cycleLength: "",
        periodLength: "",
        lastPeriodDate: "",
        goals: [],
        activityLevel: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGoalChange = (goal) => {
        if (formData.goals.includes(goal)) {
            setFormData({
                ...formData,
                goals: formData.goals.filter((g) => g !== goal),
            });
        } else {
            setFormData({
                ...formData,
                goals: [...formData.goals, goal],
            });
        }
    };

    const handleFinish = async () => {
        if (
            !formData.height ||
            !formData.weight ||
            !formData.cycleLength ||
            !formData.periodLength ||
            !formData.lastPeriodDate
        ) {
            alert("Please fill all required fields");
            return;
        }

        try {
            const email = localStorage.getItem("userEmail");
            const result = await axios.post(
                '${import.meta.env.VITE_API_URL}/onboarding',
                {
                    email,
                    ...formData
                }
            );

            const userId = result.data?._id || localStorage.getItem("userId");
            if (userId) {
                localStorage.setItem("userId", userId);
                navigate(`/checkin/${userId}`);
            } else {
                alert("Failed to save profile. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Error during onboarding. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0614] bg-mesh-dark text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="w-full max-w-lg glass-panel-glow rounded-[32px] border border-pink-500/30 p-8 md:p-10 shadow-[0_0_50px_rgba(236,72,153,0.15)] z-10">
                <div className="flex items-center gap-3 mb-6">
                    <img src="/logo.png" alt="Rhythm Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
                    <div>
                        <h1 className="text-2xl font-extrabold glow-gradient-text">Welcome to Rhythm</h1>
                        <p className="text-slate-400 text-xs">
                            Step {step} of 3 • Let's personalize your AI engine.
                        </p>
                    </div>
                </div>

                {step === 1 && (
                    <StepOne
                        formData={formData}
                        handleChange={handleChange}
                    />
                )}

                {step === 2 && (
                    <StepTwo
                        formData={formData}
                        handleChange={handleChange}
                    />
                )}

                {step === 3 && (
                    <StepThree
                        formData={formData}
                        handleChange={handleChange}
                        handleGoalChange={handleGoalChange}
                    />
                )}

                <div className="flex justify-between items-center mt-8 border-t border-white/10 pt-6">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-2.5 rounded-2xl border border-white/15 bg-white/5 text-slate-300 font-semibold text-xs hover:bg-white/10 transition"
                        >
                            Back
                        </button>
                    ) : <div />}

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] transition text-xs"
                        >
                            Next Step
                        </button>
                    ) : (
                        <button
                            onClick={handleFinish}
                            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] transition text-xs"
                        >
                            Complete Profile 🚀
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function StepOne({ formData, handleChange }) {
    return (
        <div className="space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider text-pink-400">Basic Information</h2>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Height (cm)</label>
                <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                    placeholder="e.g. 165"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Weight (kg)</label>
                <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                    placeholder="e.g. 60"
                />
            </div>
        </div>
    );
}

function StepTwo({ formData, handleChange }) {
    return (
        <div className="space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider text-pink-400">Cycle Information</h2>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Average Cycle Length (days)
                </label>
                <input
                    type="number"
                    name="cycleLength"
                    value={formData.cycleLength}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                    placeholder="e.g. 28"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Average Period Length (days)
                </label>
                <input
                    type="number"
                    name="periodLength"
                    value={formData.periodLength}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                    placeholder="e.g. 5"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    First Day of Last Period
                </label>
                <input
                    type="date"
                    name="lastPeriodDate"
                    value={formData.lastPeriodDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                />
            </div>
        </div>
    );
}

function StepThree({
    formData,
    handleChange,
    handleGoalChange,
}) {
    const goals = FITNESS_GOALS.map((g) => g.label);

    return (
        <div className="space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider text-pink-400">
                Goals & Activity
            </h2>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Primary Goals
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                    {goals.map((goal) => (
                        <label
                            key={goal}
                            className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition ${
                              formData.goals.includes(goal)
                                ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/50 text-white shadow-[0_0_12px_rgba(236,72,153,0.2)]"
                                : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={formData.goals.includes(goal)}
                                onChange={() => handleGoalChange(goal)}
                                className="accent-pink-500"
                            />
                            <span>{goal}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Activity Level
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                    {[
                        "Sedentary",
                        "Lightly Active",
                        "Moderately Active",
                        "Very Active",
                    ].map((level) => (
                        <label
                            key={level}
                            className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition ${
                              formData.activityLevel === level
                                ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/50 text-white shadow-[0_0_12px_rgba(236,72,153,0.2)]"
                                : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]"
                            }`}
                        >
                            <input
                                type="radio"
                                name="activityLevel"
                                value={level}
                                checked={formData.activityLevel === level}
                                onChange={handleChange}
                                className="accent-pink-500"
                            />
                            {level}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
