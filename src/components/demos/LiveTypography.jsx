import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../utils/themeContext.jsx";

export default function LiveTypography() {
  const { theme } = useTheme();
  const [size, setSize] = useState(24);
  const [weight, setWeight] = useState(400);
  const [spacing, setSpacing] = useState(0);

  return (
    <div className="space-y-6 border p-6" style={{ borderColor: `${theme.primary}40` }}>
      <h3 className="text-lg font-bold font-mono tracking-widest" style={{ color: theme.primary }}>
        [LIVE TYPOGRAPHY]
      </h3>

      {/* Preview */}
      <motion.div
        className="p-8 rounded border"
        style={{
          borderColor: theme.accent,
          backgroundColor: `${theme.accent}05`,
          fontSize: `${size}px`,
          fontWeight: weight,
          letterSpacing: `${spacing}px`,
          color: theme.primary,
        }}
      >
        The future is creative
      </motion.div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className="text-xs" style={{ color: theme.secondary }}>
            Size: {size}px
          </label>
          <input
            type="range"
            min="12"
            max="48"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs" style={{ color: theme.secondary }}>
            Weight: {weight}
          </label>
          <input
            type="range"
            min="300"
            max="700"
            step="100"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs" style={{ color: theme.secondary }}>
            Letter Spacing: {spacing}px
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={spacing}
            onChange={(e) => setSpacing(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}