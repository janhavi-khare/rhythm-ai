export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        soft-surface
        transition-all
        duration-500
        hover:border-pink-500/20
        hover:shadow-[0_25px_70px_rgba(0,0,0,0.6)]
        p-8 lg:p-10
        text-slate-100
        ${className}
      `}
    >
      {children}
    </div>
  );
}