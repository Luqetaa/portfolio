import { motion } from "framer-motion";
import { useTheme } from "../../utils/themeContext.jsx";
import { projectsData, statusColors } from "../../utils/projectsData";
import ScanlineBox from "../ui/ScanlineBox";

export default function ProjectsGrid() {
  const { theme } = useTheme();

  return (
    <section data-section="projects" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 pb-6 border-b"
          style={{ borderColor: `${theme.primary}30` }}
        >
          <p className="text-xs font-mono tracking-widest mb-2" style={{ color: theme.secondary }}>02 / WORK</p>
          <h2 className="text-4xl font-bold font-mono tracking-widest" style={{ color: theme.primary }}>
            PROJECTS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <ScanlineBox
                title={project.featured ? "FEATURED" : "PROJECT"}
                glowing={project.featured}
                className="h-full p-6 group cursor-pointer transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold font-mono text-base leading-tight" style={{ color: theme.primary }}>
                      {project.title}
                    </h3>
                    <span
                      className="text-xs font-mono px-2 py-0.5 border shrink-0"
                      style={{ borderColor: statusColors[project.status] || theme.accent, color: statusColors[project.status] || theme.accent }}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: theme.secondary }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 border" style={{ borderColor: `${theme.primary}30`, color: theme.primary }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href={project.link} data-cursor className="inline-block text-xs font-mono tracking-widest opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: theme.accent }}>
                    VIEW PROJECT →
                  </a>
                </div>
              </ScanlineBox>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
