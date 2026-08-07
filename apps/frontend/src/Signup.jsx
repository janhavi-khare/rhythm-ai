import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { FiMoon } from "react-icons/fi";

export default function Signup() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            setLoading(true);
            const result = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, { name, age, email, password });
            if (result.data && result.data._id) {
                localStorage.setItem("userId", result.data._id);
                localStorage.setItem("userEmail", email);
                navigate("/onboarding");
            } else {
                alert(result.data?.message || "Signup failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Error during signup. Please try again.");
        } finally {
            setLoading(false);
        }
    }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0614] bg-mesh-dark text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel-glow rounded-[32px] border border-pink-500/30 p-8 md:p-10 shadow-[0_0_50px_rgba(236,72,153,0.15)] z-10">
        
        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Rhythm Logo" className="w-16 h-16 object-contain mx-auto drop-shadow-[0_0_20px_rgba(168,85,247,0.6)] mb-3" />
          <h1 className="text-4xl font-extrabold tracking-tight glow-gradient-text">
            Rhythm
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Personalized Nutrition Intelligence for Women
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              placeholder="e.g. Janhavi Khare"
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Age
            </label>
            <input
              type="number"
              required
              min="13"
              max="100"
              value={age}
              placeholder="e.g. 24"
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 text-sm"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-slate-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] transition text-sm disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-xs text-slate-500">or</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          <button
            type="button"
            className="w-full py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-xs transition"
          >
            Continue with Google
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-pink-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}