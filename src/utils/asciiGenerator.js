export const asciiArt = {
  portfolio: `
╔═══════════════════════════════════════════════════════════════╗
║          PORTFOLIO :: INTERACTIVE EXPERIENCE v1.0             ║
╠═══════════════════════════════════════════════════════════════╣
║  [●] STATUS: ONLINE    [◆] MODE: CREATIVE    [✦] LEVEL: PRO  ║
╚═══════════════════════════════════════════════════════════════╝
  `,
  
  arrow: `
    ┌─────────────────┐
    │  EXPLORE MORE →  │
    └─────────────────┘
  `,
  
  divider: `
  ═══════════════════════════════════════════════════════════════
  `,

  heroLens: [
    "                    L L L L                    ",
    "              L L C C C C C L L                ",
    "          L C C                 C L            ",
    "        L C       L C . C L       C L          ",
    "      L C     L C . . . . . C L     C L        ",
    "    L C     C . .             . . C    C L      ",
    "   L C    C .     L C . C L     . C    C L     ",
    "  L C   C .    C .         . C    . C   C L    ",
    "  L C  C .   C .   L . L   . C   . C  C L     ",
    " L C  C .  C .   L .   . L   . C  . C  C L    ",
    " L C C .  C .  L .       . L  . C  . C C L    ",
    " L C C . C .  L .    .    . L  . C . C C L    ",
    " L C C . C . L .     .     . L . C . C C L    ",
    " L C C . C .  L .    .    . L  . C . C C L    ",
    " L C C .  C .  L .       . L  . C  . C C L    ",
    " L C  C .  C .   L .   . L   . C  . C  C L    ",
    "  L C  C .   C .   L . L   . C   . C  C L     ",
    "  L C   C .    C .         . C    . C   C L    ",
    "   L C    C .     L C . C L     . C    C L     ",
    "    L C     C . .             . . C    C L      ",
    "      L C     L C . . . . . C L     C L        ",
    "        L C       L C . C L       C L          ",
    "          L C C                 C L            ",
    "              L L C C C C C L L                ",
    "                    L L L L                    ",
  ],
};

export function generateBoxAscii(width = 40, height = 10, title = "") {
  let box = "╔" + "═".repeat(width - 2) + "╗\n";
  
  if (title) {
    const padding = Math.floor((width - title.length - 4) / 2);
    box += "║" + " ".repeat(padding) + "[ " + title + " ]" + " ".repeat(width - padding - title.length - 6) + "║\n";
    box += "╠" + "═".repeat(width - 2) + "╣\n";
  }

  for (let i = 0; i < height - (title ? 2 : 1); i++) {
    box += "║" + " ".repeat(width - 2) + "║\n";
  }

  box += "╚" + "═".repeat(width - 2) + "╝";
  return box;
}
