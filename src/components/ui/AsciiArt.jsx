import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AsciiArt({ art, animateIn = false, delay = 0 }) {
  const [displayedArt, setDisplayedArt] = useState(animateIn ? "" : art);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!animateIn) {
      setDisplayedArt(art);
      return;
    }

    if (charIndex >= art.length) return;

    const timeout = setTimeout(() => {
      setDisplayedArt(art.slice(0, charIndex + 1));
      setCharIndex((prev) => prev + 1);
    }, 4);

    return () => clearTimeout(timeout);
  }, [charIndex, art, animateIn]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: delay / 1000 },
    },
  };

  return (
    <motion.pre
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="ascii-art text-[#caf0e0] text-xs md:text-sm leading-none whitespace-pre font-mono drop-shadow-[0_0_10px_#caf0e0] tracking-tighter"
    >
      {displayedArt}
    </motion.pre>
  );
}
