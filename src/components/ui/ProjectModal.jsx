import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useTheme } from "../../utils/themeContext.jsx";
import { statusColors } from "../../utils/projectsData";

const SERIF = "'Playfair Display', Georgia, serif";

export default function ProjectModal({ project, onClose }) {
  const { theme } = useTheme();

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(20px) saturate(120%)",
              WebkitBackdropFilter: "blur(20px) saturate(120%)",
              background: `${theme.background}d0`,
            }}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full md:max-w-3xl overflow-hidden"
            style={{
              backgroundColor: theme.background,
              borderTop: `1px solid ${theme.primary}30`,
              borderLeft: `1px solid ${theme.primary}15`,
              borderRight: `1px solid ${theme.primary}15`,
            }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image banner */}
            {project.image && (
              <div className="relative overflow-hidden" style={{ height: "220px" }}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(30%) brightness(0.6)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, transparent 40%, ${theme.background} 100%)`,
                  }}
                />
                {/* Close button over image */}
                <button
                  data-cursor
                  onClick={onClose}
                  className="absolute top-4 right-4 text-xs font-mono tracking-widest border px-3 py-1.5 transition-opacity hover:opacity-80"
                  style={{
                    borderColor: `${theme.primary}60`,
                    color: theme.primary,
                    background: `${theme.background}cc`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  ESC / CLOSE
                </button>
              </div>
            )}

            <div className="px-8 pb-10 pt-2">
              {/* Title block */}
              <div className="flex items-start justify-between gap-6 mb-3">
                <h2
                  className="text-4xl md:text-5xl leading-tight"
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 700,
                    fontStyle: "italic",
                    color: theme.primary,
                    textShadow: `0 0 40px ${theme.primary}30`,
                  }}
                >
                  {project.title}
                </h2>
                <span
                  className="text-[10px] font-mono tracking-widest border px-2.5 py-1 shrink-0 mt-2"
                  style={{
                    borderColor: statusColors[project.status] || theme.accent,
                    color: statusColors[project.status] || theme.accent,
                  }}
                >
                  {project.status}
                </span>
              </div>

              {/* Category + year */}
              {(project.category || project.year) && (
                <p
                  className="text-xs font-mono tracking-widest mb-5"
                  style={{ color: `${theme.secondary}80` }}
                >
                  {project.category}{project.year ? ` · ${project.year}` : ""}
                </p>
              )}

              {/* Divider */}
              <div
                className="h-px mb-6"
                style={{
                  background: `linear-gradient(90deg, ${theme.primary}50, transparent)`,
                }}
              />

              {/* Description */}
              <p
                className="text-base leading-relaxed mb-6"
                style={{
                  color: `${theme.text}cc`,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.85rem",
                }}
              >
                {project.longDescription || project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-0.5 border"
                    style={{ borderColor: `${theme.primary}30`, color: `${theme.primary}bb` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-4">
                {project.demo && project.demo !== "#" && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor
                    className="font-mono text-sm tracking-widest border px-6 py-3 transition-all duration-200 hover:opacity-80"
                    style={{
                      borderColor: theme.primary,
                      color: theme.primary,
                    }}
                  >
                    LIVE DEMO ↗
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor
                    className="font-mono text-sm tracking-widest border px-6 py-3 transition-all duration-200 hover:opacity-80"
                    style={{
                      borderColor: `${theme.primary}40`,
                      color: `${theme.secondary}`,
                    }}
                  >
                    GITHUB ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
