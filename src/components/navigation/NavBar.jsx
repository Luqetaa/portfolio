import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../utils/themeContext.jsx";
import { useState, useEffect } from "react";

const NAV_SECTIONS = [
  { id: "hero",     label: "INIT",     index: "01" },
  { id: "projects", label: "PROJECTS", index: "02" },
  { id: "skills",   label: "STACK",    index: "03" },
  { id: "contact",  label: "CONTACT",  index: "04" },
];

function useClock() {
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 8));
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toTimeString().slice(0, 8)), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function NavBar() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const time = useClock();

  /* track scroll depth for shadow intensity */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* active section — scroll-position based: picks the last section whose
     top edge has passed 35% of the viewport height. Works for all sections
     including short ones at the bottom (contact). */
  useEffect(() => {
    const update = () => {
      const trigger = window.scrollY + window.innerHeight * 0.35;
      let current = NAV_SECTIONS[0].id;
      NAV_SECTIONS.forEach(({ id }) => {
        const el = document.querySelector(`[data-section="${id}"]`);
        if (!el) return;
        if (el.getBoundingClientRect().top + window.scrollY <= trigger) {
          current = id;
        }
      });
      setActiveSection(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollTo = (id) => {
    document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: "smooth" });
  };

  const activeIdx = NAV_SECTIONS.find((s) => s.id === activeSection)?.index ?? "01";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 pointer-events-auto select-none"
      style={{
        backdropFilter: "blur(18px) saturate(150%)",
        WebkitBackdropFilter: "blur(18px) saturate(150%)",
        background: `linear-gradient(180deg, ${theme.background}f0 0%, ${theme.background}b0 100%)`,
        borderBottom: `1px solid ${theme.primary}22`,
        boxShadow: scrolled
          ? `0 0 24px 2px ${theme.primary}18, 0 1px 0 0 ${theme.primary}30`
          : "none",
        transition: "box-shadow 0.4s ease",
      }}
    >
      {/* ── STATUS BAR ── */}
      <div
        className="flex items-center justify-between px-6 py-0.5 text-[10px] tracking-widest font-mono border-b"
        style={{
          color: `${theme.secondary}99`,
          borderColor: `${theme.primary}12`,
          background: `${theme.primary}07`,
        }}
      >
        <div className="flex items-center gap-4">
          <span style={{ color: `${theme.primary}bb` }}>[SYS:OK]</span>
          <span>PORTFOLIO_OS v2.0</span>
          <span>·</span>
          <span>SP.BR / UTC-3</span>
        </div>
        <div className="flex items-center gap-4">
          {/* blinking online dot */}
          <span className="flex items-center gap-1.5">
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: theme.primary }}
            />
            <span>ONLINE</span>
          </span>
          <span style={{ color: `${theme.primary}bb` }}>{time}</span>
          <span>SECTION_{activeIdx}</span>
        </div>
      </div>

      {/* ── MAIN BAR ── */}
      <div className="flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 font-mono"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <span
            className="text-xs leading-none tracking-tight"
            style={{ color: `${theme.primary}55` }}
          >
            ░▒▓
          </span>
          <span
            className="text-sm font-bold tracking-[0.3em]"
            style={{
              color: theme.primary,
              textShadow: `0 0 8px ${theme.primary}88, 0 0 24px ${theme.primary}40`,
            }}
          >
            LUCAS.DEV
          </span>
          <span
            className="text-xs leading-none tracking-tight"
            style={{ color: `${theme.primary}55` }}
          >
            ▓▒░
          </span>
        </motion.div>

        {/* Nav items */}
        <div className="flex items-center gap-1">
          {NAV_SECTIONS.map(({ id, label, index }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                data-cursor
                className="relative flex items-center gap-1 px-3 py-1.5 font-mono text-xs tracking-widest transition-all duration-200 pointer-events-auto group"
                style={{
                  color: isActive ? theme.primary : `${theme.secondary}80`,
                }}
              >
                {/* active bracket left */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      key="bl"
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 4 }}
                      className="text-base font-bold"
                      style={{
                        color: theme.primary,
                        textShadow: `0 0 8px ${theme.primary}`,
                        lineHeight: 1,
                      }}
                    >
                      [
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* index prefix */}
                <span
                  className="text-[9px] opacity-60 font-mono"
                  style={{ color: isActive ? theme.primary : theme.secondary }}
                >
                  {index}/
                </span>

                {/* label */}
                <span
                  style={{
                    textShadow: isActive
                      ? `0 0 8px ${theme.primary}88, 0 0 20px ${theme.primary}40`
                      : "none",
                  }}
                >
                  {label}
                </span>

                {/* active bracket right */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      key="br"
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      className="text-base font-bold"
                      style={{
                        color: theme.primary,
                        textShadow: `0 0 8px ${theme.primary}`,
                        lineHeight: 1,
                      }}
                    >
                      ]
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* sliding underline */}
                {isActive && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
                      boxShadow: `0 0 6px ${theme.primary}`,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* hover bg flash */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ background: `${theme.primary}08` }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
