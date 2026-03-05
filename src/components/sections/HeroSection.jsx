import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../../utils/themeContext.jsx";

const SERIF = "'Playfair Display', Georgia, serif";

/* ═══════════════════════════════════════════════════════
   ASCII SPACE INVADERS — playable mini-game
   ═══════════════════════════════════════════════════════ */
const GAME_COLS = 70;
const GAME_ROWS = 26;
const EMPTY = " ";

// ── Elaborate 5-wide invader sprites (2 animation frames each) ──
const INVADER_FRAMES = [
  // Type 0 — Squid
  [
    [" ╔█╗ ", "▐███▌", "╚╩╩╩╝", " ┘ └ "],
    [" ╔█╗ ", "▐███▌", "╚╩╩╩╝", " └ ┘ "],
  ],
  // Type 1 — Crab
  [
    [" ┌█┐ ", "█▀▀▀█", "╠═╦═╣", " ╙ ╜ "],
    [" ┌█┐ ", "█▀▀▀█", "╠═╦═╣", "╙   ╜"],
  ],
  // Type 2 — Octopus
  [
    [" ▄█▄ ", "▐╬█╬▌", "║╬╬╬║", " ╘ ╛ "],
    [" ▄█▄ ", "▐╬█╬▌", "║╬╬╬║", "╘   ╛"],
  ],
];

const PLAYER_ART = [
  "  ║  ",
  " ╔█╗ ",
  "╠███╣",
  "╚═══╝",
];

function createInvaders() {
  const invaders = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      invaders.push({
        x: 4 + col * 7,
        y: 2 + row * 5,
        type: row % 3,
        alive: true,
      });
    }
  }
  return invaders;
}

// ── Start / Game-Over screen ASCII art ──
function renderStartScreen() {
  const lines = [];
  const pad = (s) => {
    const left = Math.floor((GAME_COLS - s.length) / 2);
    return " ".repeat(Math.max(0, left)) + s;
  };
  lines.push("");
  lines.push("");
  lines.push("");
  lines.push(pad("░███     ░███ ░██           ░██     ░██████                                       "));
  lines.push(pad("░████   ░████                      ░██   ░██                                      "));
  lines.push(pad("░██░██ ░██░██ ░██░████████  ░██   ░██         ░██████   ░█████████████   ░███████ "));
  lines.push(pad("░██ ░████ ░██ ░██░██    ░██ ░██   ░██  █████       ░██  ░██   ░██   ░██ ░██    ░██"));
  lines.push(pad("░██  ░██  ░██ ░██░██    ░██ ░██   ░██     ██  ░███████  ░██   ░██   ░██ ░█████████"));
  lines.push(pad("░██       ░██ ░██░██    ░██ ░██    ░██  ░███ ░██   ░██  ░██   ░██   ░██ ░██       "));
  lines.push(pad("░██       ░██ ░██░██    ░██ ░██     ░█████░█  ░█████░██ ░██   ░██   ░██  ░███████ "));
  lines.push("");
  lines.push("");
  lines.push(pad("[  PRESS  ENTER  TO  START  ]"));
  lines.push("");
  lines.push(pad("◂ ▸  MOVE     ▲  FIRE"));
  while (lines.length < GAME_ROWS) lines.push("");
  return lines.join("\n");
}

function renderGameOverScreen(win, score) {
  const lines = [];
  const pad = (s) => {
    const left = Math.floor((GAME_COLS - s.length) / 2);
    return " ".repeat(Math.max(0, left)) + s;
  };
  lines.push("");
  lines.push("");
  lines.push("");
  if (win) {
    lines.push(pad(" ██▒   █▓ ██▓ ▄████▄  ▄▄▄█████▓ ▒█████   ██▀███ ▓██   ██▓"));
    lines.push(pad("▓██░   █▒▓██▒▒██▀ ▀█  ▓  ██▒ ▓▒▒██▒  ██▒▓██ ▒ ██▒▒██  ██▒"));
    lines.push(pad(" ▓██  █▒░▒██▒▒▓█    ▄ ▒ ▓██░ ▒░▒██░  ██▒▓██ ░▄█ ▒ ▒██ ██░"));
    lines.push(pad("  ▒██ █░░░██░▒▓▓▄ ▄██▒░ ▓██▓ ░ ▒██   ██░▒██▀▀█▄   ░ ▐██▓░"));
    lines.push(pad("   ▒▀█░  ░██░▒ ▓███▀ ░  ▒██▒ ░ ░ ████▓▒░░██▓ ▒██▒ ░ ██▒▓░"));
    lines.push(pad("   ░ ▐░  ░▓  ░ ░▒ ▒  ░  ▒ ░░   ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░  ██▒▒▒"));
    lines.push(pad("   ░ ░░   ▒ ░  ░  ▒     ░  ░     ░ ▒ ▒░   ░▒ ░ ▒░▓██ ░▒░ "));
    lines.push(pad("     ░░   ▒ ░░          ░        ░ ░ ░ ▒    ░░   ░ ▒ ▒ ░░  "));
    lines.push(pad("      ░   ░  ░ ░        ░            ░ ░     ░   ░ ░ ░     "));
  } else {
    lines.push(pad("  ▄████  ▄▄▄       ███▄ ▄███▓▓█████      ▒█████   ██▒   █▓▓█████  ██▀███  "));
    lines.push(pad(" ██▒ ▀█▒▒████▄    ▓██▒▀█▀ ██▒▓█   ▀     ▒██▒  ██▒▓██░   █▒▓█   ▀ ▓██ ▒ ██▒"));
    lines.push(pad("▒██░▄▄▄░▒██  ▀█▄  ▓██    ▓██░▒███       ▒██░  ██▒ ▓██  █▒░▒███   ▓██ ░▄█ ▒"));
    lines.push(pad("░▓█  ██▓░██▄▄▄▄██ ▒██    ▒██ ▒▓█  ▄     ▒██   ██░  ▒██ █░░▒▓█  ▄ ▒██▀▀█▄  "));
    lines.push(pad("░▒▓███▀▒ ▓█   ▓██▒▒██▒   ░██▒░▒████▒    ░ ████▓▒░   ▒▀█░  ░▒████▒░██▓ ▒██▒"));
    lines.push(pad(" ░▒   ▒  ▒▒   ▓▒█░░ ▒░   ░  ░░░ ▒░ ░    ░ ▒░▒░▒░   ░ ▐░  ░░ ▒░ ░░ ▒▓ ░▒▓░"));
    lines.push(pad("  ░   ░   ▒   ▒▒ ░░  ░      ░ ░ ░  ░      ░ ▒ ▒░   ░ ░░   ░ ░  ░  ░▒ ░ ▒░"));
    lines.push(pad("░ ░   ░   ░   ▒   ░      ░      ░       ░ ░ ░ ▒      ░░     ░      ░░   ░ "));
    lines.push(pad("      ░       ░  ░       ░      ░  ░        ░ ░       ░     ░  ░    ░     "));
  }
  lines.push("");
  lines.push("");
  lines.push(pad("[  PRESS  R  TO  RESTART  ]"));
  while (lines.length < GAME_ROWS) lines.push("");
  return lines.join("\n");
}

function AsciiSpaceInvaders() {
  const { theme } = useTheme();
  const gameRef = useRef({
    state: "start",        // "start" | "playing" | "over"
    player: { x: Math.floor(GAME_COLS / 2) - 2 },
    invaders: createInvaders(),
    bullets: [],
    enemyBullets: [],
    explosions: [],
    dir: 1,
    moveTimer: 0,
    frame: 0,
    score: 0,
    win: false,
  });
  const keysRef = useRef({});
  const [display, setDisplay] = useState("");

  // Keyboard input
  useEffect(() => {
    const down = (e) => { keysRef.current[e.key] = true; };
    const up   = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const render = useCallback(() => {
    const g = gameRef.current;
    const grid = Array.from({ length: GAME_ROWS }, () =>
      Array(GAME_COLS).fill(EMPTY)
    );

    const f = g.frame;

    // Draw invaders (animated)
    g.invaders.forEach((inv) => {
      if (!inv.alive) return;
      const shape = INVADER_FRAMES[inv.type][f];
      shape.forEach((row, ry) => {
        for (let cx = 0; cx < row.length; cx++) {
          const gx = inv.x + cx;
          const gy = inv.y + ry;
          if (gx >= 0 && gx < GAME_COLS && gy >= 0 && gy < GAME_ROWS && row[cx] !== " ") {
            grid[gy][gx] = row[cx];
          }
        }
      });
    });

    // Draw explosions
    const BOOM = ["*", "×", "✦", "◆", "✶"];
    g.explosions.forEach((e) => {
      if (e.x >= 0 && e.x < GAME_COLS && e.y >= 0 && e.y < GAME_ROWS) {
        grid[e.y][e.x] = BOOM[Math.floor(Math.random() * BOOM.length)];
      }
    });

    // Draw player bullets
    g.bullets.forEach((b) => {
      if (b.y >= 0 && b.y < GAME_ROWS && b.x >= 0 && b.x < GAME_COLS) grid[b.y][b.x] = "│";
      if (b.y - 1 >= 0 && b.y - 1 < GAME_ROWS && b.x >= 0 && b.x < GAME_COLS) grid[b.y - 1][b.x] = "╽";
    });

    // Draw enemy bullets
    g.enemyBullets.forEach((b) => {
      if (b.y >= 0 && b.y < GAME_ROWS && b.x >= 0 && b.x < GAME_COLS) grid[b.y][b.x] = "╿";
      if (b.y + 1 >= 0 && b.y + 1 < GAME_ROWS && b.x >= 0 && b.x < GAME_COLS) grid[b.y + 1][b.x] = "┊";
    });

    // Draw player ship
    PLAYER_ART.forEach((row, ry) => {
      for (let cx = 0; cx < row.length; cx++) {
        const gx = g.player.x + cx;
        const gy = GAME_ROWS - PLAYER_ART.length + ry;
        if (gx >= 0 && gx < GAME_COLS && row[cx] !== " ") {
          grid[gy][gx] = row[cx];
        }
      }
    });

    // ── HUD ──
    const scoreTxt = `▸ SCORE: ${String(g.score).padStart(4, "0")}`;
    const helpTxt = "◂ ▸ MOVE  ▲ FIRE";
    const hud = `${scoreTxt}  ${helpTxt}`;
    for (let i = 0; i < hud.length && i < GAME_COLS; i++) {
      grid[0][i + 1] = hud[i];
    }
    // Bottom border line
    for (let i = 0; i < GAME_COLS; i++) grid[GAME_ROWS - PLAYER_ART.length - 1][i] = "─";

    return grid.map((row) => row.join("")).join("\n");
  }, []);

  // Game loop
  useEffect(() => {
    const tick = () => {
      const g = gameRef.current;
      const keys = keysRef.current;

      // ── Start screen ──
      if (g.state === "start") {
        if (keys["Enter"]) {
          g.state = "playing";
          keys["Enter"] = false;
        }
        setDisplay(renderStartScreen());
        return;
      }

      // ── Game-over screen ──
      if (g.state === "over") {
        if (keys["r"] || keys["R"]) {
          g.player.x = Math.floor(GAME_COLS / 2) - 2;
          g.invaders = createInvaders();
          g.bullets = [];
          g.enemyBullets = [];
          g.explosions = [];
          g.dir = 1;
          g.moveTimer = 0;
          g.frame = 0;
          g.score = 0;
          g.win = false;
          g.state = "playing";
        }
        setDisplay(renderGameOverScreen(g.win, g.score));
        return;
      }

      // Player movement
      if ((keys["ArrowLeft"] || keys["a"]) && g.player.x > 0) g.player.x -= 1;
      if ((keys["ArrowRight"] || keys["d"]) && g.player.x < GAME_COLS - 5) g.player.x += 1;

      // Shoot
      if (keys[" "] || keys["ArrowUp"]) {
        if (g.bullets.length < 3) {
          g.bullets.push({ x: g.player.x + 2, y: GAME_ROWS - PLAYER_ART.length - 1 });
        }
        keys[" "] = false;
        keys["ArrowUp"] = false;
      }

      // Tick explosions
      g.explosions = g.explosions.map((e) => ({ ...e, ttl: e.ttl - 1 })).filter((e) => e.ttl > 0);

      // Move bullets
      g.bullets = g.bullets.map((b) => ({ ...b, y: b.y - 1 })).filter((b) => b.y >= 0);
      g.enemyBullets = g.enemyBullets.map((b) => ({ ...b, y: b.y + 1 })).filter((b) => b.y < GAME_ROWS);

      // Bullet-invader collision
      g.bullets = g.bullets.filter((b) => {
        for (const inv of g.invaders) {
          if (!inv.alive) continue;
          if (b.x >= inv.x && b.x < inv.x + 5 && b.y >= inv.y && b.y < inv.y + 4) {
            inv.alive = false;
            g.score += (2 - inv.type) * 10 + 10;
            g.explosions.push({ x: inv.x + 2, y: inv.y + 1, ttl: 4 });
            return false;
          }
        }
        return true;
      });

      // Enemy bullet-player collision
      const py = GAME_ROWS - PLAYER_ART.length;
      for (const b of g.enemyBullets) {
        if (b.y >= py && b.x >= g.player.x && b.x < g.player.x + 5) {
          g.state = "over";
          break;
        }
      }

      // Move invaders
      g.moveTimer++;
      if (g.moveTimer >= 8) {
        g.moveTimer = 0;
        g.frame = g.frame === 0 ? 1 : 0; // toggle animation frame
        let edgeHit = false;
        g.invaders.forEach((inv) => {
          if (!inv.alive) return;
          if ((g.dir > 0 && inv.x + 5 >= GAME_COLS - 1) || (g.dir < 0 && inv.x <= 1)) edgeHit = true;
        });
        if (edgeHit) {
          g.dir *= -1;
          g.invaders.forEach((inv) => { if (inv.alive) inv.y += 1; });
        } else {
          g.invaders.forEach((inv) => { if (inv.alive) inv.x += g.dir; });
        }

        // Random enemy fire
        const alive = g.invaders.filter((i) => i.alive);
        if (alive.length > 0 && Math.random() < 0.35) {
          const shooter = alive[Math.floor(Math.random() * alive.length)];
          g.enemyBullets.push({ x: shooter.x + 2, y: shooter.y + 4 });
        }
      }

      // Check invaders reach bottom
      g.invaders.forEach((inv) => {
        if (inv.alive && inv.y + 4 >= GAME_ROWS - PLAYER_ART.length) g.state = "over";
      });

      // Check win
      if (g.invaders.every((i) => !i.alive)) {
        g.state = "over";
        g.win = true;
      }

      setDisplay(render());
    };

    const id = setInterval(tick, 80);
    return () => clearInterval(id);
  }, [render]);

  return (
    <div
      style={{
        /* Pixelated text rendering — disables font smoothing for blocky retro look */
        WebkitFontSmoothing: "none",
        MozOsxFontSmoothing: "grayscale",
        fontSmooth: "never",
        textRendering: "optimizeSpeed",
      }}
    >
      <motion.pre
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="font-mono text-[7px] sm:text-[10px] md:text-[13px] leading-tight select-none outline-none"
        style={{
          color: theme.primary,
          textShadow: [
            `0 0 4px ${theme.primary}`,
            `0 0 12px ${theme.primary}aa`,
            `0 0 28px ${theme.primary}55`,
            `0 0 50px ${theme.primary}25`,
          ].join(", "),
          filter: `drop-shadow(0 0 2px ${theme.primary}80)`,
          imageRendering: "pixelated",
        }}
        tabIndex={0}
      >
        {display}
      </motion.pre>
    </div>
  );
}

export default function HeroSection() {
  const { theme } = useTheme();

  return (
    <section
      data-section="hero"
      className="relative min-h-screen flex flex-col overflow-hidden pt-24"
    >
      {/* ── CRT overlay (scanlines only on hero) ── */}
      <div className="absolute inset-0 pointer-events-none z-20 scanlines opacity-20" />

      {/* ── TOP METADATA BAR ── */}
      <div className="relative z-10 flex items-start justify-between px-4 sm:px-6 md:px-10 pt-4">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-[10px] leading-5 tracking-widest"
          style={{ color: `${theme.secondary}80` }}
        >
          <p>Software Engineer</p>
          <p className="hidden sm:block">São Paulo, Brasil</p>
        </motion.div>

        {/* Center — hidden on very small screens */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-[10px] tracking-widest text-center hidden sm:block"
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

      {/* ── ASCII SPACE INVADERS (center) ── */}
      <div className="flex flex-1 items-center justify-center py-4 sm:py-6 relative z-10">
        <AsciiSpaceInvaders />
      </div>

      {/* ── MASSIVE BRUTALIST NAME ── */}
      <div className="relative z-10 px-3 sm:px-4 md:px-4 pb-0 overflow-hidden">
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
              fontSize: "clamp(2.2rem, 10vw, 12rem)",
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
              fontSize: "clamp(2.2rem, 10vw, 12rem)",
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
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 py-5 border-t mt-4"
          style={{ borderColor: `${theme.primary}25` }}
        >
          {/* Left: role label */}
          <span
            className="font-mono text-xs tracking-[0.25em] hidden sm:inline"
            style={{ color: `${theme.secondary}70` }}
          >
            01 / INIT
          </span>

          {/* Center: CTAs */}
          <div className="flex items-center gap-3 sm:gap-6 md:gap-10 w-full sm:w-auto">
            <motion.button
              data-cursor
              whileHover={{ y: -1 }}
              className="font-mono text-[10px] sm:text-xs tracking-widest border px-3 sm:px-5 py-2 transition-all duration-200 hover:opacity-80 flex-1 sm:flex-none"
              style={{ borderColor: `${theme.primary}50`, color: theme.primary }}
              onClick={() => document.querySelector("[data-section=projects]")?.scrollIntoView({ behavior: "smooth" })}
            >
              SEE WORK →
            </motion.button>
            <motion.button
              data-cursor
              whileHover={{ y: -1 }}
              className="font-mono text-[10px] sm:text-xs tracking-widest border px-3 sm:px-5 py-2 transition-all duration-200 hover:opacity-80 flex-1 sm:flex-none"
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

          {/* Right: scroll cue — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2">
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
