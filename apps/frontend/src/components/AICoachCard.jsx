import { useState } from "react";
import Card from "../ui/Card";
import { FiSend, FiCpu, FiUser, FiZap, FiCheckCircle } from "react-icons/fi";

export default function AICoachCard() {
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello Janhavi! I'm your Rhythm AI Biological Companion. I'm actively monitoring your Luteal phase, readiness score (84/100), and 8.0h sleep recovery. How can I help optimize your performance today?",
      time: "Just now",
    },
  ]);

  const sampleQuestions = [
    "Should I work out today?",
    "Why is my readiness low?",
    "What should I eat after today's workout?",
    "How does Luteal phase affect HRV?",
  ];

  const handleSend = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: "user", text: textToSend, time: "Just now" };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery("");
    setIsTyping(true);

    // AI Contextual Response Generator
    setTimeout(() => {
      let aiResponseText = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes("should i work out") || lower.includes("workout today")) {
        aiResponseText =
          "Yes, absolutely! Today your biological readiness score is 84/100 with low acute fatigue (36/100). Because you are in your Luteal phase, a 45-minute moderate strength session targeting upper body hypertrophy is optimal without over-taxing your central nervous system.";
      } else if (lower.includes("why is my readiness") || lower.includes("readiness low")) {
        aiResponseText =
          "Your readiness is currently high (84/100)! However, if it dips, our Random Forest ML model flags three main drivers: 1) Sleep debt under 7 hours (38.4% SHAP impact), 2) Progesterone surge during late Luteal phase (26.2% impact), or 3) Consecutive high-intensity workout days.";
      } else if (lower.includes("what should i eat") || lower.includes("eat after")) {
        aiResponseText =
          "Post-workout today, target 35–42g of leucine-rich protein combined with complex carbs. We recommend a Grilled Chicken or Tofu Bowl with Quinoa and roasted veggies to maximize muscle protein synthesis during your Luteal window.";
      } else if (lower.includes("luteal") || lower.includes("hrv")) {
        aiResponseText =
          "During the Luteal phase, elevated progesterone slightly raises resting heart rate and body temperature, which can lower baseline HRV by 5–10ms. This is completely normal! Focus on parasympathetic recovery, hydration, and magnesium supplementation.";
      } else {
        aiResponseText =
          `Based on your current Luteal phase biology, 8.0 hours of sleep, and 94% weekly consistency score: "${textToSend}" aligns with your goal to Gain Muscle while maintaining optimal metabolic recovery.`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: aiResponseText, time: "Just now" },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <Card id="ai-coach-dock" className="soft-surface-hero border-0 relative overflow-hidden p-6 lg:p-10">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        {/* Header & Orb Badge */}
        <div className="text-center space-y-3">
          <div className="flex justify-center my-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500/80 to-purple-600/80 flex items-center justify-center text-white shadow-[0_0_40px_rgba(236,72,153,0.5)] animate-pulse">
              <FiCpu className="text-2xl" />
            </div>
          </div>

          <h2 className="text-3xl font-light font-display text-white">
            Ask <span className="font-serif-title italic font-normal text-pink-300 text-4xl">Rhythm AI Coach ⭐</span>
          </h2>
          <p className="text-slate-300 text-xs font-light max-w-lg mx-auto">
            Conversational biological intelligence answering questions with real-time context from your cycle phase, sleep debt, and readiness scores.
          </p>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="floating-chip px-3.5 py-1.5 text-xs text-slate-200 hover:text-white transition flex items-center gap-1.5"
            >
              <FiZap className="text-pink-400 text-xs" />
              <span>"{q}"</span>
            </button>
          ))}
        </div>

        {/* Conversation Thread */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar my-4 p-4 rounded-3xl bg-black/20 backdrop-blur-md border border-white/[0.04]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs shrink-0 mt-1 shadow-[0_0_12px_rgba(236,72,153,0.4)]">
                  <FiCpu />
                </div>
              )}

              <div
                className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white rounded-br-none shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                    : "bg-white/[0.05] border border-white/[0.06] text-slate-200 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[9px] opacity-60 block mt-1 text-right">{msg.time}</span>
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300 text-xs shrink-0 mt-1">
                  <FiUser />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-pink-300 font-display animate-pulse">
              <div className="w-7 h-7 rounded-full bg-pink-500/20 flex items-center justify-center">
                <FiCpu className="text-pink-400 text-xs" />
              </div>
              <span>Rhythm AI is analyzing your biological context...</span>
            </div>
          )}
        </div>

        {/* Input Dock */}
        <div className="relative">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Rhythm AI ('Should I work out today?', 'Why is readiness low?')..."
            className="w-full rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] p-4 pr-14 text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:border-pink-500/50 transition-all"
          />

          <button
            onClick={() => handleSend()}
            className="absolute right-2.5 top-2.5 w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:opacity-90 transition"
          >
            <FiSend className="text-xs" />
          </button>
        </div>
      </div>
    </Card>
  );
}