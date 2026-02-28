import { useEffect, useRef, useState } from "react";

export default function TerminalCursor({ enabled }) {
  const cursorRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  const [targetRect, setTargetRect] = useState(null);

  /* =========================
     FIND BUTTON TARGET
  ========================= */
  const getTarget = (el) => el.closest("button, a, [data-cursor]");

  useEffect(() => {
    if (!enabled) return;

    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const target = getTarget(e.target);

      if (target) {
        setTargetRect(target.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, [enabled]);

  /* =========================
     SMOOTH FOLLOW
  ========================= */
  useEffect(() => {
    if (!enabled) return;

    let frame;

    const animate = () => {
      let targetX = mouse.current.x;
      let targetY = mouse.current.y;

      // LOCK TO BUTTON
      if (targetRect) {
        targetX = targetRect.left + targetRect.width / 2;
        targetY = targetRect.top + targetRect.height / 2;
      }

      pos.current.x += (targetX - pos.current.x) * 0.18;
      pos.current.y += (targetY - pos.current.y) * 0.18;

      if (cursorRef.current) {
        // Set left/top so the CSS `translate(-50%, -50%)` keeps centering
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
      }

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, [targetRect, enabled]);

  if (!enabled) return null;

  // padding around the target button (px)
  const padX = 20;
  const padY = 12;

  const width = targetRect ? Math.round(targetRect.width + padX * 3) : 24;
  const height = targetRect ? Math.round(targetRect.height + padY * 2) : 24;

  // determine a bracket font size relative to height
  const bracketSize = Math.max(12, Math.round(height * 0.8));

  return (
    <div
      ref={cursorRef}
      className={`terminal-cursor ${targetRect ? "cursor-locked" : ""}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <span
        className="bracket"
        style={{ fontSize: `${bracketSize}px`, lineHeight: `${height}px` }}
      >
        [
      </span>
      <span
        className="bracket"
        style={{ fontSize: `${bracketSize}px`, lineHeight: `${height}px` }}
      >
        ]
      </span>
    </div>
  );
}