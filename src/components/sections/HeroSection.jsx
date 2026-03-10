import { motion } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

const FONT = "Helvetica, Arial, sans-serif";

/* Canvas-based pixelated text — same technique as the blue ticker */
function PixelText({ text, height, className = "" }) {
  const canvasRef = useRef(null);
  const [blockSize, setBlockSize] = useState(24);

  // Animate pixelation: start blocky, resolve to sharp
  useEffect(() => {
    let frame = 24;
    const id = setInterval(() => {
      frame -= 1;
      if (frame <= 0) {
        clearInterval(id);
        setBlockSize(0);
      } else {
        setBlockSize(frame);
      }
    }, 70);
    return () => clearInterval(id);
  }, []);

  // Intermittent glitch: briefly re-pixelate
  useEffect(() => {
    const glitch = () => {
      setBlockSize(14);
      setTimeout(() => setBlockSize(8), 50);
      setTimeout(() => setBlockSize(18), 120);
      setTimeout(() => setBlockSize(10), 200);
      setTimeout(() => setBlockSize(5), 300);
      setTimeout(() => setBlockSize(0), 400);
    };
    const id = setInterval(glitch, 3000);
    return () => clearInterval(id);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (blockSize <= 0) {
      ctx.fillStyle = "#fff";
      ctx.font = `900 ${h * 0.82}px ${FONT}`;
      ctx.textBaseline = "bottom";
      ctx.fillText(text, 0, h * 0.95);
    } else {
      const scale = Math.max(1, blockSize);
      const sw = Math.ceil(w / scale);
      const sh = Math.ceil(h / scale);
      const offscreen = document.createElement("canvas");
      offscreen.width = sw;
      offscreen.height = sh;
      const octx = offscreen.getContext("2d");
      octx.fillStyle = "#fff";
      octx.font = `900 ${sh * 0.82}px ${FONT}`;
      octx.textBaseline = "bottom";
      octx.fillText(text, 0, sh * 0.95);

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, sw, sh, 0, 0, w, h);
    }
  }, [blockSize, text]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={height}
      className={`w-full select-none ${className}`}
      style={{ imageRendering: "pixelated", height: "auto" }}
    />
  );
}

export default function HeroSection() {
  return (
    <section
      data-section="hero"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="px-3 sm:px-6 pb-6 sm:pb-10"
      >
        <PixelText text="Lucas" height={320} />
        <PixelText text="Cavalcante®" height={320} className="-mt-4 sm:-mt-8" />
      </motion.div>
    </section>
  );
}
