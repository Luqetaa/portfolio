import { useState } from "react";
import BootScreen from "./components/BootScreen";
import TerminalCursor from "./components/TerminalCursor";
import ThemeSwitcher from "./components/ui/ThemeSwitcher";
import ThreeDBackground from "./components/three/ThreeDBackground.jsx";
import NavBar from "./components/navigation/NavBar.jsx";
import HeroSection from "./components/sections/HeroSection.jsx";
import ProjectsGrid from "./components/sections/ProjectsGrid.jsx";
import SkillsTerminal from "./components/sections/SkillsTerminal.jsx";
import ContactSection from "./components/sections/ContactSection.jsx";
import ScrollProgress from "./components/ui/ScrollProgress.jsx";
import StickySection from "./components/ui/StickySection.jsx";
import { ThemeProvider, useTheme } from "./utils/themeContext.jsx";

function AppContent() {
  const [bootFinished, setBootFinished] = useState(false);
  const [insideApp, setInsideApp] = useState(false);
  const { theme } = useTheme();

  if (!bootFinished) {
    return <BootScreen onFinish={() => setBootFinished(true)} />;
  }

  return (
    <div
      onMouseEnter={() => setInsideApp(true)}
      onMouseLeave={() => setInsideApp(false)}
      className={`font-mono overflow-x-hidden${insideApp ? " cursor-hidden" : ""}`}
      style={{ userSelect: "none" }}
    >
      <TerminalCursor enabled={insideApp} />
      <ThemeSwitcher />
      <NavBar />
      <ScrollProgress />

      {/* Sticky overlapping sections — each sticks at top:0, next slides up over it */}
      <main>
        <StickySection index={0} variant="dark">
          <ThreeDBackground />
          <HeroSection />
        </StickySection>

        <StickySection index={1} variant="light">
          <ProjectsGrid />
        </StickySection>

        <StickySection index={2} variant="dark">
          <SkillsTerminal />
        </StickySection>

        <StickySection index={3} variant="light">
          <ContactSection />
        </StickySection>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}