export default function ScanlineBox({ 
  children, 
  className = "", 
  title = "",
  glowing = false 
}) {
  return (
    <div className={`relative border border-[#caf0e0]/30 bg-[#0a0b0b]/50 ${glowing ? "shadow-lg shadow-[#caf0e0]/20" : ""} ${className}`}>
      <div className="scanlines absolute inset-0 pointer-events-none opacity-50" />
      
      {title && (
        <div className="absolute -top-3 left-4 bg-[#090a0a] px-2">
          <span className="text-xs text-[#8dd4c9] font-mono">[ {title} ]</span>
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
