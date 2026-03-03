import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "../../utils/themeContext.jsx";

const SERIF = "'Playfair Display', Georgia, serif";

// Block shading characters — ordered light → solid
const SHADES = [" ", "░", "░", "▒", "▒", "▓", "█", "▓", "▒"];
const FLICKER = ["·", "∘", "○", "◌"];

// Build a static map of which (row, col) cells are "on" for the orb
const ROWS = 32;
const COLS = 80;
const CX   = COLS / 2;
const CY   = ROWS / 2;
const RX   = COLS * 0.44;
const RY   = ROWS * 0.42;

function cellChar(row, col) {
  const dx = (col - CX) / RX;
  const dy = (row - CY) / RY;
  const d  = Math.sqrt(dx * dx + dy * dy);

  if (d > 1.02 || d < 0.48) return " "; // outside or deep inside

  // distance from hollow centre (0.48) to outer (1.02)
  const t = (d - 0.48) / (1.02 - 0.48); // 0 = inner edge, 1 = outer edge

  // bell curve: SHADES peak in the middle of the ring thickness
  const bell = 1 - Math.abs(t - 0.5) * 2; // 0..1
  const idx = Math.floor(bell * (SHADES.length - 1));

  // sparse flicker dots near poles
  const pole = Math.abs(dy) / (RY / RY);
  if (pole > 0.72 && Math.random() < 0.35) {
    return FLICKER[Math.floor(Math.random() * FLICKER.length)];
  }

  // thin out density near top/bottom poles
  const keepChance = 1 - Math.abs(row - CY) / (ROWS * 0.6);
  if (Math.random() > keepChance) return " ";

  // add tiny random shimmer: occasionally drop one shade
  const shimmer = Math.random() < 0.15 ? -1 : 0;
  return SHADES[Math.max(0, idx + shimmer)];
}

function buildFrame() {
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => cellChar(r, c)).join("")
  );
}

function AsciiOrb() {
  const { theme } = useTheme();
  const [frame, setFrame] = useState(() => buildFrame());

  useEffect(() => {
    const id = setInterval(() => setFrame(buildFrame()), 90);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.pre
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="font-mono text-[14px] leading-tight select-none pointer-events-none"
      style={{
        color: `${theme.primary}90`,
        textShadow: `0 0 10px ${theme.primary}60`,
      }}
    >
      {frame.join("\n")}
    </motion.pre>
  );
}

export default function HeroSection() {
  const { theme } = useTheme();

  return (
    <section
      data-section="hero"
      className="relative min-h-screen flex flex-col overflow-hidden pt-24"
    >
      {/* ── TOP METADATA BAR ── */}
      <div className="relative z-10 flex items-start justify-between px-6 md:px-10 pt-4">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-[10px] leading-5 tracking-widest max-w-45"
          style={{ color: `${theme.secondary}80` }}
        >
          <p>Software Engineer</p>
          <p>São Paulo, Brasil</p>
        </motion.div>

        {/* Center */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-[10px] tracking-widest text-center"
          style={{ color: `${theme.secondary}80` }}
        >
          <p>Back-End · Front-End · IoT</p>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-mono text-[10px] tracking-widest text-right"
          style={{ color: `${theme.secondary}80` }}
        >
          <div className="flex items-center justify-end gap-2">
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: theme.primary }}
            />
            <span style={{ color: theme.primary }}>DISPONÍVEL</span>
          </div>
          <p>UTC−3</p>
        </motion.div>
      </div>

      {/* ── ASCII ORB (center) ── */}
      <div className="flex-1 flex items-center justify-center py-6 relative z-10">
        <AsciiOrb />
      </div>

      {/* ── MASSIVE BRUTALIST NAME ── */}
      <div className="relative z-10 px-2 md:px-4 pb-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="leading-[0.85] tracking-tight select-none whitespace-nowrap"
            style={{
              fontFamily: SERIF,
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(4rem, 13vw, 12rem)",
              color: theme.primary,
              textShadow: `0 0 80px ${theme.primary}30`,
            }}
          >
            Lucas
          </h1>
          <h1
            className="leading-[0.85] tracking-tight select-none whitespace-nowrap"
            style={{
              fontFamily: SERIF,
              fontWeight: 900,
              fontSize: "clamp(4rem, 13vw, 12rem)",
              color: "transparent",
              WebkitTextStroke: `1.5px ${theme.primary}`,
              textShadow: `0 0 60px ${theme.primary}20`,
            }}
          >
            Cavalcante
          </h1>
        </motion.div>

        {/* ── CTA + divider row ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="flex items-center justify-between py-5 border-t mt-4"
          style={{ borderColor: `${theme.primary}25` }}
        >
          {/* Left: role label */}
          <span
            className="font-mono text-xs tracking-[0.25em]"
            style={{ color: `${theme.secondary}70` }}
          >
            01 / INIT
          </span>

          {/* Center: CTAs */}
          <div className="flex items-center gap-6 md:gap-10">
            <motion.button
              data-cursor
              whileHover={{ y: -1 }}
              className="font-mono text-xs tracking-widest border px-5 py-2 transition-all duration-200 hover:opacity-80"
              style={{ borderColor: `${theme.primary}50`, color: theme.primary }}
              onClick={() => document.querySelector("[data-section=projects]")?.scrollIntoView({ behavior: "smooth" })}
            >
              SEE WORK →
            </motion.button>
            <motion.button
              data-cursor
              whileHover={{ y: -1 }}
              className="font-mono text-xs tracking-widest border px-5 py-2 transition-all duration-200 hover:opacity-80"
              style={{ borderColor: theme.accent, color: theme.accent }}
              onClick={() => document.querySelector("[data-section=contact]")?.scrollIntoView({ behavior: "smooth" })}
            >
              CONTACT →
            </motion.button>
            <motion.a
              data-cursor
              href="/cv.pdf"
              download
              whileHover={{ y: -1 }}
              className="font-mono text-xs tracking-widest transition-all duration-200 hover:opacity-80 hidden md:block"
              style={{ color: `${theme.secondary}70` }}
            >
              ↓ CV
            </motion.a>
          </div>

          {/* Right: scroll cue */}
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[10px] tracking-widest"
              style={{ color: `${theme.secondary}50` }}
            >
              SCROLL
            </span>
            <motion.div
              className="w-px h-8"
              style={{ background: `linear-gradient(to bottom, ${theme.primary}, transparent)` }}
              animate={{ scaleY: [0, 1, 0], originY: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
