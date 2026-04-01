import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "../../utils/themeContext.jsx";
import { skillsData } from "../../utils/projectsData.js";
import ThreeDBackground from "../three/ThreeDBackground.jsx";
import AsciiSpaceInvaders from "../demos/AsciiSpaceInvaders.jsx";

/* ═══════════════════════════════════════════════════════
   CS2-style Developer Console
   ═══════════════════════════════════════════════════════ */

const WELCOME_LINES = [
  { text: "╔══════════════════════════════════════════════════════╗", type: "system" },
  { text: "║       PORTFOLIO_OS — Developer Console v2.0         ║", type: "system" },
  { text: "╠══════════════════════════════════════════════════════╣", type: "system" },
  { text: "║  Type /help to see available commands                ║", type: "system" },
  { text: "╚══════════════════════════════════════════════════════╝", type: "system" },
  { text: "", type: "system" },
];

function processCommand(input, { switchTheme, themes, currentTheme }) {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  const arg = parts.slice(1).join(" ").toLowerCase();

  switch (cmd) {
    case "/help":
      return [
        { text: "═══ Available Commands ═══", type: "header" },
        { text: "  /help              — Show this help message", type: "info" },
        { text: "  /about             — Display bio & info", type: "info" },
        { text: "  /skills            — List all skills", type: "info" },
        { text: "  /contact           — Show contact info", type: "info" },
        { text: "  /theme             — List available themes", type: "info" },
        { text: "  /theme <name>      — Switch to a theme", type: "info" },
        { text: "  /goto <section>    — Scroll to a section", type: "info" },
        { text: "  /minigame          — Launch Space Invaders", type: "info" },
        { text: "  /clear             — Clear console output", type: "info" },
        { text: "", type: "system" },
      ];

    case "/about":
      return [
        { text: "═══ About ═══", type: "header" },
        { text: "  Lucas Cavalcante", type: "highlight" },
        { text: "  Software Engineer — São Paulo, Brasil", type: "info" },
        { text: "", type: "system" },
        { text: "  Desenvolvedor full-stack focado em criar", type: "info" },
        { text: "  experiências digitais com design limpo", type: "info" },
        { text: "  e engenharia sólida.", type: "info" },
        { text: "", type: "system" },
        { text: "  Stack: React, Node.js, TypeScript, C++, IoT", type: "info" },
        { text: "  Status: Disponível para projetos", type: "success" },
        { text: "", type: "system" },
      ];

    case "/skills": {
      const lines = [{ text: "═══ Skills ═══", type: "header" }];
      Object.entries(skillsData).forEach(([category, skills]) => {
        lines.push({ text: `  [${category.toUpperCase()}]`, type: "highlight" });
        lines.push({ text: `    ${skills.map((s) => `◆ ${s}`).join("  ")}`, type: "info" });
      });
      lines.push({ text: "", type: "system" });
      return lines;
    }

    case "/contact":
      return [
        { text: "═══ Contact ═══", type: "header" },
        { text: "  GitHub     → github.com/Luqetaa", type: "info" },
        { text: "  LinkedIn   → linkedin.com/in/lucas-cavalcante-67a875318/", type: "info" },
        { text: "  Email      → lu.cavalcante.jd@gmail.com", type: "info" },
        { text: "", type: "system" },
      ];

    case "/theme": {
      if (!arg) {
        const themeList = Object.entries(themes).map(
          ([key, t]) => `  ${key === currentTheme ? "▸" : " "} ${key.padEnd(12)} — ${t.name}`
        );
        return [
          { text: "═══ Themes ═══", type: "header" },
          { text: `  Current: ${currentTheme}`, type: "highlight" },
          { text: "", type: "system" },
          ...themeList.map((t) => ({ text: t, type: "info" })),
          { text: "", type: "system" },
          { text: "  Usage: /theme <name>", type: "info" },
          { text: "", type: "system" },
        ];
      }
      if (themes[arg]) {
        switchTheme(arg);
        return [
          { text: `  Theme switched to "${arg}"`, type: "success" },
          { text: "", type: "system" },
        ];
      }
      return [
        { text: `  Unknown theme "${arg}". Type /theme to see options.`, type: "error" },
        { text: "", type: "system" },
      ];
    }

    case "/goto": {
      const sections = ["hero", "about", "projects", "skills", "contact"];
      if (!arg) {
        return [
          { text: "  Usage: /goto <section>", type: "info" },
          { text: `  Available: ${sections.join(", ")}`, type: "info" },
          { text: "", type: "system" },
        ];
      }
      if (sections.includes(arg)) {
        setTimeout(() => {
          document.querySelector(`[data-section="${arg}"]`)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
        return [
          { text: `  Navigating to ${arg}...`, type: "success" },
          { text: "", type: "system" },
        ];
      }
      return [
        { text: `  Unknown section "${arg}". Available: ${sections.join(", ")}`, type: "error" },
        { text: "", type: "system" },
      ];
    }

    case "/minigame":
      return [{ text: "__MINIGAME__", type: "action" }];

    case "/clear":
      return [{ text: "__CLEAR__", type: "action" }];

    default:
      return [
        { text: `  Unknown command: "${trimmed}"`, type: "error" },
        { text: "  Type /help for available commands.", type: "info" },
        { text: "", type: "system" },
      ];
  }
}

function MinigameOverlay({ onClose }) {
  const { theme } = useTheme();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex items-center justify-center"
      style={{ background: `${theme.background}f5` }}
    >
      <ThreeDBackground />

      {/* Close button */}
      <button
        onClick={onClose}
        data-cursor
        className="fixed top-6 right-6 z-61 font-mono text-xs tracking-widest border px-4 py-2 hover:opacity-70 transition-opacity"
        style={{ borderColor: `${theme.primary}50`, color: theme.primary }}
      >
        ESC — CLOSE
      </button>

      {/* Game */}
      <div className="relative z-61">
        <AsciiSpaceInvaders />
      </div>
    </motion.div>
  );
}

export default function GameConsole({ isOpen, onClose }) {
  const { theme, currentTheme, switchTheme, themes } = useTheme();
  const [lines, setLines] = useState([...WELCOME_LINES]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [showMinigame, setShowMinigame] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  // Resizable state
  const [size, setSize] = useState({ width: 680, height: 480 });
  const resizeRef = useRef(null);

  const startResize = useCallback((e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.width;
    const startH = size.height;

    // Set cursor on body so it persists while dragging
    const cursorMap = {
      e: "ew-resize", w: "ew-resize",
      n: "ns-resize", s: "ns-resize",
      se: "nwse-resize", nw: "nwse-resize",
      ne: "nesw-resize", sw: "nesw-resize",
    };
    document.body.style.cursor = cursorMap[direction] || "default";
    document.body.style.userSelect = "none";

    const onMove = (ev) => {
      let newW = startW;
      let newH = startH;
      if (direction.includes("e")) newW = Math.max(400, startW + (ev.clientX - startX));
      if (direction.includes("w")) newW = Math.max(400, startW - (ev.clientX - startX));
      if (direction.includes("s")) newH = Math.max(300, startH + (ev.clientY - startY));
      if (direction.includes("n")) newH = Math.max(300, startH - (ev.clientY - startY));
      setSize({ width: Math.min(newW, window.innerWidth - 40), height: Math.min(newH, window.innerHeight - 40) });
    };
    const onUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [size]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input when console opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Backtick keyboard shortcut
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "`" && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Don't toggle if typing in the console input
        if (document.activeElement === inputRef.current && isOpen) return;
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, isOpen]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;

      // Add command to output
      const newLines = [
        ...lines,
        { text: `> ${trimmed}`, type: "command" },
      ];

      const result = processCommand(trimmed, { switchTheme, themes, currentTheme });

      // Handle special actions
      const isAction = result.length === 1 && result[0].type === "action";
      if (isAction) {
        if (result[0].text === "__CLEAR__") {
          setLines([...WELCOME_LINES]);
          setInput("");
          setHistory((h) => [trimmed, ...h]);
          setHistoryIdx(-1);
          return;
        }
        if (result[0].text === "__MINIGAME__") {
          setLines([...newLines, { text: "  Launching Space Invaders...", type: "success" }, { text: "", type: "system" }]);
          setInput("");
          setHistory((h) => [trimmed, ...h]);
          setHistoryIdx(-1);
          setTimeout(() => {
            setShowMinigame(true);
            onClose(); // close console
          }, 500);
          return;
        }
      }

      setLines([...newLines, ...result]);
      setInput("");
      setHistory((h) => [trimmed, ...h]);
      setHistoryIdx(-1);
    },
    [input, lines, switchTheme, themes, currentTheme, onClose]
  );

  const getLineColor = (type) => {
    switch (type) {
      case "command":   return theme.primary;
      case "header":    return theme.accent;
      case "highlight": return theme.primary;
      case "success":   return "#00ff88";
      case "error":     return "#ff4444";
      case "info":      return `${theme.text}bb`;
      case "system":
      default:          return `${theme.secondary}80`;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          /* Full-viewport constraints layer */
          <motion.div
            ref={constraintsRef}
            className="fixed inset-0 z-54 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Draggable window */}
            <motion.div
              drag
              dragControls={dragControls}
              dragListener={false}
              dragMomentum={false}
              dragConstraints={constraintsRef}
              dragElastic={0}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto absolute flex flex-col rounded-lg overflow-hidden"
              style={{
                top: "10%",
                left: "50%",
                x: "-50%",
                width: `min(${size.width}px, 90vw)`,
                height: `min(${size.height}px, 70vh)`,
                background: `${theme.background}f2`,
                backdropFilter: "blur(12px)",
                border: `1px solid ${theme.primary}30`,
                boxShadow: `0 8px 40px ${theme.primary}20, 0 0 0 1px ${theme.primary}10`,
              }}
            >
              {/* Resize handles */}
              {/* Edges */}
              <div data-resize onMouseDown={(e) => startResize(e, "e")} style={{ position: "absolute", top: 0, right: -3, width: 6, height: "100%", cursor: "ew-resize", "--resize-cursor": "ew-resize", zIndex: 10 }} />
              <div data-resize onMouseDown={(e) => startResize(e, "w")} style={{ position: "absolute", top: 0, left: -3, width: 6, height: "100%", cursor: "ew-resize", "--resize-cursor": "ew-resize", zIndex: 10 }} />
              <div data-resize onMouseDown={(e) => startResize(e, "s")} style={{ position: "absolute", bottom: -3, left: 0, width: "100%", height: 6, cursor: "ns-resize", "--resize-cursor": "ns-resize", zIndex: 10 }} />
              <div data-resize onMouseDown={(e) => startResize(e, "n")} style={{ position: "absolute", top: -3, left: 0, width: "100%", height: 6, cursor: "ns-resize", "--resize-cursor": "ns-resize", zIndex: 10 }} />
              {/* Corners */}
              <div data-resize onMouseDown={(e) => startResize(e, "se")} style={{ position: "absolute", bottom: -3, right: -3, width: 12, height: 12, cursor: "nwse-resize", "--resize-cursor": "nwse-resize", zIndex: 11 }} />
              <div data-resize onMouseDown={(e) => startResize(e, "sw")} style={{ position: "absolute", bottom: -3, left: -3, width: 12, height: 12, cursor: "nesw-resize", "--resize-cursor": "nesw-resize", zIndex: 11 }} />
              <div data-resize onMouseDown={(e) => startResize(e, "ne")} style={{ position: "absolute", top: -3, right: -3, width: 12, height: 12, cursor: "nesw-resize", "--resize-cursor": "nesw-resize", zIndex: 11 }} />
              <div data-resize onMouseDown={(e) => startResize(e, "nw")} style={{ position: "absolute", top: -3, left: -3, width: 12, height: 12, cursor: "nwse-resize", "--resize-cursor": "nwse-resize", zIndex: 11 }} />
              {/* Draggable title bar */}
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex items-center justify-between px-4 py-2 border-b font-mono text-[10px] tracking-widest select-none cursor-grab active:cursor-grabbing"
                style={{ borderColor: `${theme.primary}20`, color: `${theme.secondary}80` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <button
                      onClick={onClose}
                      className="w-3 h-3 rounded-full hover:brightness-125 transition-all"
                      style={{ background: "#ff5f57" }}
                    />
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#febc2e" }}
                    />
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#28c840" }}
                    />
                  </div>
                  <span>DEVELOPER CONSOLE</span>
                </div>
                <div className="flex items-center gap-4">
                  <span style={{ color: `${theme.primary}60` }}>
                    Theme: {themes[currentTheme].name}
                  </span>
                  <button
                    onClick={onClose}
                    data-cursor
                    className="hover:opacity-70 transition-opacity"
                    style={{ color: theme.primary }}
                  >
                    [×]
                  </button>
                </div>
              </div>

            {/* Scrollable output */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div key={i} style={{ color: getLineColor(line.type) }}>
                  <pre className="whitespace-pre-wrap">{line.text || "\u00a0"}</pre>
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center px-4 py-3 border-t font-mono text-sm"
              style={{ borderColor: `${theme.primary}20` }}
            >
              <span style={{ color: theme.primary }} className="mr-2 text-xs">
                &gt;
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    const newIdx = Math.min(historyIdx + 1, history.length - 1);
                    setHistoryIdx(newIdx);
                    if (history[newIdx]) setInput(history[newIdx]);
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    const newIdx = Math.max(historyIdx - 1, -1);
                    setHistoryIdx(newIdx);
                    setInput(newIdx >= 0 ? history[newIdx] : "");
                  } else if (e.key === "Escape") {
                    onClose();
                  }
                }}
                className="flex-1 bg-transparent outline-none text-xs"
                style={{ color: theme.primary, caretColor: theme.primary }}
                placeholder="Type a command..."
                autoComplete="off"
                spellCheck={false}
              />
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-xs"
                style={{ color: theme.primary }}
              >
                █
              </motion.span>
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minigame overlay */}
      <AnimatePresence>
        {showMinigame && (
          <MinigameOverlay onClose={() => setShowMinigame(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
