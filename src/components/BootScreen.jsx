import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalCursor from "./TerminalCursor";

const bootLines = [
  "INITIALIZING PORTFOLIO_OS v1.0",
  "SCANNING HARDWARE...",
  "CPU DETECTED ✓",
  "MEMORY CHECK ✓",
  "GPU ONLINE ✓",
  "NETWORK CONNECTED ✓",
  "AUTHENTICATING USER...",
  "ACCESS GRANTED ✓",
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
    }, 35);

    if (
      charIndex === bootLines[lineIndex].length &&
      bootLines[lineIndex] === "ACCESS GRANTED ✓"
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
      }, 200);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, lineIndex]);

  useEffect(() => {
    if (lineIndex < bootLines.length) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8;

        if (next >= 100) {
          clearInterval(interval);
          setBootFinished(true);

          
          return 100;
        }

        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [lineIndex, onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        onMouseEnter={() => setInsideTerminal(true)}
        onMouseLeave={() => setInsideTerminal(false)}
        style={{
          cursor: insideTerminal ? "none" : "default",
        }}
        className={`boot-active fixed inset-0 bg-black flex items-center justify-center scanlines vignette ${
          glitch ? "glitch" : ""
        }`}
      >
        <TerminalCursor enabled={insideTerminal} />
        <div className="font-terminal crt text-[#00ff9f] text-sm space-y-1 drop-shadow-[0_0_6px_#00ff9f]">

          {displayedLines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}

          {lineIndex < bootLines.length && (
            <p>
              {currentLine}
              <motion.span
                animate={{ opacity: [0, 1, 0, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.3,
                  times: [0, 0.4, 0.6, 1],
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
                  <div className="w-[320px] h-4 border border-[#00ff9f] p-0.5">
                    <motion.div
                      className="h-full bg-[#00ff9f]"
                      animate={{ width: `${progress}%` }}
                    />
                  </div>

                  <p>{Math.floor(progress)}%</p>
                </>
              ) : (
                <button data-cursor
                  onClick={onFinish}
                  className="border border-[#00ff9f] px-4 py-2 hover:bg-[#00ff9f] hover:text-black transition"
                >
                  ENTER SYSTEM →
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}