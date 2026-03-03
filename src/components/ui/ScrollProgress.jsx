import { useTheme } from "../../utils/themeContext.jsx";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none select-none">
      <span
        className="text-xs font-mono tracking-widest"
        style={{
          color: `${theme.secondary}50`,
          writingMode: "vertical-rl",
          letterSpacing: "0.3em",
        }}
      >
        SCROLL
      </span>

      {/* Track */}
      <div
        className="w-px h-24 relative overflow-hidden"
        style={{ background: `${theme.primary}18` }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full"
          style={{
            background: `linear-gradient(to bottom, ${theme.accent}, ${theme.primary})`,
            scaleY,
            originY: 0,
            height: "100%",
          }}
        />
      </div>

      {/* Diamond tip */}
      <motion.div
        className="w-1.5 h-1.5"
        style={{
          borderTop: `1px solid ${theme.primary}`,
          borderRight: `1px solid ${theme.primary}`,
          opacity: 0.6,
          rotate: 135,
        }}
      />
    </div>
  );
}
