import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { submitCheckIn } from "../services/checkInService";

export default function DailyCheckIn() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Check if yesterday's workout is already recorded in state/localStorage
  const hasWorkoutRecordForYesterday =
    localStorage.getItem("yesterdayWorkoutRecord") === "true" ||
    localStorage.getItem("workoutCompletedYesterday") === "true";

  const [step, setStep] = useState(1);
  const [acknowledgment, setAcknowledgment] = useState("");
  const [aiChecklist, setAiChecklist] = useState({
    recovery: false,
    fatigue: false,
    readiness: false,
    nutrition: false,
    ready: false,
  });

  // User Responses across 7 Screens
  const [sleep, setSleep] = useState("Average");
  const [energy, setEnergy] = useState(3);
  const [soreness, setSoreness] = useState("Mild");
  const [stress, setStress] = useState("Calm");
  const [yesterdayWorkout, setYesterdayWorkout] = useState(
    hasWorkoutRecordForYesterday ? "Yes" : "Yes"
  );
  const [readiness, setReadiness] = useState("Moderate");

  // Total visible steps (6 if yesterday's workout question is omitted, 7 if asked)
  const totalSteps = hasWorkoutRecordForYesterday ? 6 : 7;

  // Determine Orb Emotional State distinctly PER QUESTION & OPTION
  const getOrbState = () => {
    if (step === 7 || (hasWorkoutRecordForYesterday && step === 6)) return "confident";

    // Step 1: Sleep Quality
    if (step === 1) {
      if (sleep === "Poor") return "fatigue";
      if (sleep === "Average") return "balanced";
      if (sleep === "Great") return "radiant";
    }

    // Step 2: Energy Level Slider (1 - 5)
    if (step === 2) {
      if (energy <= 2) return "fatigue";
      if (energy === 3) return "balanced";
      if (energy >= 4) return "radiant";
    }

    // Step 3: Muscle Soreness
    if (step === 3) {
      if (soreness === "High") return "fatigue";
      if (soreness === "Moderate") return "stressed";
      if (soreness === "Mild") return "balanced";
      if (soreness === "None") return "determined";
    }

    // Step 4: Stress Level
    if (step === 4) {
      if (stress === "Elevated") return "stressed";
      if (stress === "Moderate") return "serene";
      if (stress === "Calm") return "radiant";
    }

    // Step 5 & 6 (Workout-related questions): Lock in established biological state
    if (step >= 5) {
      if (stress === "Elevated") return "stressed";
      if (sleep === "Poor" || energy <= 2 || soreness === "High") return "fatigue";
      if (soreness === "Moderate" || stress === "Moderate") return "serene";
      if (sleep === "Great" || energy >= 4 || stress === "Calm") return "radiant";
      return "balanced";
    }

    return "balanced";
  };

  const currentEmotion = getOrbState();

  // Trigger AI Acknowledgment
  const triggerOrbPulse = (ackMsg) => {
    setAcknowledgment(ackMsg);
  };

  // Screen 7 (or Screen 6 if omitted) AI Processing sequence
  const isFinalAnalysisStep = step === totalSteps;

  useEffect(() => {
    if (isFinalAnalysisStep) {
      const t1 = setTimeout(() => setAiChecklist((p) => ({ ...p, recovery: true })), 700);
      const t2 = setTimeout(() => setAiChecklist((p) => ({ ...p, fatigue: true })), 1400);
      const t3 = setTimeout(() => setAiChecklist((p) => ({ ...p, readiness: true })), 2100);
      const t4 = setTimeout(() => setAiChecklist((p) => ({ ...p, nutrition: true })), 2800);
      const t5 = setTimeout(() => {
        setAiChecklist((p) => ({ ...p, ready: true }));
      }, 3500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
      };
    }
  }, [step, isFinalAnalysisStep]);

  const handleNext = () => {
    if (step < totalSteps) {
      // If yesterday's workout is already recorded, skip Step 5 (yesterday's workout question)
      if (hasWorkoutRecordForYesterday && step === 4) {
        setStep(5); // Jumps directly to Target Intensity (which becomes visual step 5)
      } else {
        setStep((prev) => prev + 1);
      }
      setAcknowledgment("");
    }
  };

  const handleSkip = () => {
    setStep(totalSteps);
  };

  const handleCompleteCheckin = async () => {
    const payload = {
      sleepQuality: sleep,
      energy,
      soreness,
      stress,
      yesterdayWorkout,
      targetIntensity: readiness,
      timestamp: new Date().toISOString(),
    };

    // Save as local source of truth for immediate frontend data-driven rendering
    localStorage.setItem("latestCheckIn", JSON.stringify(payload));

    const storedUserId = localStorage.getItem("userId");
    const activeUserId = (userId && userId !== "guest") ? userId : (storedUserId && storedUserId !== "guest" ? storedUserId : "");

    try {
      await submitCheckIn(activeUserId, payload);
      navigate(`/dashboard/${activeUserId}`);
    } catch (err) {
      console.error(err);
      navigate(`/dashboard/${activeUserId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#06030B] bg-mesh-atmosphere text-slate-100 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden select-none">
      {/* Ambient Blurred Light Orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-pink-500/12 rounded-full blur-[170px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-purple-600/12 rounded-full blur-[190px] pointer-events-none"></div>

      {/* TOP BAR: Step X of N (Left) & Skip (Right) */}
      <div className="flex items-center justify-between z-20 max-w-2xl mx-auto w-full">
        <span className="text-xs font-semibold text-slate-400 font-display tracking-wider">
          Step {step} of {totalSteps}
        </span>

        {step < totalSteps && (
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Skip
          </button>
        )}
      </div>

      {/* MAIN CONTAINER: LIVING AI ORB COMPANION (~35% VIEWPORT) IN CENTER */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full text-center space-y-8 my-4 z-20">
        {/* THE LIVING RHYTHM AI ORB (7-TIER EMOTIONAL SPECTRUM) */}
        <div className="relative flex items-center justify-center my-2">
          <div className={`rhythm-living-orb orb-state-${currentEmotion}`}>
            {/* FACIAL EXPRESSIONS PER EMOTIONAL STATE */}
            <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 pointer-events-none">
              {currentEmotion === "fatigue" && (
                <div className="space-y-2 flex flex-col items-center opacity-90">
                  <div className="flex gap-5">
                    <span className="w-3.5 h-1 bg-white/90 rounded-full rotate-6"></span>
                    <span className="w-3.5 h-1 bg-white/90 rounded-full -rotate-6"></span>
                  </div>
                  <svg className="w-8 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]" viewBox="0 0 40 24" fill="none">
                    <path d="M 10 18 Q 20 6 30 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {currentEmotion === "stressed" && (
                <div className="space-y-2 flex flex-col items-center opacity-90">
                  <div className="flex gap-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/90"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-white/90"></span>
                  </div>
                  <span className="w-3.5 h-0.5 bg-white/80 rounded-full block"></span>
                </div>
              )}

              {currentEmotion === "serene" && (
                <div className="space-y-1.5 flex flex-col items-center opacity-90">
                  <div className="flex gap-5">
                    <span className="w-3 h-1 border-t-2 border-white/90 rounded-full"></span>
                    <span className="w-3 h-1 border-t-2 border-white/90 rounded-full"></span>
                  </div>
                  <svg className="w-6 h-3 text-white" viewBox="0 0 40 24" fill="none">
                    <path d="M 10 8 Q 20 18 30 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {currentEmotion === "balanced" && (
                <div className="space-y-2 flex flex-col items-center">
                  <div className="flex gap-5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white]"></span>
                  </div>
                  <svg className="w-7 h-2 text-white drop-shadow-[0_0_6px_white]" viewBox="0 0 40 10" fill="none">
                    <line x1="8" y1="5" x2="32" y2="5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {currentEmotion === "determined" && (
                <div className="space-y-1.5 flex flex-col items-center">
                  <div className="flex gap-5">
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_rgba(245,158,11,0.9)]"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_rgba(245,158,11,0.9)]"></span>
                  </div>
                  <svg className="w-9 h-5 text-white drop-shadow-[0_0_8px_white]" viewBox="0 0 40 24" fill="none">
                    <path d="M 8 10 Q 20 22 32 10" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {currentEmotion === "radiant" && (
                <div className="space-y-2 flex flex-col items-center">
                  <div className="flex gap-6">
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)] animate-pulse"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)] animate-pulse"></span>
                  </div>
                  <svg className="w-10 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" viewBox="0 0 40 24" fill="none">
                    <path d="M 6 6 Q 20 22 34 6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {currentEmotion === "confident" && (
                <div className="space-y-2 flex flex-col items-center animate-fadeIn">
                  <div className="flex gap-6">
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,1)] animate-pulse"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,1)] animate-pulse"></span>
                  </div>
                  <svg className="w-10 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" viewBox="0 0 40 24" fill="none">
                    <path d="M 6 8 Q 20 22 34 8" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>

            {(currentEmotion === "radiant" || currentEmotion === "determined" || currentEmotion === "confident") && (
              <>
                <span className="absolute -top-3 -right-2 w-2.5 h-2.5 rounded-full bg-pink-300 animate-ping"></span>
                <span className="absolute -bottom-2 -left-3 w-2.5 h-2.5 rounded-full bg-cyan-300 animate-pulse"></span>
                <span className="absolute top-1/2 -right-4 w-2 h-2 rounded-full bg-amber-300 animate-bounce"></span>
              </>
            )}
          </div>
        </div>

        {/* AI ACKNOWLEDGMENT TEXT */}
        {acknowledgment && (
          <p className="text-xs font-semibold text-pink-300 font-display animate-fadeIn">
            ✨ {acknowledgment}
          </p>
        )}

        {/* SCREEN 1: SLEEP */}
        {step === 1 && (
          <div className="space-y-6 w-full animate-fadeIn">
            <div>
              <h1 className="text-3xl md:text-5xl font-light font-display text-white">
                How did you <br />
                <span className="font-serif-title italic text-pink-300 text-4xl md:text-6xl">sleep</span> <br />
                last night?
              </h1>
              <p className="text-slate-400 text-xs font-light mt-3 max-w-sm mx-auto">
                Sleep quality directly shapes today's recovery and training recommendations.
              </p>
            </div>

            <div className="flex items-center justify-center gap-10 text-sm font-semibold tracking-wider font-display pt-4">
              {["Poor", "Average", "Great"].map((val) => {
                const isSelected = sleep === val;
                return (
                  <span
                    key={val}
                    onClick={() => {
                      setSleep(val);
                      triggerOrbPulse(
                        val === "Poor"
                          ? "I understand. I will adjust today's recovery expectations."
                          : val === "Average"
                            ? "Got it. Sleep will be factored into today's recovery."
                            : "Wonderful! We can optimize for higher output today."
                      );
                    }}
                    className={`cursor-pointer transition-all duration-300 ${isSelected
                        ? "text-pink-300 font-bold scale-110 border-b-2 border-pink-400 pb-1"
                        : "text-slate-500 hover:text-white"
                      }`}
                  >
                    {val}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 2: ENERGY */}
        {step === 2 && (
          <div className="space-y-6 w-full animate-fadeIn">
            <div>
              <h1 className="text-3xl md:text-5xl font-light font-display text-white">
                How <br />
                <span className="font-serif-title italic text-pink-300 text-4xl md:text-6xl">energetic</span> <br />
                do you feel?
              </h1>
              <p className="text-slate-400 text-xs font-light mt-3 max-w-sm mx-auto">
                Calibrating your baseline biological vitality.
              </p>
            </div>

            <div className="space-y-3 pt-4 max-w-xs mx-auto">
              <input
                type="range"
                min="1"
                max="5"
                value={energy}
                onChange={(e) => {
                  setEnergy(Number(e.target.value));
                  triggerOrbPulse("Understood. Adjusting today's recommended exertion.");
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />

              <div className="flex justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                <span>Exhausted</span>
                <span className="text-pink-300 font-bold font-display">
                  {energy === 1 && "20% Low"}
                  {energy === 2 && "40% Moderate"}
                  {energy === 3 && "60% Balanced"}
                  {energy === 4 && "80% High"}
                  {energy === 5 && "100% Peak"}
                </span>
                <span>Energized</span>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: SORENESS */}
        {step === 3 && (
          <div className="space-y-6 w-full animate-fadeIn">
            <div>
              <h1 className="text-3xl md:text-5xl font-light font-display text-white">
                How <br />
                <span className="font-serif-title italic text-pink-300 text-4xl md:text-6xl">sore</span> <br />
                is your body?
              </h1>
              <p className="text-slate-400 text-xs font-light mt-3 max-w-sm mx-auto">
                Calibrating targeted muscular fatigue state.
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 text-xs font-semibold tracking-wider font-display pt-4">
              {["None", "Mild", "Moderate", "High"].map((val) => {
                const isSelected = soreness === val;
                return (
                  <span
                    key={val}
                    onClick={() => {
                      setSoreness(val);
                      triggerOrbPulse("Noted. Muscle soreness will dictate session volume.");
                    }}
                    className={`cursor-pointer transition-all duration-300 ${isSelected
                        ? "text-pink-300 font-bold scale-110 border-b-2 border-pink-400 pb-1"
                        : "text-slate-500 hover:text-white"
                      }`}
                  >
                    {val}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 4: STRESS */}
        {step === 4 && (
          <div className="space-y-6 w-full animate-fadeIn">
            <div>
              <h1 className="text-3xl md:text-5xl font-light font-display text-white">
                How <br />
                <span className="font-serif-title italic text-pink-300 text-4xl md:text-6xl">stressed</span> <br />
                do you feel?
              </h1>
              <p className="text-slate-400 text-xs font-light mt-3 max-w-sm mx-auto">
                Factoring central nervous system load into recovery.
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 text-xs font-semibold tracking-wider font-display pt-4">
              {["Calm", "Moderate", "Elevated"].map((val) => {
                const isSelected = stress === val;
                return (
                  <span
                    key={val}
                    onClick={() => {
                      setStress(val);
                      triggerOrbPulse("Adjusting parasympathetic recovery priorities.");
                    }}
                    className={`cursor-pointer transition-all duration-300 ${isSelected
                        ? "text-purple-300 font-bold scale-110 border-b-2 border-purple-400 pb-1"
                        : "text-slate-500 hover:text-white"
                      }`}
                  >
                    {val}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 5: YESTERDAY'S WORKOUT (ONLY SHOWN IF NOT ALREADY RECORDED) */}
        {step === 5 && !hasWorkoutRecordForYesterday && (
          <div className="space-y-6 w-full animate-fadeIn">
            <div>
              <h1 className="text-3xl md:text-5xl font-light font-display text-white">
                Did you complete <br />
                <span className="font-serif-title italic text-pink-300 text-4xl md:text-6xl">yesterday's workout</span>?
              </h1>
              <p className="text-slate-400 text-xs font-light mt-3 max-w-sm mx-auto">
                Helps Rhythm calculate acute vs chronic load ratio.
              </p>
            </div>

            <div className="flex items-center justify-center gap-10 text-xs font-semibold tracking-wider font-display pt-4">
              {["Yes", "Partially", "No"].map((val) => {
                const isSelected = yesterdayWorkout === val;
                return (
                  <span
                    key={val}
                    onClick={() => {
                      setYesterdayWorkout(val);
                      triggerOrbPulse("Updating your 7-day training load graph.");
                    }}
                    className={`cursor-pointer transition-all duration-300 ${isSelected
                        ? "text-pink-300 font-bold scale-110 border-b-2 border-pink-400 pb-1"
                        : "text-slate-500 hover:text-white"
                      }`}
                  >
                    {val}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 6 (OR 5): TARGET INTENSITY */}
        {((step === 6 && !hasWorkoutRecordForYesterday) || (step === 5 && hasWorkoutRecordForYesterday)) && (
          <div className="space-y-6 w-full animate-fadeIn">
            <div>
              <h1 className="text-3xl md:text-5xl font-light font-display text-white">
                Ready for <br />
                <span className="font-serif-title italic text-pink-300 text-4xl md:text-6xl">today's workout</span>?
              </h1>
              <p className="text-slate-400 text-xs font-light mt-3 max-w-sm mx-auto">
                Aligning session load with your Luteal phase.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs font-semibold tracking-wider font-display pt-4">
              {["Rest", "Easy", "Moderate", "Intense"].map((val) => {
                const isSelected = readiness === val;
                return (
                  <span
                    key={val}
                    onClick={() => {
                      setReadiness(val);
                      triggerOrbPulse("Designing your phase-optimal session plan.");
                    }}
                    className={`cursor-pointer transition-all duration-300 ${isSelected
                        ? "text-purple-300 font-bold scale-110 border-b-2 border-purple-400 pb-1"
                        : "text-slate-500 hover:text-white"
                      }`}
                  >
                    {val}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* FINAL STEP: AI PROCESSING & BIOLOGICAL PROFILE GENERATION */}
        {isFinalAnalysisStep && (
          <div className="space-y-6 w-full animate-fadeIn py-4">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-light font-display text-white">
                Analyzing today's <br />
                <span className="font-serif-title italic text-pink-300 text-4xl md:text-6xl">biology...</span>
              </h1>

              <div className="space-y-2.5 max-w-xs mx-auto pt-4 text-xs font-semibold">
                <div className={`p-3 rounded-2xl transition-all flex items-center justify-between ${aiChecklist.recovery ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "text-slate-600 opacity-30"}`}>
                  <span>✓ Recovery Estimated</span>
                </div>
                <div className={`p-3 rounded-2xl transition-all flex items-center justify-between ${aiChecklist.fatigue ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "text-slate-600 opacity-30"}`}>
                  <span>✓ Fatigue Predicted</span>
                </div>
                <div className={`p-3 rounded-2xl transition-all flex items-center justify-between ${aiChecklist.readiness ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "text-slate-600 opacity-30"}`}>
                  <span>✓ Workout Readiness Calculated</span>
                </div>
                <div className={`p-3 rounded-2xl transition-all flex items-center justify-between ${aiChecklist.nutrition ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" : "text-slate-600 opacity-30"}`}>
                  <span>✓ Nutrition Personalized</span>
                </div>
              </div>

              {aiChecklist.ready && (
                <div className="pt-4 animate-fadeIn space-y-4">
                  <p className="text-lg font-bold font-display text-white">Your personalized plan is ready.</p>
                  <button
                    onClick={handleCompleteCheckin}
                    className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold text-sm shadow-[0_0_35px_rgba(236,72,153,0.5)] hover:scale-105 transition transform"
                  >
                    View Today's Dashboard →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CONTINUE BUTTON AT BOTTOM RIGHT */}
      {!isFinalAnalysisStep && (
        <div className="flex justify-end max-w-2xl mx-auto w-full z-20 border-t border-white/[0.05] pt-6">
          <button
            onClick={handleNext}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:opacity-90 transition flex items-center gap-2"
          >
            <span>Continue</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}