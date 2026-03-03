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
      className="font-mono overflow-x-hidden"
      style={{
        cursor: insideApp ? "none" : "default",
        backgroundColor: theme.background,
        color: theme.text,
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Shared global background */}
      <ThreeDBackground />
      <div className="fixed inset-0 pointer-events-none z-0 scanlines opacity-20" />
      <div className="fixed inset-0 pointer-events-none z-0 vignette" />

      <TerminalCursor enabled={insideApp} />
      <ThemeSwitcher />
      <NavBar />

      {/* Single continuous page */}
      <main className="relative z-10">
        <HeroSection />
        <ProjectsGrid />
        <SkillsTerminal />
        <ContactSection />
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