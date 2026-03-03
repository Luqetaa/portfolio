import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../utils/themeContext.jsx";
import { projectsData } from "../../utils/projectsData";
import ProjectModal from "../ui/ProjectModal";

const SERIF = "'Playfair Display', Georgia, serif";

export default function ProjectsGrid() {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const activeProject = projectsData[hovered];

  return (
    <section data-section="projects" className="relative py-32 px-6 md:px-12">
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="w-12 h-px" style={{ background: theme.primary }} />
          <span
            className="text-xs tracking-[0.3em] font-mono"
            style={{ color: `${theme.primary}99` }}
          >
            SELECTED WORK
          </span>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-start">

          {/* Left — list */}
          <div>
            {/* Big serif heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-6xl md:text-8xl mb-14 leading-none"
              style={{
                fontFamily: SERIF,
                fontWeight: 900,
                color: theme.primary,
                textShadow: `0 0 60px ${theme.primary}22`,
              }}
            >
              Projects
            </motion.h2>

            {/* Project rows */}
            <div>
              {projectsData.map((project, i) => {
                const isActive = hovered === i;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div
                      className="border-t py-6 flex items-center justify-between gap-4 group transition-all duration-300"
                      style={{
                        borderColor: isActive ? `${theme.primary}60` : `${theme.primary}20`,
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setHovered(i)}
                      onClick={() => setSelectedProject(project)}
                      data-cursor
                    >
                      <div className="flex items-baseline gap-6 min-w-0">
                        {/* Index */}
                        <span
                          className="text-xs font-mono shrink-0 tabular-nums transition-colors duration-300"
                          style={{ color: isActive ? theme.primary : `${theme.secondary}50` }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Title */}
                        <span
                          className="text-3xl md:text-5xl leading-none truncate transition-all duration-300"
                          style={{
                            fontFamily: SERIF,
                            fontWeight: 700,
                            fontStyle: isActive ? "italic" : "normal",
                            color: isActive ? theme.primary : theme.text,
                            textShadow: isActive ? `0 0 30px ${theme.primary}40` : "none",
                          }}
                        >
                          {project.title}
                        </span>
                      </div>

                      {/* Right side: category · year + arrow */}
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="hidden md:flex flex-col items-end gap-0.5">
                          <span
                            className="text-xs font-mono tracking-widest uppercase"
                            style={{ color: `${theme.secondary}80` }}
                          >
                            {project.category}
                          </span>
                          <span
                            className="text-xs font-mono"
                            style={{ color: `${theme.secondary}50` }}
                          >
                            {project.year}
                          </span>
                        </div>

                        {/* Arrow — only visible on active */}
                        <motion.span
                          animate={{
                            opacity: isActive ? 1 : 0,
                            x: isActive ? 0 : -6,
                            rotate: isActive ? 0 : -20,
                          }}
                          transition={{ duration: 0.25 }}
                          className="text-xl font-mono shrink-0"
                          style={{ color: theme.primary }}
                        >
                          ↗
                        </motion.span>
                      </div>
                    </div>

                    {/* Active underline */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          key="underline"
                          initial={{ scaleX: 0, originX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          transition={{ duration: 0.3 }}
                          className="h-px"
                          style={{
                            background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent}66, transparent)`,
                            boxShadow: `0 0 8px ${theme.primary}60`,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Bottom border */}
              <div className="border-t" style={{ borderColor: `${theme.primary}20` }} />
            </div>
          </div>

          {/* Right — sticky image preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block sticky top-28 self-start"
            style={{ width: "420px" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(20%) brightness(0.75)" }}
                />
                {/* Tinted overlay matching theme */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}18, ${theme.background}88)`,
                    mixBlendMode: "multiply",
                  }}
                />
                {/* Bottom info strip */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between"
                  style={{
                    background: `linear-gradient(to top, ${theme.background}ee 0%, transparent 100%)`,
                  }}
                >
                  <div>
                    <p
                      className="text-xs font-mono tracking-widest mb-1"
                      style={{ color: `${theme.secondary}99` }}
                    >
                      {activeProject.category} · {activeProject.year}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProject.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 border"
                          style={{ borderColor: `${theme.primary}40`, color: `${theme.primary}cc` }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    data-cursor
                    onClick={() => setSelectedProject(activeProject)}
                    className="text-xs font-mono tracking-widest border px-3 py-1.5 transition-all duration-200 hover:opacity-80"
                    style={{ borderColor: theme.primary, color: theme.primary }}
                  >
                    VIEW →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

