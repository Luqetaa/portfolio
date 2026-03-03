export default function NavItem({ id, label, icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm tracking-widest transition-colors ${
        isActive ? "text-[#caf0e0]" : "text-[#8dd4c9] hover:text-[#caf0e0]"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
