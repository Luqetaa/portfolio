import { motion, useScroll, useTransform, useMotionValueEvent, useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { useTheme } from "../../utils/themeContext.jsx";
import { skillsData } from "../../utils/projectsData";

const SERIF = "'Playfair Display', Georgia, serif";

/* ── Data ─────────────────────────────────────────── */

const socials = [
  { label: "GitHub", url: "https://github.com/Luqetaa" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/lucas-cavalcante-67a875318/" },
  { label: "Email", url: "mailto:lu.cavalcante.jd@gmail.com" },
];

/* ── Subtle grid background (CSS only) ────────────── */
const GRID_BG = {
  backgroundImage: [
    "linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "60px 60px",
};

/* ── Scroll-driven curved divider (hero → about) ─── */
function CurveDivider({ sectionRef, fillColor }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Starts flat (sag 0) → curves down as user scrolls (sag 80)
  const sag = useTransform(scrollYProgress, [0, 0.4], [0, 80]);

  return (
    <div
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ zIndex: 2 }}
    >
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: "clamp(100px, 20vw, 300px)" }}
      >
        <motion.path
          style={{
            d: useTransform(sag, (s) => `M0,0 L1440,0 L1440,60 Q720,${60 + s} 0,60 Z`),
          }}
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

/* ── Pixelated canvas overlay ─────────────────────── */
function PixelCanvas({ src, blockSize }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !loaded) return;

    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    if (blockSize <= 1) {
      ctx.clearRect(0, 0, w, h);
      return;
    }

    // Draw image at tiny resolution, then scale up — creates pixelation
    const sw = Math.max(1, Math.ceil(w / blockSize));
    const sh = Math.max(1, Math.ceil(h / blockSize));

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, sw, sh);
    ctx.drawImage(canvas, 0, 0, sw, sh, 0, 0, w, h);
  }, [blockSize, loaded]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <>
      <img
        ref={imgRef}
        src={src}
        alt=""
        crossOrigin="anonymous"
        onLoad={() => setLoaded(true)}
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        width={400}
        height={534}
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
        style={{ imageRendering: "pixelated" }}
      />
    </>
  );
}

/* ── Parallax photo with pixelation reveal ────────── */
function ParallaxPhoto({ sectionRef }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Photo stays still until it reaches center of viewport, then moves down
  const y = useTransform(scrollYProgress, [0.35, 0.55], [0, 280]);

  // Block size: starts very pixelated (40px blocks) → sharp (0) as you scroll
  const [blockSize, setBlockSize] = useState(40);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Map scroll 0.08→0.50 to blockSize 40→0 (longer reveal)
    const t = Math.min(1, Math.max(0, (v - 0.08) / 0.42));
    setBlockSize(Math.round(40 * (1 - t)));
  });

  return (
    <motion.div
      className="relative md:absolute md:right-[4%] lg:right-[6%]"
      style={{
        y,
        top: "-12vh",
        zIndex: 3,
        width: "min(420px, 40vw)",
        maxWidth: "100%",
      }}
    >
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          aspectRatio: "3 / 4",
          boxShadow:
            "0 25px 60px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.10)",
        }}
      >
        {/* Base image (revealed when pixelation clears) */}
        <img
          src="/profile.jpg"
          alt="Lucas Cavalcante"
          className="w-full h-full object-cover"
          loading="eager"
        />

        {/* Pixelated canvas overlay */}
        {blockSize > 0 && <PixelCanvas src="/profile.jpg" blockSize={blockSize} />}

        <div
          className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.15), transparent)",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ── Main Section ─────────────────────────────────── */

export default function AboutSection() {
  const sectionRef = useRef(null);
  const { theme } = useTheme();

  return (
    <section
      ref={sectionRef}
      data-section="about"
      className="relative min-h-screen"
      style={{ ...GRID_BG, backgroundColor: "#f0f0f0" }}
    >
      {/* Scroll-driven curved divider from dark hero to light about */}
      <CurveDivider sectionRef={sectionRef} fillColor={theme.primary} />

      {/* Content wrapper */}
      <div
        className="relative mx-auto max-w-6xl px-6 sm:px-10"
        style={{
          paddingTop: "clamp(120px, 16vw, 240px)", // clear the diagonal
          paddingBottom: "80px",
          zIndex: 4,
        }}
      >
        {/* Two-column grid: content left, photo right */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_40%] gap-12 md:gap-8 items-start">
          {/* ── LEFT COLUMN: Content ── */}
          <div className="order-2 md:order-1">
            {/* Section label */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="text-xs font-mono tracking-[0.25em] mb-4"
              style={{ color: "#888" }}
            >
              02 / ABOUT
            </motion.p>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] mb-8"
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                color: "#1a1a1a",
              }}
            >
              About<br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1.5px #1a1a1a",
                }}
              >
                Me
              </span>
            </motion.h2>

            {/* Divider */}
            <div className="w-12 h-px bg-neutral-300 mb-8" />

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-4 font-mono text-sm leading-relaxed mb-12"
              style={{ color: "#444", maxWidth: "520px" }}
            >
              <p>
                Atuo no desenvolvimento full-stack, criando interfaces interativas com React e estruturando back-ends sólidos com Node.js, Python e Java.
              </p>
              <p>
                Atuo no desenvolvimento full-stack, criando interfaces interativas com React e estruturando back-ends sólidos com Node.js, Python e Java. 
                Também tenho interesse na criação de agentes de IA e aplicações com LLMs, explorando formas de integrar inteligência artificial em produtos reais.
              </p>
              <p>
                Gosto de transformar ideias em sistemas funcionais, desde a concepção até a entrega, sempre buscando código limpo, boas práticas e soluções escaláveis.
              </p>
            </motion.div>

            {/* Stack — Full Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-10"
            >
              <div className="mb-6 flex items-center gap-3">
                <h3
                  className="text-[11px] font-mono font-bold tracking-[0.2em]"
                  style={{ color: "#1a1a1a" }}
                >
                  [STACK]
                </h3>
                <div className="flex-1 h-px bg-neutral-300" />
              </div>

              <div className="space-y-6">
                {Object.entries(skillsData).map(([category, skills], catIdx) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: catIdx * 0.08 }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="text-[10px] font-mono font-bold tracking-[0.15em]"
                        style={{ color: "#999" }}
                      >
                        {category.toUpperCase()}
                      </span>
                      <div
                        className="flex-1 h-px"
                        style={{ backgroundColor: "#e0e0e0" }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 pl-3 border-l-2" style={{ borderColor: "#d4d4d4" }}>
                      {skills.map((skill, idx) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.25, delay: catIdx * 0.08 + idx * 0.03 }}
                          className="px-3 py-1.5 border text-[11px] font-mono tracking-wide"
                          style={{
                            borderColor: "#ccc",
                            color: "#333",
                            borderRadius: "2px",
                          }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex items-center gap-6 pt-6 border-t"
              style={{ borderColor: "#ddd" }}
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                  className="font-mono text-[11px] tracking-widest hover:opacity-60 transition-opacity"
                  style={{ color: "#555" }}
                >
                  {s.label} ↗
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Parallax Photo ── */}
          <div className="order-1 md:order-2 relative flex justify-center md:block">
            <ParallaxPhoto sectionRef={sectionRef} />
          </div>
        </div>
      </div>

      {/* Decorative curved lines (like Lando Norris background) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1, opacity: 0.06 }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <path
          d="M-100,200 Q400,100 700,400 T1500,350"
          fill="none"
          stroke="#000"
          strokeWidth="1.5"
        />
        <path
          d="M-100,500 Q500,300 800,600 T1600,500"
          fill="none"
          stroke="#000"
          strokeWidth="1"
        />
        <path
          d="M-50,700 Q350,550 750,750 T1500,680"
          fill="none"
          stroke="#000"
          strokeWidth="1.2"
        />
      </svg>
    </section>
  );
}
