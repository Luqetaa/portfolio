import { useState } from "react";

export default function GlitchText({ text, className = "", glitchChance = 0.1 }) {
  const [glitched, setGlitched] = useState(false);

  const triggerGlitch = () => {
    if (Math.random() < glitchChance) {
      setGlitched(true);
      setTimeout(() => setGlitched(false), 80);
    }
  };

  return (
    <span
      className={`relative inline-block cursor-pointer ${className} ${
        glitched ? "glitch" : ""
      }`}
      onMouseEnter={triggerGlitch}
      data-text={text}
    >
      {text}
    </span>
  );
}
