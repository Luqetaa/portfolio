import { createContext, useContext } from "react";

// Context so children know if they're on a dark or light section
const SectionVariantContext = createContext("dark");
export const useSectionVariant = () => useContext(SectionVariantContext);

/**
 * Sticky overlapping section wrapper.
 * Each section sticks to top: 0 with increasing z-index,
 * so the next section slides up and covers the previous one.
 *
 * @param {number}  index   – 0-based section order (controls z-index stacking)
 * @param {"dark"|"light"} variant – background color scheme
 * @param {React.ReactNode} children
 */
export default function StickySection({ index = 0, variant = "dark", children }) {
  const isDark = variant === "dark";

  return (
    <SectionVariantContext.Provider value={variant}>
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{
          zIndex: 10 + index,
          backgroundColor: isDark ? "#090a0a" : "#f0f0f0",
          color: isDark ? "#e6e6e6" : "#1a1a1a",
          minHeight: "100vh",
          /* Subtle top edge shadow on light sections for the "card sliding up" feel */
          boxShadow: !isDark
            ? "0 -8px 30px rgba(0,0,0,0.15), 0 -2px 6px rgba(0,0,0,0.08)"
            : index > 0
              ? "0 -8px 30px rgba(0,0,0,0.4)"
              : "none",
        }}
      >
        {children}
      </div>
    </SectionVariantContext.Provider>
  );
}
