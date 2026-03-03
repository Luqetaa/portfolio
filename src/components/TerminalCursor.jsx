import { useEffect, useRef, useState } from "react";
import { useTheme } from "../utils/themeContext.jsx";

export default function TerminalCursor({ enabled }) {
  const { theme } = useTheme();
  const cursorRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const lockedEl = useRef(null);                    // ref so RAF reads fresh value
  const [targetRect, setTargetRect] = useState(null);
  const [cursorColor, setCursorColor] = useState(theme.primary);

  const getTarget = (el) => el.closest("button, a, [data-cursor]");

  /* keep default bracket color in sync with theme switches */
  useEffect(() => {
    if (!lockedEl.current) setCursorColor(theme.primary);
  }, [theme.primary]);

  /* mouse tracking — detects element + reads its color */
  useEffect(() => {
    if (!enabled) return;

    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      const target = getTarget(e.target);
      if (target) {
        lockedEl.current = target;
        setTargetRect(target.getBoundingClientRect());
        // Mirror the element's own text/border color so accent buttons look right
        const computed = window.getComputedStyle(target);
        const elColor = computed.color;
        setCursorColor(elColor && elColor !== "rgba(0, 0, 0, 0)" ? elColor : theme.primary);
      } else {
        lockedEl.current = null;
        setTargetRect(null);
        setCursorColor(theme.primary);
      }
    };

    const leave = () => {
      lockedEl.current = null;
      setTargetRect(null);
      setCursorColor(theme.primary);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [enabled, theme.primary]);

  /* smooth follow — re-reads DOMRect every frame so scrolling never drifts */
  useEffect(() => {
    if (!enabled) return;
    let frame;
    const animate = () => {
      const liveRect = lockedEl.current
        ? lockedEl.current.getBoundingClientRect()
        : null;

      const targetX = liveRect
        ? liveRect.left + liveRect.width / 2
        : mouse.current.x;
      // nudge 2 px up when locked — compensates for font descender offset
      const targetY = liveRect
        ? liveRect.top + liveRect.height / 2 - 2
        : mouse.current.y;

      pos.current.x += (targetX - pos.current.x) * 0.18;
      pos.current.y += (targetY - pos.current.y) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
        // live-update rect for size/shape while already locked
        if (liveRect) {
          setTargetRect((prev) => {
            // only update state if position changed meaningfully (avoids re-render spam)
            if (
              !prev ||
              Math.abs(prev.width - liveRect.width) > 1 ||
              Math.abs(prev.height - liveRect.height) > 1
            )
              return liveRect;
            return prev;
          });
        }
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  if (!enabled) return null;

  const PAD_X = 20;   // wider gap between bracket and button edge
  const PAD_Y = 8;

  const width  = targetRect ? targetRect.width  + PAD_X * 2 : 20;
  const height = targetRect ? targetRect.height + PAD_Y * 2 : 20;
  const bracketSize = targetRect ? Math.round(height * 0.92) : 16;

  return (
    <div
      ref={cursorRef}
      className={`terminal-cursor ${targetRect ? "cursor-locked" : ""}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        "--cursor-color": cursorColor,
      }}
    >
      <span className="bracket" style={{ fontSize: `${bracketSize}px` }}>[</span>

      {/* corner ticks — only visible when locked on an element */}
      {targetRect && (
        <>
          <span className="cursor-corner tl">·</span>
          <span className="cursor-corner tr">·</span>
          <span className="cursor-corner bl">·</span>
          <span className="cursor-corner br">·</span>
        </>
      )}

      <span className="bracket" style={{ fontSize: `${bracketSize}px` }}>]</span>
    </div>
  );
}