import { useTheme } from "../../utils/themeContext.jsx";
import { motion } from "framer-motion";

export default function ThemeSwitcher() {
  const { theme, currentTheme, switchTheme, themes } = useTheme();

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex gap-2 flex-col md:flex-row items-end">
        {Object.entries(themes).map(([key, themeObj]) => (
          <motion.button
            key={key}
            onClick={() => switchTheme(key)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            data-cursor
            className={`w-8 h-8 rounded border-2 transition-all ${
              currentTheme === key
                ? "border-white shadow-lg"
                : "border-white/30"
            }`}
            style={{
              backgroundColor: themeObj.primary,
              boxShadow:
                currentTheme === key
                  ? `0 0 15px ${themeObj.primary}`
                  : "none",
            }}
            title={themeObj.name}
          />
        ))}
      </div>
      <p className="text-xs text-white/50 font-mono">{themes[currentTheme].name}</p>
    </motion.div>
  );
}
