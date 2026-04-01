import { motion } from "framer-motion";
import { useTheme } from "../../utils/themeContext.jsx";

export default function ContactSection() {
  const { theme } = useTheme();
  const accentColor = theme.primary || "#7DF056";

  return (
    <section 
      data-section="contact" 
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#050505] p-6 md:p-12 selection:bg-white selection:text-black"
      style={{ fontFamily: "'DotGothic16', sans-serif" }}
    >
      {/* Film Grain effect */}
      <div className="film-grain" />

      {/* Background Huge Text "CONTACT" - Encostado no rodapé */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center items-end pointer-events-none select-none z-0 overflow-hidden opacity-30 mix-blend-screen md:translate-y-[6%] translate-y-[4%]">
        <span 
          className="font-mono font-black tracking-tighter"
          style={{
            fontSize: "36vw",
            lineHeight: 0.7,
            color: "transparent",
            backgroundImage: `repeating-linear-gradient(to bottom, ${accentColor} 0px, ${accentColor} 6px, transparent 6px, transparent 12px)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            textShadow: `0 0 40px ${accentColor}20`,
          }}
        >
          CONTACT
        </span>
      </div>

      {/* Frame Corners */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 z-20" style={{ borderColor: accentColor }} />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 z-20" style={{ borderColor: accentColor }} />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 z-20" style={{ borderColor: accentColor }} />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 z-20" style={{ borderColor: accentColor }} />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full min-h-[85vh]">
        
        {/* ROW 1: Top Nav */}
        <div className="flex justify-between items-center w-full text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.4em] uppercase font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>
          <span className="hidden md:inline">SYSTEM TESTED</span>
          <span className="md:hidden">SYS.TEST</span>
          <span>/</span>
          <span className="hidden md:inline">DEVELOPED FOR HIGH OUTPUT</span>
          <span className="md:hidden">HIGH OUTPUT</span>
          <span>/</span>
          <span>CREATIVE ENGAGEMENT</span>
        </div>

        {/* MIDDLE SECTION - Huge Typography */}
        <div className="flex flex-col items-center justify-center w-full gap-4 md:gap-8 my-auto pt-10">
          
          {/* ROW 2: Status */}
          <div className="flex justify-between items-center w-full max-w-4xl text-[12px] md:text-lg tracking-[0.4em] uppercase font-bold mb-4 md:mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
            <span style={{ color: accentColor }}>:</span>
            <span>CONTINUOUS</span>
            <span style={{ color: accentColor }}>:</span>
            <span>DELIVERED</span>
            <span style={{ color: accentColor }}>:</span>
          </div>

          {/* ROW 3: Name */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full text-center"
          >
            <h2 
              className="font-mono text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-bold uppercase tracking-widest whitespace-nowrap"
              style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}40` }}
            >
              LUCAS CAVALCANTE
            </h2>
          </motion.div>

          {/* ROW 4: Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4 md:gap-12 w-full text-center mt-2"
          >
            <a href="https://github.com/Luqetaa" target="_blank" rel="noreferrer" className="flex-1 text-right text-4xl md:text-7xl lg:text-[6rem] text-white hover:text-black hover:bg-white transition-colors px-2 uppercase tracking-[0.1em]">
              GITHUB
            </a>
            <span className="text-2xl md:text-6xl text-white opacity-60 tracking-tighter shrink-0">---</span>
            <a href="https://www.linkedin.com/in/lucas-cavalcante-67a875318/" target="_blank" rel="noreferrer" className="flex-1 text-left text-4xl md:text-7xl lg:text-[6rem] text-white hover:text-black hover:bg-white transition-colors px-2 uppercase tracking-[0.1em]">
              LINKEDIN
            </a>
          </motion.div>

          {/* ROW 5: Email/Year */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 md:gap-12 w-full text-center mt-4"
          >
            <a href="mailto:lu.cavalcante.jd@gmail.com" className="text-4xl md:text-7xl lg:text-[6rem] text-white tracking-[0.1em] hover:text-black hover:bg-white px-2 transition-colors uppercase">
              (EMAIL)
            </a>
            <span className="text-3xl md:text-6xl lg:text-7xl text-white opacity-80 tracking-widest pl-4 md:pl-10 border-l-4" style={{ borderColor: accentColor }}>
              © 2026
            </span>
          </motion.div>
        </div>

        {/* ROW 6: Bottom Footer */}
        <div className="flex justify-between items-center w-full text-[9px] md:text-sm tracking-[0.2em] md:tracking-[0.4em] uppercase font-bold text-center mt-12 md:mt-20" style={{ color: accentColor }}>
          <span className="hidden md:block">THE CODE NEVER SLEEPS</span>
          <span className="hidden md:block">CLOSED-LOOP PROTOCOLS</span>
          <span className="block w-full md:w-auto">AUTONOMOUS OPERATIONS</span>
        </div>

      </div>
    </section>
  );
}

