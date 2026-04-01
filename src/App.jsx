import { useState, useCallback, useRef, useEffect } from "react";
import BootScreen from "./components/BootScreen";
import TerminalCursor from "./components/TerminalCursor";
import GameConsole from "./components/ui/GameConsole.jsx";
import NavBar from "./components/navigation/NavBar.jsx";
import HeroSection from "./components/sections/HeroSection.jsx";
import AboutSection from "./components/sections/AboutSection.jsx";
import OutpostSection from "./components/sections/OutpostSection.jsx";

import ContactSection from "./components/sections/ContactSection.jsx";
import ScrollProgress from "./components/ui/ScrollProgress.jsx";
import StickySection from "./components/ui/StickySection.jsx";
import { SectionVariantContext } from "./components/ui/StickySection.jsx";
import { ThemeProvider, useTheme } from "./utils/themeContext.jsx";

/* ── Scroll-driven marquee ticker ────────────────── */
function ScrollTicker() {
  const { theme } = useTheme();
  const stripRef = useRef(null);
  const offsetRef = useRef(0);
  const lastScrollRef = useRef(0);
  const halfWidthRef = useRef(0);
  const canvasRefs = useRef([]);
  const [blockSize, setBlockSize] = useState(8);
  const tickerRef = useRef(null);

  // Pixelation scroll logic — same approach as About photo
  useEffect(() => {
    const onScroll = () => {
      if (!tickerRef.current) return;
      const rect = tickerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = 1 - Math.max(0, Math.min(1, rect.top / vh));
      setBlockSize(Math.round(8 * (1 - progress)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Draw pixelated text to canvases
  useEffect(() => {
    canvasRefs.current.forEach((canvas) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (blockSize <= 0) {
        // Sharp text
        ctx.fillStyle = "#fff";
        ctx.font = `${h * 0.85}px Helvetica, Arial, sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillText("Lucas Cavalcante®", 10, h / 2);
      } else {
        // Draw small then scale up for pixel effect
        const scale = Math.max(1, blockSize);
        const sw = Math.ceil(w / scale);
        const sh = Math.ceil(h / scale);
        const offscreen = document.createElement("canvas");
        offscreen.width = sw;
        offscreen.height = sh;
        const octx = offscreen.getContext("2d");
        octx.fillStyle = "#fff";
        octx.font = `${sh * 0.85}px Helvetica, Arial, sans-serif`;
        octx.textBaseline = "middle";
        octx.fillText("Lucas Cavalcante®", Math.round(10 / scale), sh / 2);

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(offscreen, 0, 0, sw, sh, 0, 0, w, h);
      }
    });
  }, [blockSize]);

  // Infinite scroll loop + slower base speed
  useEffect(() => {
    let raf;
    const BASE_SPEED = -0.6;
    const loop = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollRef.current;
      lastScrollRef.current = scrollY;
      offsetRef.current += BASE_SPEED - delta * 0.3;

      // Wrap around for infinite loop
      if (halfWidthRef.current > 0 && Math.abs(offsetRef.current) >= halfWidthRef.current) {
        offsetRef.current += halfWidthRef.current;
      }

      if (stripRef.current) {
        stripRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Measure half-width for seamless loop
  useEffect(() => {
    if (stripRef.current) {
      halfWidthRef.current = stripRef.current.scrollWidth / 2;
    }
  });

  const TICKER_HEIGHT = 35;
  const ITEM_COUNT = 40;
  const CANVAS_WIDTH = 520;

  // Render items twice for seamless infinite loop
  const items = Array.from({ length: ITEM_COUNT * 2 }, (_, i) => (
    <canvas
      key={i}
      ref={(el) => { canvasRefs.current[i] = el; }}
      width={CANVAS_WIDTH}
      height={TICKER_HEIGHT}
      className="shrink-0"
      style={{ imageRendering: "pixelated", height: TICKER_HEIGHT, width: CANVAS_WIDTH }}
    />
  ));

  return (
    <div
      ref={tickerRef}
      className="relative overflow-hidden flex items-center"
      style={{
        background: theme.primary,
        color: "#fff",
        zIndex: 6,
        height: TICKER_HEIGHT,
      }}
    >
      <div ref={stripRef} className="flex items-center" style={{ width: "max-content" }}>
        {items}
      </div>
    </div>
  );
}

function AppContent() {
  const [bootFinished, setBootFinished] = useState(false);
  const [insideApp, setInsideApp] = useState(true);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const { theme } = useTheme();

  const toggleConsole = useCallback(() => setConsoleOpen((o) => !o), []);

  // Toggle console with ' key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "'" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleConsole();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleConsole]);

  if (!bootFinished) {
    return <BootScreen onFinish={() => setBootFinished(true)} />;
  }

  return (
    <div
      onMouseEnter={() => setInsideApp(true)}
      onMouseLeave={() => setInsideApp(false)}
      onMouseMove={() => !insideApp && setInsideApp(true)}
      className={`font-mono overflow-x-hidden${insideApp ? " cursor-hidden" : ""}`}
      style={{ userSelect: "none" }}
    >
      <TerminalCursor enabled={insideApp} />
      <GameConsole isOpen={consoleOpen} onClose={toggleConsole} />
      <NavBar onToggleConsole={toggleConsole} />
      <ScrollProgress />

      <main>
        {/* Hero scrolls naturally */}
        <div style={{ position: "relative", zIndex: 5, backgroundColor: theme.primary }}>
          <HeroSection />
        </div>

        {/* About scrolls naturally — overflow visible for photo extending into hero */}
        <div style={{ position: "relative", zIndex: 6, overflow: "visible" }}>
          <AboutSection />
        </div>

        {/* Scroll-driven marquee ticker */}
        <ScrollTicker />

        {/* Outpost — cinematic scroll-driven projects interface */}
        <div style={{ position: "relative", zIndex: 7 }}>
          <OutpostSection />
        </div>



        <div style={{ position: "relative", zIndex: 8 }}>
          <ContactSection />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}