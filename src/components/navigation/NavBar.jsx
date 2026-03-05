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
  const [mobileOpen, setMobileOpen] = useState(false);
  const time = useClock();

  // Determine if current section is on a light background
  const LIGHT_SECTIONS = ["projects", "contact"];
  const isOnLight = LIGHT_SECTIONS.includes(activeSection);

  // Adaptive palette
  const navBg = isOnLight
    ? "linear-gradient(180deg, #f0f0f0f0 0%, #f0f0f0b0 100%)"
    : `linear-gradient(180deg, ${theme.background}f0 0%, ${theme.background}b0 100%)`;
  const navBorder = isOnLight ? "#00000012" : `${theme.primary}22`;
  const navShadow = scrolled
    ? isOnLight
      ? "0 1px 12px rgba(0,0,0,0.08)"
      : `0 0 24px 2px ${theme.primary}18, 0 1px 0 0 ${theme.primary}30`
    : "none";
  const primaryColor = isOnLight ? "#1a1a1a" : theme.primary;
  const secondaryColor = isOnLight ? "#666" : `${theme.secondary}80`;
  const statusBg = isOnLight ? "#00000007" : `${theme.primary}07`;
  const statusBorder = isOnLight ? "#00000012" : `${theme.primary}12`;
  const statusText = isOnLight ? "#888" : `${theme.secondary}99`;
  const dotColor = isOnLight ? theme.accent : theme.primary;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    setMobileOpen(false);
    document.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: "smooth" });
  };

  const activeIdx = NAV_SECTIONS.find((s) => s.id === activeSection)?.index ?? "01";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 pointer-events-auto select-none transition-all duration-500"
      style={{
        backdropFilter: "blur(18px) saturate(150%)",
        WebkitBackdropFilter: "blur(18px) saturate(150%)",
        background: navBg,
        borderBottom: `1px solid ${navBorder}`,
        boxShadow: navShadow,
      }}
    >
      {/* STATUS BAR — hidden on mobile */}
      <div
        className="hidden sm:flex items-center justify-between px-6 py-0.5 text-[10px] tracking-widest font-mono border-b transition-colors duration-500"
        style={{ color: statusText, borderColor: statusBorder, background: statusBg }}
      >
        <div className="flex items-center gap-4">
          <span style={{ color: isOnLight ? theme.accent : `${theme.primary}bb` }}>[SYS:OK]</span>
          <span>PORTFOLIO_OS v2.0</span>
          <span>·</span>
          <span>SP.BR / UTC-3</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: dotColor }}
            />
            <span>ONLINE</span>
          </span>
          <span style={{ color: isOnLight ? theme.accent : `${theme.primary}bb` }}>{time}</span>
          <span>SECTION_{activeIdx}</span>
        </div>
      </div>

      {/* MAIN BAR */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <motion.div className="flex items-center gap-2 font-mono" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          <span className="text-xs leading-none tracking-tight transition-colors duration-500" style={{ color: isOnLight ? "#ccc" : `${theme.primary}55` }}>░▒▓</span>
          <span className="text-sm font-bold tracking-[0.3em] transition-colors duration-500" style={{ color: primaryColor, textShadow: isOnLight ? "none" : `0 0 8px ${theme.primary}88, 0 0 24px ${theme.primary}40` }}>
            LUCAS.DEV
          </span>
          <span className="text-xs leading-none tracking-tight transition-colors duration-500" style={{ color: isOnLight ? "#ccc" : `${theme.primary}55` }}>▓▒░</span>
        </motion.div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_SECTIONS.map(({ id, label, index }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                data-cursor
                className="relative flex items-center gap-1 px-3 py-1.5 font-mono text-xs tracking-widest transition-all duration-300 pointer-events-auto group"
                style={{ color: isActive ? primaryColor : secondaryColor }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.span key="bl" initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 4 }}
                      className="text-base font-bold" style={{ color: primaryColor, textShadow: isOnLight ? "none" : `0 0 8px ${theme.primary}`, lineHeight: 1 }}>
                      [
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="text-[9px] opacity-60 font-mono" style={{ color: isActive ? primaryColor : secondaryColor }}>{index}/</span>
                <span style={{ textShadow: isActive && !isOnLight ? `0 0 8px ${theme.primary}88, 0 0 20px ${theme.primary}40` : "none" }}>{label}</span>
                <AnimatePresence>
                  {isActive && (
                    <motion.span key="br" initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }}
                      className="text-base font-bold" style={{ color: primaryColor, textShadow: isOnLight ? "none" : `0 0 8px ${theme.primary}`, lineHeight: 1 }}>
                      ]
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div layoutId="navUnderline" className="absolute bottom-0 left-0 right-0 h-px"
                    style={{
                      background: isOnLight
                        ? `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`
                        : `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
                      boxShadow: isOnLight ? "none" : `0 0 6px ${theme.primary}`,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" style={{ background: isOnLight ? "#0000000a" : `${theme.primary}08` }} />
              </button>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
          <motion.span animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-5 h-px origin-center" style={{ background: primaryColor }} transition={{ duration: 0.2 }} />
          <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-px" style={{ background: primaryColor }} transition={{ duration: 0.15 }} />
          <motion.span animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-5 h-px origin-center" style={{ background: primaryColor }} transition={{ duration: 0.2 }} />
        </button>
      </div>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="sm:hidden overflow-hidden border-t"
            style={{ borderColor: isOnLight ? "#00000012" : `${theme.primary}22`, background: isOnLight ? "#f0f0f0f5" : `${theme.background}f5` }}
          >
            {NAV_SECTIONS.map(({ id, label, index }) => {
              const isActive = activeSection === id;
              return (
                <button key={id} onClick={() => scrollTo(id)}
                  className="w-full flex items-center gap-4 px-6 py-4 font-mono text-sm tracking-widest border-b transition-all duration-200"
                  style={{
                    borderColor: isOnLight ? "#00000008" : `${theme.primary}12`,
                    color: isActive ? primaryColor : secondaryColor,
                    background: isActive ? (isOnLight ? "#0000000a" : `${theme.primary}08`) : "transparent",
                    textShadow: isActive && !isOnLight ? `0 0 8px ${theme.primary}60` : "none",
                  }}
                >
                  <span className="text-[10px] opacity-50">{index}/</span>
                  <span>{isActive ? `[ ${label} ]` : label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
