import { useTheme } from "../../utils/themeContext.jsx";
import { useState, useEffect } from "react";

export default function NavBar() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "projects", "skills", "contact"];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const sectionId = entry.target.getAttribute("data-section");
            if (sectionId) setActiveSection(sectionId);
          }
        });
      },
      { threshold: [0.3] }
    );

    sections.forEach((section) => {
      const element = document.querySelector(`[data-section="${section}"]`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 border-b bg-[#090a0a]/80 backdrop-blur pointer-events-auto"
      style={{
        borderColor: `${theme.primary}20`,
        backgroundColor: `${theme.background}cc`,
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="font-bold tracking-widest" style={{ color: theme.primary }}>
          PORTFOLIO_V1
        </div>
        <div className="flex gap-8">
          {["hero", "projects", "skills", "contact"].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              data-cursor
              className="text-sm tracking-widest transition-colors pointer-events-auto"
              style={{
                color:
                  activeSection === section ? theme.primary : theme.secondary,
                opacity: activeSection === section ? 1 : 0.6,
              }}
            >
              {section.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
