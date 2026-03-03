export default function AnimatedBorder({ children, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}
