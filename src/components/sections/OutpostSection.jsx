import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "../../utils/themeContext.jsx";
import { projectsData } from "../../utils/projectsData.js";

const SERIF = "'Playfair Display', Georgia, serif";
const MONO = "'IBM Plex Mono', monospace";

/* ────────────────────────────────────────────────────────
   Rectangular outline frames — layered in depth
   We map scale to an exponential curve to mimic a
   forward-moving 3D camera without perspective bugs.
   ──────────────────────────────────────────────────────── */
const FRAME_CONFIGS = [
  { w: "48%", h: "44%", scaleRange: [1.15, 6.0], opacity: 0.2, border: 2 },
  { w: "42%", h: "38%", scaleRange: [1.10, 5.0], opacity: 0.35, border: 2 },
  { w: "36%", h: "32%", scaleRange: [1.05, 4.0], opacity: 0.5, border: 2 },
  { w: "30%", h: "26%", scaleRange: [1.00, 3.0], opacity: 0.7, border: 2 },
];

/* ── Pixel block masses — cinematic phased background ── */
function PixelBlocks({ color, scrollYProgress }) {
  const cols = 32;
  const rows = 18;

  const { blocks } = useMemo(() => {
    const rng = (seed) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    };
    const r = rng(1234);

    const b = [];
    const aspect = cols / rows;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const val = r();
        const cx = (x + 0.5) / cols - 0.5;
        const cy = (y + 0.5) / rows - 0.5;

        const angle = Math.atan2(cy, cx * aspect);
        const wobble = Math.sin(angle * 6) * 0.04 + Math.cos(angle * 4) * 0.04;
        const dist = Math.sqrt(cx * cx * aspect * aspect + cy * cy) + wobble;

        let isBlob = false;
        if (dist < 0.20) {
          isBlob = val < 0.95; // solid center
        } else if (dist < 0.35) {
          const edgeProb = 1 - (dist - 0.20) / 0.15;
          isBlob = val < edgeProb;
        }

        if (isBlob) {
          // 80% density inside the blob
          if (r() < 0.8) {
            b.push({ id: `${x}-${y}`, x: x * (100 / cols), y: y * (100 / rows), w: 100 / cols, h: 100 / rows, opacity: 0.15 });
          }
        } else {
          // Scattered blocks outside
          if (r() < 0.06) {
            b.push({ id: `${x}-${y}`, x: x * (100 / cols), y: y * (100 / rows), w: 100 / cols, h: 100 / rows, opacity: 0.15 });
          }
        }
      }
    }
    return { blocks: b };
  }, [cols, rows]);

  // Phase 2: Dither effect progressivo (antecipado para começar logo após a fase escura)
  const ditherMaskImage = useTransform(
    scrollYProgress,
    [0.05, 0.20],
    [
      "radial-gradient(circle at center, black 0%, transparent 0%)",
      "radial-gradient(circle at center, black 150%, transparent 150%)"
    ]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Definitive blocks */}
      <motion.div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: ditherMaskImage,
          WebkitMaskSize: "12px 12px",
          maskImage: ditherMaskImage,
          maskSize: "12px 12px",
        }}
      >
        {blocks.map(blk => (
          <div key={blk.id} className="absolute" style={{ left: `${blk.x}%`, top: `${blk.y}%`, width: `${blk.w}%`, height: `${blk.h}%`, backgroundColor: color, opacity: blk.opacity }} />
        ))}
      </motion.div>
    </div>
  );
}

/* ── HUD micro-detail fragments ── */
function HudDetails({ accentColor }) {
  return (
    <>
      {/* Top-left bracket + label */}
      <div className="absolute top-[8%] left-[6%] font-mono text-[10px] tracking-[0.25em] select-none pointer-events-none"
        style={{ color: `${accentColor}60` }}>
        <div className="flex items-center gap-2 mb-1">
          <span style={{ color: `${accentColor}40` }}>┌──</span>
          <span>SYS.OUTPOST</span>
        </div>
        <div className="ml-6 text-[9px]" style={{ color: `${accentColor}30` }}>v4.2.1 // ACTIVE</div>
      </div>

      {/* Top-right coordinates */}
      <div className="absolute top-[8%] right-[6%] font-mono text-[10px] tracking-widest text-right select-none pointer-events-none"
        style={{ color: `${accentColor}50` }}>
        <div>47°36'N 122°20'W</div>
        <div className="text-[9px] mt-0.5" style={{ color: `${accentColor}30` }}>ZONE :: ECHO-7</div>
      </div>

      {/* Bottom-left status */}
      <div className="absolute bottom-[10%] left-[6%] font-mono text-[9px] tracking-[0.2em] select-none pointer-events-none"
        style={{ color: `${accentColor}40` }}>
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          <span>LINK ESTABLISHED</span>
        </div>
        <div className="ml-4 mt-0.5" style={{ color: `${accentColor}25` }}>
          ├─ STREAM OK &nbsp; ├─ AUTH ██████
        </div>
      </div>

      {/* Bottom-right matrix dots */}
      <div className="absolute bottom-[10%] right-[6%] font-mono text-[9px] select-none pointer-events-none"
        style={{ color: `${accentColor}30` }}>
        <div className="text-right tracking-[0.4em]">····</div>
        <div className="text-right tracking-[0.4em]">·:·:</div>
        <div className="text-right tracking-[0.4em]">····</div>
      </div>

      {/* Left side vertical tag */}
      <div className="absolute left-[3%] top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-[0.35em] select-none pointer-events-none"
        style={{ color: `${accentColor}25`, writingMode: "vertical-lr", textOrientation: "mixed" }}>
        DEPLOYMENT_POST::ACTIVE
      </div>

      {/* Right side vertical tag */}
      <div className="absolute right-[3%] top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-[0.35em] select-none pointer-events-none"
        style={{ color: `${accentColor}25`, writingMode: "vertical-lr", textOrientation: "mixed" }}>
        MARATHON::04.26.2526
      </div>

      {/* Crosshair center accent — subtle */}
      <div className="absolute left-1/2 top-[22%] -translate-x-1/2 pointer-events-none select-none"
        style={{ color: `${accentColor}20` }}>
        <div className="font-mono text-[10px] text-center tracking-[0.5em]">+</div>
      </div>

      {/* Small red accent marks */}
      <div className="absolute top-[15%] left-[18%] w-2 h-px pointer-events-none" style={{ backgroundColor: "#ff000040" }} />
      <div className="absolute bottom-[20%] right-[22%] w-px h-2 pointer-events-none" style={{ backgroundColor: "#ff000030" }} />
    </>
  );
}



/* ════════════════════════════════════════════════════════
   OUTPOST SECTION — cinematic scroll-based interface
   ════════════════════════════════════════════════════════ */
export default function OutpostSection() {
  const { theme } = useTheme();
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Theme-aware accent — use theme primary for frame color
  const accentColor = theme.primary;

  // Create transforms for each frame layer
  const frameTransforms = useMemo(() => {
    return FRAME_CONFIGS.map((cfg) => ({
      cfg,
    }));
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="projects"
      className="relative"
      style={{ height: "800vh" }}
    >
      {/* Sticky viewport container */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: "100vh",
          backgroundColor: "#050505",
          zIndex: 1,
        }}
      >
        {/* Pixel block background masses */}
        <PixelBlocks color={accentColor} scrollYProgress={scrollYProgress} />





        {/* ── Rectangular outline frames ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 5 }}>
          {frameTransforms.map(({ cfg }, i) => (
            <FrameLayer
              key={i}
              index={i}
              cfg={cfg}
              scrollYProgress={scrollYProgress}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* ── Center content block ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
          <CenterContent
            accentColor={accentColor}
            scrollYProgress={scrollYProgress}
            theme={theme}
          />
        </div>

        {/* ── Cinematic Projects List ── */}
        <CinematicProjectList
          accentColor={accentColor}
          scrollYProgress={scrollYProgress}
        />

        {/* ── HUD detail fragments ── */}
        <div className="absolute inset-0 hidden md:block" style={{ zIndex: 15 }}>
          <HudDetails accentColor={accentColor} />
        </div>
      </div>
    </section>
  );
}

/* ── Individual frame layer — Scale simulating Z-translation ── */
function FrameLayer({ cfg, scrollYProgress, isMobile, index }) {
  const { w, h, scaleRange, opacity, border } = cfg;

  const scale = useTransform(scrollYProgress, (v) => {
    // Zoom ends at 0.5
    const normalized = Math.max(0, Math.min(1, v / 0.5));
    // Ease-in curva: comecar lento e terminar mais rapido
    const easeIn = Math.pow(normalized, 4);
    return scaleRange[scaleRange.length - 1]
      ? scaleRange[0] + easeIn * (scaleRange[scaleRange.length - 1] - scaleRange[0])
      : scaleRange[0];
  });

  const appearStart = 0.25 + index * 0.02;
  const frameOpacity = useTransform(
    scrollYProgress,
    [0, appearStart - 0.01, appearStart, 0.35, 0.45, 1],
    [0, 0, opacity, opacity, 0, 0]
  );

  const mobileW = isMobile ? `calc(${w} + 8%)` : w;
  const mobileH = isMobile ? `calc(${h} + 6%)` : h;

  return (
    <motion.div
      className="absolute"
      style={{
        width: mobileW,
        height: mobileH,
        scale,
        opacity: frameOpacity,
        border: `${border}px solid #7DF056`,
        willChange: "transform, opacity",
      }}
    />
  );
}

/* ── Center content — title block ── */
function CenterContent({ accentColor, scrollYProgress, theme }) {
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.4],
    [1, 1, 0]
  );
  const contentY = useTransform(scrollYProgress, [0, 0.3, 0.4], [0, 0, -50]);

  return (
    <motion.div
      className="text-center px-6 select-none"
      style={{
        opacity: contentOpacity,
        y: contentY,
      }}
    >
      {/* Technical label */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-6 h-px" style={{ backgroundColor: `${accentColor}60` }} />
        <span
          className="text-[10px] md:text-xs tracking-[0.4em] font-mono uppercase"
          style={{ color: `${accentColor}90` }}
        >
          Restricted // Deployment Post
        </span>
        <div className="w-6 h-px" style={{ backgroundColor: `${accentColor}60` }} />
      </div>

      {/* Main title */}
      <h2
        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none mb-4"
        style={{
          fontFamily: SERIF,
          fontWeight: 900,
          color: "#fff",
          textShadow: `0 0 80px ${accentColor}30, 0 0 160px ${accentColor}10`,
          letterSpacing: "0.04em",
        }}
      >
        Projects
      </h2>

      {/* Descriptor line */}
      <p
        className="text-xs md:text-sm font-mono tracking-[0.25em] uppercase mb-8"
        style={{ color: `${accentColor}70` }}
      >
        Infrastructure & deployment post
      </p>

      {/* Thin separator */}
      <div className="mx-auto mb-6" style={{ width: 40, height: 1, backgroundColor: `${accentColor}40` }} />

      {/* Sub-info — project count or status */}
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="text-[9px] font-mono tracking-[0.3em] mb-1" style={{ color: `${accentColor}40` }}>
            MODULES
          </div>
          <div className="text-lg md:text-xl font-mono" style={{ color: `${accentColor}cc` }}>
            04
          </div>
        </div>
        <div className="w-px h-6" style={{ backgroundColor: `${accentColor}25` }} />
        <div className="text-center">
          <div className="text-[9px] font-mono tracking-[0.3em] mb-1" style={{ color: `${accentColor}40` }}>
            STATUS
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#00ff66" }} />
            <span className="text-xs font-mono tracking-widest" style={{ color: "#00ff66cc" }}>
              ONLINE
            </span>
          </div>
        </div>
        <div className="w-px h-6" style={{ backgroundColor: `${accentColor}25` }} />
        <div className="text-center">
          <div className="text-[9px] font-mono tracking-[0.3em] mb-1" style={{ color: `${accentColor}40` }}>
            BUILD
          </div>
          <div className="text-lg md:text-xl font-mono" style={{ color: `${accentColor}cc` }}>
            2026
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Cinematic Projects List ── */
function CinematicProjectList({ scrollYProgress, accentColor }) {
  // Fade in after frames and title disappear
  const containerOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.95, 1], [0, 1, 1, 0]);

  // Parallax upward movement so users can scroll through the items
  const containerY = useTransform(scrollYProgress, [0.55, 1], ["60vh", "-100vh"]);

  return (
    <motion.div
      className="absolute inset-x-0 top-0 flex flex-col items-center pt-8 px-4 md:px-6 pointer-events-auto"
      style={{
        opacity: containerOpacity,
        y: containerY,
        zIndex: 30, // Above everything else
      }}
    >
      {projectsData.map((p, i) => (
        <div
          key={p.id}
          className="w-full max-w-4xl border mb-8 p-6 md:p-8 group relative overflow-hidden backdrop-blur-md"
          style={{ borderColor: `${accentColor}40`, backgroundColor: "rgba(5,5,5,0.75)" }}
        >
          {/* subtle hover background */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-5">
                <span className="text-sm font-mono tabular-nums" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="w-12 h-px" style={{ backgroundColor: `${accentColor}40` }} />
                <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  {p.category}
                </span>
              </div>

              <h3
                className="text-4xl md:text-5xl lg:text-6xl mb-4 transition-colors duration-300"
                style={{ fontFamily: SERIF, fontWeight: 900, color: "#fff", textShadow: `0 0 40px ${accentColor}30`, letterSpacing: "0.02em" }}
              >
                {p.title}
              </h3>

              <p className="font-mono text-sm md:text-base leading-relaxed max-w-2xl mb-8" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                {p.longDescription || p.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {p.tags.map(t => (
                  <span
                    key={t}
                    className="text-[10px] md:text-xs font-mono px-3 py-1.5 border uppercase tracking-widest"
                    style={{ borderColor: "rgba(255, 255, 255, 0.3)", color: "rgba(255, 255, 255, 0.8)", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-5 mt-4 md:mt-0 shrink-0 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8" style={{ borderColor: `${accentColor}20` }}>
              <span className="text-sm font-mono tracking-widest" style={{ color: "rgba(255, 255, 255, 0.5)" }}>{p.year}</span>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs md:text-sm font-mono tracking-widest border px-6 py-3 hover:bg-white hover:text-black transition-all text-center flex items-center justify-center gap-2"
                    style={{ borderColor: accentColor, color: "#fff" }}
                  >
                    ACCESS <span>↗</span>
                  </a>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono tracking-[0.1em] px-6 py-2 transition-colors text-center opacity-60 hover:opacity-100"
                    style={{ color: "#fff" }}
                  >
                    SOURCE ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: accentColor }} />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: accentColor }} />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: accentColor }} />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: accentColor }} />
        </div>
      ))}
    </motion.div>
  );
}
