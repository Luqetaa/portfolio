import { motion } from "framer-motion";
import { useMousePosition } from "../hooks/useMousePosition";
import { useTheme } from "../../utils/themeContext.jsx";
import AsciiArt from "../ui/AsciiArt";
import GlitchText from "../ui/GlitchText";

const heroAscii = `
 ╔╦╗╔═╗╦═╗╔═╗╔╦╗╦ ╦╔═╗╔╗╔
 ║║║╠═╣╠╦╝╠═╣ ║ ╠═╣║ ║║║║
 ╩ ╩╩ ╩╩╚═╩ ╩ ╩ ╩ ╩╚═╝╝╚╝
 PORTFOLIO v2.0 / FULL-STACK / GAME UI / CREATIVE
`;

export default function HeroSection() {
  const { theme } = useTheme();
  const mousePos = useMousePosition();

  const parallax = {
    x: (mousePos.x - window.innerWidth / 2) * 0.04,
    y: (mousePos.y - window.innerHeight / 2) * 0.04,
  };

  return (
    <section
      data-section="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, ${theme.primary}22 25%, ${theme.primary}22 26%, transparent 27%, transparent 74%, ${theme.primary}22 75%, ${theme.primary}22 76%, transparent 77%), linear-gradient(90deg, transparent 24%, ${theme.primary}22 25%, ${theme.primary}22 26%, transparent 27%, transparent 74%, ${theme.primary}22 75%, ${theme.primary}22 76%, transparent 77%)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Parallax orbs */}
      <motion.div
        className="absolute w-500px h-500px rounded-full pointer-events-none blur-3xl"
        style={{ background: theme.primary, top: "5%", left: "5%", x: parallax.x * 3, y: parallax.y * 3, opacity: 0.08 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none blur-3xl"
        style={{ background: theme.accent, bottom: "5%", right: "5%", x: parallax.x * -2, y: parallax.y * -2, opacity: 0.08 }}
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full pointer-events-none blur-2xl"
        style={{ background: theme.secondary, top: "40%", right: "20%", x: parallax.x * 1.5, y: parallax.y * 1.5, opacity: 0.05 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        className="text-center space-y-8 relative z-10 max-w-5xl px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <AsciiArt art={heroAscii} animateIn delay={0} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-3"
        >
          <p className="font-mono tracking-widest text-sm md:text-base" style={{ color: theme.secondary }}>
            Full-Stack Engineer  Game UI Designer  Creative Developer
          </p>
          <GlitchText
            text="Building immersive digital experiences"
            className="text-xs md:text-sm tracking-widest"
            glitchChance={0.15}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex justify-center gap-2"
          style={{ color: theme.primary }}
        >
          <span>=======</span>
          <span className="animate-pulse">+</span>
          <span>=======</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col md:flex-row gap-6 justify-center pt-4"
        >
          <motion.button
            data-cursor
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border px-8 py-3 font-mono text-sm tracking-widest transition-colors duration-300"
            style={{ borderColor: theme.primary, color: theme.primary }}
            onClick={() => document.querySelector("[data-section=projects]")?.scrollIntoView({ behavior: "smooth" })}
          >
            EXPLORE PORTFOLIO
          </motion.button>
          <motion.button
            data-cursor
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border px-8 py-3 font-mono text-sm tracking-widest transition-colors duration-300"
            style={{ borderColor: theme.accent, color: theme.accent }}
            onClick={() => document.querySelector("[data-section=contact]")?.scrollIntoView({ behavior: "smooth" })}
          >
            GET IN TOUCH
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-xs flex justify-center gap-4 pt-8 flex-wrap"
          style={{ color: `${theme.secondary}80` }}
        >
          <span style={{ color: theme.primary }}>[ ONLINE ]</span>
          <span>STATUS: ACTIVE</span>
          <span style={{ color: theme.primary }}>[ MODE ]</span>
          <span>CREATIVE</span>
          <span style={{ color: theme.primary }}>[ UTC-3 ]</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs font-mono tracking-widest" style={{ color: `${theme.secondary}60` }}>SCROLL</span>
        <motion.div
          className="w-px h-12"
          style={{ background: `linear-gradient(to bottom, ${theme.primary}, transparent)` }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
