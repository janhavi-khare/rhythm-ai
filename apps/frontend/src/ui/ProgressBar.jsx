export default function ProgressBar({
  value,
  color = "purple",
  height = "h-3",
}) {
  const colors = {
    purple: "bg-purple-600",
    pink: "bg-pink-500",
    yellow: "bg-yellow-400",
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
  };

  return (
    <div className={`w-full ${height} rounded-full bg-gray-200 overflow-hidden`}>

      <div
        className={`${height} rounded-full transition-all duration-700 ${colors[color]}`}
        style={{
          width: `${value}%`,
        }}
      />

    </div>
  );
}