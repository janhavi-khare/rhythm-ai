import { COLORS, RADIUS } from "../styles/theme";

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {

  const color = COLORS[variant];

  return (
    <button
      {...props}
      className={`
        px-5
        py-3
        ${RADIUS.button}
        ${color.bg}
        ${color.text}
        font-medium
        transition
        hover:opacity-90
        ${className}
      `}
    >
      {children}
    </button>
  );
}