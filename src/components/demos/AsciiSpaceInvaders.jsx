import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../../utils/themeContext.jsx";

const GAME_COLS = 70;
const GAME_ROWS = 26;
const EMPTY = " ";

const INVADER_FRAMES = [
  [
    [" ╔█╗ ", "▐███▌", "╚╩╩╩╝", " ┘ └ "],
    [" ╔█╗ ", "▐███▌", "╚╩╩╩╝", " └ ┘ "],
  ],
  [
    [" ┌█┐ ", "█▀▀▀█", "╠═╦═╣", " ╙ ╜ "],
    [" ┌█┐ ", "█▀▀▀█", "╠═╦═╣", "╙   ╜"],
  ],
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

export default function AsciiSpaceInvaders() {
  const { theme } = useTheme();
  const gameRef = useRef({
    state: "start",
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

    const BOOM = ["*", "\u00d7", "\u2726", "\u25c6", "\u2736"];
    g.explosions.forEach((e) => {
      if (e.x >= 0 && e.x < GAME_COLS && e.y >= 0 && e.y < GAME_ROWS) {
        grid[e.y][e.x] = BOOM[Math.floor(Math.random() * BOOM.length)];
      }
    });

    g.bullets.forEach((b) => {
      if (b.y >= 0 && b.y < GAME_ROWS && b.x >= 0 && b.x < GAME_COLS) grid[b.y][b.x] = "\u2502";
      if (b.y - 1 >= 0 && b.y - 1 < GAME_ROWS && b.x >= 0 && b.x < GAME_COLS) grid[b.y - 1][b.x] = "\u257d";
    });

    g.enemyBullets.forEach((b) => {
      if (b.y >= 0 && b.y < GAME_ROWS && b.x >= 0 && b.x < GAME_COLS) grid[b.y][b.x] = "\u257f";
      if (b.y + 1 >= 0 && b.y + 1 < GAME_ROWS && b.x >= 0 && b.x < GAME_COLS) grid[b.y + 1][b.x] = "\u250a";
    });

    PLAYER_ART.forEach((row, ry) => {
      for (let cx = 0; cx < row.length; cx++) {
        const gx = g.player.x + cx;
        const gy = GAME_ROWS - PLAYER_ART.length + ry;
        if (gx >= 0 && gx < GAME_COLS && row[cx] !== " ") {
          grid[gy][gx] = row[cx];
        }
      }
    });

    const scoreTxt = `\u25b8 SCORE: ${String(g.score).padStart(4, "0")}`;
    const helpTxt = "\u25c2 \u25b8 MOVE  \u25b2 FIRE";
    const hud = `${scoreTxt}  ${helpTxt}`;
    for (let i = 0; i < hud.length && i < GAME_COLS; i++) {
      grid[0][i + 1] = hud[i];
    }
    for (let i = 0; i < GAME_COLS; i++) grid[GAME_ROWS - PLAYER_ART.length - 1][i] = "\u2500";

    return grid.map((row) => row.join("")).join("\n");
  }, []);

  useEffect(() => {
    const tick = () => {
      const g = gameRef.current;
      const keys = keysRef.current;

      if (g.state === "start") {
        if (keys["Enter"]) {
          g.state = "playing";
          keys["Enter"] = false;
        }
        setDisplay(renderStartScreen());
        return;
      }

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

      if ((keys["ArrowLeft"] || keys["a"]) && g.player.x > 0) g.player.x -= 1;
      if ((keys["ArrowRight"] || keys["d"]) && g.player.x < GAME_COLS - 5) g.player.x += 1;

      if (keys[" "] || keys["ArrowUp"]) {
        if (g.bullets.length < 3) {
          g.bullets.push({ x: g.player.x + 2, y: GAME_ROWS - PLAYER_ART.length - 1 });
        }
        keys[" "] = false;
        keys["ArrowUp"] = false;
      }

      g.explosions = g.explosions.map((e) => ({ ...e, ttl: e.ttl - 1 })).filter((e) => e.ttl > 0);
      g.bullets = g.bullets.map((b) => ({ ...b, y: b.y - 1 })).filter((b) => b.y >= 0);
      g.enemyBullets = g.enemyBullets.map((b) => ({ ...b, y: b.y + 1 })).filter((b) => b.y < GAME_ROWS);

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

      const py = GAME_ROWS - PLAYER_ART.length;
      for (const b of g.enemyBullets) {
        if (b.y >= py && b.x >= g.player.x && b.x < g.player.x + 5) {
          g.state = "over";
          break;
        }
      }

      g.moveTimer++;
      if (g.moveTimer >= 8) {
        g.moveTimer = 0;
        g.frame = g.frame === 0 ? 1 : 0;
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

        const alive = g.invaders.filter((i) => i.alive);
        if (alive.length > 0 && Math.random() < 0.35) {
          const shooter = alive[Math.floor(Math.random() * alive.length)];
          g.enemyBullets.push({ x: shooter.x + 2, y: shooter.y + 4 });
        }
      }

      g.invaders.forEach((inv) => {
        if (inv.alive && inv.y + 4 >= GAME_ROWS - PLAYER_ART.length) g.state = "over";
      });

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
