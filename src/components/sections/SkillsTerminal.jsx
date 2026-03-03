import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../utils/themeContext.jsx";
import { skillsData } from "../../utils/projectsData";

export default function SkillsTerminal() {
  const { theme } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayedSkills, setDisplayedSkills] = useState({});
  const [completedCategories, setCompletedCategories] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const totalSkills = Object.values(skillsData).flat().length;
    let currentSkill = 0;

    const typeAllSkills = () => {
      let completed = 0;
      const tempDisplayed = {};

      Object.entries(skillsData).forEach(([category, skills]) => {
        tempDisplayed[category] = [];
        skills.forEach((skill, idx) => {
          setTimeout(
            () => {
              setDisplayedSkills((prev) => ({
                ...prev,
                [category]: [...(prev[category] || []), skill],
              }));
              completed++;
              setCompletedCategories(Math.ceil((completed / totalSkills) * 100));
            },
            currentSkill * 40
          );
          currentSkill++;
        });
      });
    };

    typeAllSkills();
  }, [isInView]);

  return (
    <section
      ref={ref}
      data-section="skills"
      className="relative py-32 px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 pb-6 border-b"
          style={{ borderColor: `${theme.primary}30` }}
        >
          <p className="text-xs font-mono tracking-widest mb-3" style={{ color: `${theme.primary}99` }}>03 / SKILLS</p>
          <h2
            className="text-6xl font-bold mb-1 leading-none"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              color: theme.primary,
              textShadow: `0 0 40px ${theme.primary}22`,
            }}
          >
            Stack
          </h2>
          <motion.div
            className="mt-4 h-px"
            style={{ backgroundColor: `${theme.primary}30` }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: completedCategories / 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
        </motion.div>

        {/* Skills Categories */}
        <div className="space-y-10">
          {Object.entries(skillsData).map(([category, skills], catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: catIdx * 0.1 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="text-sm font-mono font-bold tracking-widest"
                  style={{ color: theme.primary }}
                >
                  [{category.toUpperCase()}]
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: `${theme.primary}30` }}
                />
              </div>

              <div className="flex flex-wrap gap-3 pl-4 border-l-2" style={{ borderColor: `${theme.primary}30` }}>
                {(displayedSkills[category] || []).map((skill, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 border border-dashed text-xs font-mono"
                    style={{
                      borderColor: theme.secondary,
                      color: theme.secondary,
                    }}
                  >
                    ◆ {skill}
                  </motion.span>
                ))}
                {/* Placeholder for typing animation */}
                {skillsData[category].length > (displayedSkills[category] || []).length && (
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ color: theme.primary }}
                  >
                    █
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
