export default function CircularProgress({
    value = 75,
    size = 140,
    strokeWidth = 12,
    color = "#7C3AED",
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const progress = (value / 100) * circumference;
    const offset = circumference - progress;

    return (
        <div className="flex justify-center items-center">
            <svg width={size} height={size} className="-rotate-90">

                {/* Background Circle */}

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E9D5FF"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Progress Circle */}

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: "stroke-dashoffset 0.8s ease",
                    }}
                />

                {/* Percentage */}

                <text
                    x="50%"
                    y="46%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(90 ${size / 2} ${size / 2})`}
                >
                    <tspan
                        x="50%"
                        fontSize="34"
                        fontWeight="700"
                        fill="#1F2937"
                    >
                       {value}
                    </tspan>

                    <tspan
                        x="50%"
                        dy="24"
                        fontSize="14"
                        fill="#6B7280"
                    >
                        Excellent
                    </tspan>
                </text>

            </svg>
        </div>
    );
}