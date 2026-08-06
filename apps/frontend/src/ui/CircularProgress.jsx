export default function CircularProgress({
  value = 64,
  size = 170,
  strokeWidth = 12,
  label = "Balanced",
  color = "#A351F8",
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = (value / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className="flex justify-center items-center">
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <defs>
          <linearGradient id="rhythmRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8F37FA" />
            <stop offset="50%" stopColor="#A351F8" />
            <stop offset="100%" stopColor="#2EA8DE" />
          </linearGradient>
          <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#A351F8" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle with Brand Gradient and Glow Filter */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#rhythmRingGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#ringGlow)"
          style={{
            transition: "stroke-dashoffset 0.8s ease",
          }}
        />

        {/* Centered Text: Score (46px #FFF) & Status (#38E6B8) — No /100 */}
        <text
          x="50%"
          y="42%"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
        >
          <tspan
            x="50%"
            fontSize="46"
            fontWeight="700"
            fill="#FFFFFF"
          >
            {value}
          </tspan>

          <tspan
            x="50%"
            dy="30"
            fontSize="16"
            fontWeight="500"
            fill="#38E6B8"
          >
            {label}
          </tspan>
        </text>
      </svg>
    </div>
  );
}