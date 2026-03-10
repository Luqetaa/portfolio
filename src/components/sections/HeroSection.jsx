import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "../../utils/themeContext.jsx";
import { asciiArt } from "../../utils/asciiGenerator.js";

const SERIF = "'Playfair Display', Georgia, serif";

function DecorativeAscii() {
  const { theme } = useTheme();
  const lines = asciiArt.heroLens;
  const [revealedChars, setRevealedChars] = useState(0);
  const totalChars = lines.reduce((sum, l) => sum + l.replace(/ /g, "").length, 0);

  useEffect(() => {
    let frame = 0;
    const id = setInterval(() => {
      frame += 8;
      if (frame >= totalChars) {
        clearInterval(id);
        setRevealedChars(totalChars);
      } else {
        setRevealedChars(frame);
      }
    }, 16);
    return () => clearInterval(id);
  }, [totalChars]);

  let charCount = 0;
  const rendered = lines.map((line) => {
    let result = "";
    for (const ch of line) {
      if (ch === " ") {
        result += " ";
      } else {
        charCount++;
        result += charCount <= revealedChars ? ch : " ";
      }
    }
    return result;
  });

  return (
    <motion.pre
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
      className="font-mono text-[6px] sm:text-[9px] md:text-[11px] lg:text-[13px] leading-tight select-none text-center"
      style={{
        color: `${theme.primary}90`,
        textShadow: `0 0 8px ${theme.primary}40, 0 0 20px ${theme.primary}20`,
        letterSpacing: "0.15em",
      }}
    >
      {rendered.join("\n")}
    </motion.pre>
  );
}

function useClock() {
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 8));
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toTimeString().slice(0, 8)), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function HeroSection() {
  const { theme } = useTheme();
  const time = useClock();

  return (
    <section
      data-section="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
    >
      {/* CRT scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 scanlines opacity-15" />

      {/* ── TOP BAR (Adoratorio style) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex items-start justify-between px-4 sm:px-6 md:px-10 pt-20 sm:pt-24 font-mono text-[10px] tracking-widest"
        style={{ color: `${theme.secondary}70` }}
      >
        <div className="leading-5">
          <p>Software Engineer</p>
          <p className="hidden sm:block">based in São Paulo,</p>
          <p className="hidden sm:block">Brasil.</p>
        </div>

        <div className="hidden sm:block text-center">
          <p>Back-End · Front-End · IoT</p>
        </div>

        <div className="text-right flex items-center gap-4">
          <span className="hidden sm:inline" style={{ color: `${theme.primary}80` }}>{time}</span>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: theme.primary }}
            />
            <span style={{ color: theme.primary }}>DISPONÍVEL</span>
          </div>
        </div>
      </motion.div>

      {/* ── CENTER: Decorative ASCII Art ── */}
      <div className="flex-1 flex items-center justify-center relative z-10 py-8 sm:py-12">
        <DecorativeAscii />
      </div>

      {/* ── BOTTOM: Massive Name (Adoratorio style) ── */}
      <div className="relative z-10 px-3 sm:px-4 md:px-6 pb-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Name — full width massive text */}
          <div className="flex items-baseline gap-2 sm:gap-4 overflow-hidden">
            <h1
              className="leading-[0.85] tracking-tight select-none whitespace-nowrap"
              style={{
                fontFamily: SERIF,
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(2.5rem, 11vw, 14rem)",
                color: theme.primary,
                textShadow: `0 0 80px ${theme.primary}20`,
              }}
            >
              Lucas
            </h1>
            <span
              className="font-mono text-[8px] sm:text-[10px] tracking-widest self-start mt-2 sm:mt-4 hidden sm:inline"
              style={{ color: `${theme.secondary}50` }}
            >
              ®
            </span>
            <h1
              className="leading-[0.85] tracking-tight select-none whitespace-nowrap"
              style={{
                fontFamily: SERIF,
                fontWeight: 900,
                fontSize: "clamp(2.5rem, 11vw, 14rem)",
                color: "transparent",
                WebkitTextStroke: `1.5px ${theme.primary}`,
                textShadow: `0 0 60px ${theme.primary}15`,
              }}
            >
              Cavalcante
            </h1>
          </div>
        </motion.div>

        {/* ── BOTTOM BAR (Adoratorio style) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="flex items-center justify-between py-4 border-t mt-3 font-mono text-[10px] tracking-widest"
          style={{ borderColor: `${theme.primary}20`, color: `${theme.secondary}60` }}
        >
          {/* Left */}
          <button
            data-cursor
            className="hover:opacity-80 transition-opacity"
            style={{ color: theme.primary }}
            onClick={() => document.querySelector("[data-section=projects]")?.scrollIntoView({ behavior: "smooth" })}
          >
            Work
          </button>

          {/* Center: scroll indicator */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span style={{ color: `${theme.secondary}50` }}>↓</span>
            </motion.div>
            <span style={{ color: `${theme.secondary}40` }}>scroll down</span>
          </div>

          {/* Right */}
          <span style={{ color: `${theme.secondary}40` }}>
            01 / INIT
          </span>
        </motion.div>
      </div>
    </section>
  );
}
