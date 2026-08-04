export default function SectionTitle({ children, className = "" }) {
  return (
    <h2 className={`text-xl md:text-2xl font-bold font-display tracking-tight text-white ${className}`}>
      {children}
    </h2>
  );
}