import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../utils/themeContext.jsx";

export default function LiveColorPalette() {
  const { theme } = useTheme();
  const [hoveredColor, setHoveredColor] = useState(null);

  const colors = [
    { name: "Primary", value: theme.primary },
    { name: "Secondary", value: theme.secondary },
    { name: "Accent", value: theme.accent },
    { name: "Background", value: theme.background },
  ];

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold font-mono tracking-widest" style={{ color: theme.primary }}>
        [LIVE PALETTE]
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {colors.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            onClick={() => copyToClipboard(item.value)}
            data-cursor
            className="cursor-pointer border p-4 transition-all"
            style={{ borderColor: item.value }}
          >
            <motion.div
              className="w-full h-16 rounded mb-2"
              style={{ backgroundColor: item.value }}
              onMouseEnter={() => setHoveredColor(idx)}
              onMouseLeave={() => setHoveredColor(null)}
            />
            <p className="text-xs font-mono" style={{ color: item.value }}>
              {item.name}
            </p>
            <p className="text-xs text-opacity-50 mt-1" style={{ color: theme.text }}>
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
