import { useTheme } from "../../utils/themeContext.jsx";
import { motion, useScroll, useSpring } from "framer-motion";
import { useState, useEffect } from "react";

export default function ScrollProgress() {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Track if we're over a light section
  const [isOnLight, setIsOnLight] = useState(false);
  useEffect(() => {
    const LIGHT_SECTIONS = ["projects", "contact"];
    const update = () => {
      const trigger = window.scrollY + window.innerHeight * 0.5;
      const sections = [
        { id: "hero" }, { id: "projects" }, { id: "skills" }, { id: "contact" },
      ];
      let current = "hero";
      sections.forEach(({ id }) => {
        const el = document.querySelector(`[data-section="${id}"]`);
        if (!el) return;
        if (el.getBoundingClientRect().top + window.scrollY <= trigger) current = id;
      });
      setIsOnLight(LIGHT_SECTIONS.includes(current));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const trackColor = isOnLight ? "#00000018" : `${theme.primary}18`;
  const fillGradient = isOnLight
    ? `linear-gradient(to bottom, ${theme.accent}, #333)`
    : `linear-gradient(to bottom, ${theme.accent}, ${theme.primary})`;
  const labelColor = isOnLight ? "#00000040" : `${theme.secondary}50`;
  const tipColor = isOnLight ? "#333" : theme.primary;

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none select-none">
      <span
        className="text-xs font-mono tracking-widest transition-colors duration-500"
        style={{
          color: labelColor,
          writingMode: "vertical-rl",
          letterSpacing: "0.3em",
        }}
      >
        SCROLL
      </span>

      {/* Track */}
      <div
        className="w-px h-24 relative overflow-hidden transition-colors duration-500"
        style={{ background: trackColor }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full"
          style={{
            background: fillGradient,
            scaleY,
            originY: 0,
            height: "100%",
          }}
        />
      </div>

      {/* Diamond tip */}
      <motion.div
        className="w-1.5 h-1.5 transition-colors duration-500"
        style={{
          borderTop: `1px solid ${tipColor}`,
          borderRight: `1px solid ${tipColor}`,
          opacity: 0.6,
          rotate: 135,
        }}
      />
    </div>
  );
}
