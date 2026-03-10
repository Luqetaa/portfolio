import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../utils/themeContext.jsx";
import { useState, useEffect } from "react";

const NAV_SECTIONS = [
  { id: "hero",     label: "INIT¹" },
  { id: "about",    label: "ABOUT²" },
  { id: "projects", label: "PROJECTS³" },
  { id: "skills",   label: "STACK⁴" },
  { id: "contact",  label: "CONTACT⁵" },
];

export default function NavBar({ onToggleConsole }) {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navColor = "#fff";

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

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 pointer-events-auto select-none nav-grain"
      style={{
        backdropFilter: "blur(12px) saturate(120%)",
        WebkitBackdropFilter: "blur(12px) saturate(120%)",
        background: "transparent",
        color: navColor,
        mixBlendMode: "difference",
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <span className="text-base font-bold tracking-[0.15em]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          LC
        </span>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_SECTIONS.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                data-cursor
                className="relative px-3 py-1.5 font-mono text-xs tracking-widest transition-opacity duration-300 pointer-events-auto"
                style={{ opacity: isActive ? 1 : 0.4 }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Console toggle */}
        <button
          onClick={onToggleConsole}
          data-cursor
          className="font-mono text-[10px] sm:text-xs tracking-widest px-2 sm:px-3 py-1 sm:py-1.5 transition-all duration-200 hover:opacity-70 ml-2 sm:ml-4"
          title="Developer Console (~)"
        >
          &gt;_
        </button>

        {/* Mobile hamburger */}
        <button className="sm:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
          <motion.span animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-5 h-px origin-center bg-current" transition={{ duration: 0.2 }} />
          <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-px bg-current" transition={{ duration: 0.15 }} />
          <motion.span animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-5 h-px origin-center bg-current" transition={{ duration: 0.2 }} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="sm:hidden overflow-hidden"
          >
            {NAV_SECTIONS.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <button key={id} onClick={() => scrollTo(id)}
                  className="w-full flex items-center px-6 py-4 font-mono text-sm tracking-widest transition-opacity duration-200"
                  style={{ opacity: isActive ? 1 : 0.4 }}
                >
                  {label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
