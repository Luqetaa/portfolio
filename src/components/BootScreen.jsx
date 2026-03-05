import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalCursor from "./TerminalCursor";

const bootlogo = [
   "░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓███████▓▒░▒▓████████▓▒░▒▓█▓▒░▒▓████████▓▒░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓█▓▒░░▒▓██████▓▒░ ",
  "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ",
  "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ",
  "░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ",
  "░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ",
  "░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ",
  "░▒▓█▓▒░       ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░   ░▒▓█▓▒░▒▓█▓▒░      ░▒▓██████▓▒░░▒▓████████▓▒░▒▓█▓▒░░▒▓██████▓▒░  ",
                                                                             
];
const bootLines = [
  "BOOTING PORTFOLIO_OS v2.0...",
  "> [SYS] MOUNTING STACK...            OK",
  "> [NET] CONNECTED TO PORTFOLIO.NET   OK",
  "> [AUTH] ACCESS GRANTED              ✓",
  "> [SYS] INITIALIZING VISUAL ENGINE...",
  "> [SYS] ALL SYSTEMS OPERATIONAL",
];

export default function BootScreen({ onFinish }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bootFinished, setBootFinished] = useState(false);
  const [insideTerminal, setInsideTerminal] = useState(false);
  

  const triggerGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 80);
  };

  /* =========================
     TYPING EFFECT
  ========================= */
  useEffect(() => {
    if (lineIndex >= bootLines.length) return;

    const timeout = setTimeout(() => {
      setCurrentLine(
        bootLines[lineIndex].slice(0, charIndex + 1)
      );

      setCharIndex((prev) => prev + 1);
    }, 15);

    if (
      charIndex === bootLines[lineIndex].length &&
      bootLines[lineIndex].includes("ACCESS GRANTED")
    ) {
      triggerGlitch();
    }

    if (charIndex === bootLines[lineIndex].length) {
      setTimeout(() => {
        setDisplayedLines((prev) => [
          ...prev,
          bootLines[lineIndex],
        ]);

        setCurrentLine("");
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);
      }, 60);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, lineIndex]);

  useEffect(() => {
    if (lineIndex < bootLines.length) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 20 + 8;

        if (next >= 100) {
          clearInterval(interval);
          setBootFinished(true);
          return 100;
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [lineIndex, onFinish]);

  return (
    <AnimatePresence>
      {/* Dark room behind the CRT monitor */}
      <motion.div
        className="boot-active fixed inset-0 bg-[#020202] flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {/* ── CRT Screen ─────────────────────────────────────────────── */}
        <div
          onMouseEnter={() => setInsideTerminal(true)}
          onMouseLeave={() => setInsideTerminal(false)}
          style={{
            cursor: insideTerminal ? "none" : "default",
            pointerEvents: "auto",
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            /* Rounded corners simulate the curved CRT glass tube */
            borderRadius: "24px / 18px",
            overflow: "hidden",
            background: "#090a0a",
            /* Inset shadow gives the screen a recessed depth look */
            boxShadow: [
              "inset 0 0 160px rgba(0,0,0,0.92)",
              "inset 0 0  60px rgba(0,0,0,0.70)",
              "0 0 100px rgba(0,0,0,0.98)",
            ].join(", "),
          }}
          className={`scanlines vignette ${glitch ? "glitch" : ""}`}
        >
          <TerminalCursor enabled={insideTerminal} />

          {/* ── Overlay 1: glass glare (top-left highlight) ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              background:
                "radial-gradient(ellipse at 26% 16%, rgba(255,255,255,0.045) 0%, transparent 52%)",
              pointerEvents: "none",
              zIndex: 50,
            }}
          />

          {/* ── Overlay 2: barrel-edge darkening (simulates curvature bow) ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 48%, rgba(0,0,0,0.72) 100%)",
              pointerEvents: "none",
              zIndex: 49,
            }}
          />

          {/* ── Overlay 3: top & bottom screen-shadow (horizontal curvature) ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.30) 100%)",
              pointerEvents: "none",
              zIndex: 48,
            }}
          />

          {/* ── Overlay 4: left & right vertical shadow ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.22) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.22) 100%)",
              pointerEvents: "none",
              zIndex: 47,
            }}
          />

          {/* ── Screen content ── */}
          <div
            className="font-terminal crt text-[#caf0e0] text-xs sm:text-sm space-y-1 drop-shadow-[0_0_6px_#caf0e0] px-4 sm:px-0 max-w-full overflow-hidden"
            style={{ position: "relative", zIndex: 10 }}
          >
            {/* Desktop Boot Logo */}
            <div className="mb-60 whitespace-pre hidden sm:block">
              {bootlogo.map((line, i) => (
                <p key={i} className="text-lg leading-none">
                  {line}
                </p>
              ))}
            </div>

            {/* Mobile Boot Logo */}
            <div className="mb-12 sm:hidden text-center">
              <p className="text-xl tracking-[0.3em] font-bold" style={{ color: "#caf0e0", textShadow: "0 0 12px #caf0e0" }}>PORTFOLIO_OS</p>
              <p className="text-[10px] tracking-[0.5em] mt-2 opacity-50">v2.0</p>
              <div className="mt-4 mx-auto w-16 h-px" style={{ background: "linear-gradient(90deg, transparent, #caf0e0, transparent)" }} />
            </div>

            {/* Boot Lines */}
            {displayedLines.map((line, i) => (
              <p key={i} className="truncate">{line}</p>
            ))}

            {lineIndex < bootLines.length && (
              <p className="truncate">
                {currentLine}
                <motion.span
                  animate={{ opacity: [0, 1, 0, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    times: [0, 0.2, 0.4, 0.5],
                  }}
                >
                  █
                </motion.span>
              </p>
            )}

            {lineIndex >= bootLines.length && (
              <div className="mt-6 space-y-2">
                <p>SYSTEM BOOTING...</p>

                {!bootFinished ? (
                  <>
                    <div className="w-full max-w-[320px] h-4 border border-[#caf0e0] p-0.5">
                      <motion.div
                        className="h-full bg-[#caf0e0]"
                        animate={{ width: `${progress}%` }}
                      />
                    </div>

                    <p>{Math.floor(progress)}%</p>
                  </>
                ) : (
                  <button
                    data-cursor
                    onClick={onFinish}
                    className="border border-[#caf0e0] px-4 py-2 hover:bg-[#caf0e0] hover:text-black transition pointer-events-auto text-sm"
                    style={{ pointerEvents: "auto" }}
                  >
                    ENTER SYSTEM →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}