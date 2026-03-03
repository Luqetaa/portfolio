import { createContext, useState, useContext } from "react";

export const themes = {
  cyberpunk: {
    name: "Cyberpunk",
    primary: "#caf0e0",
    secondary: "#8dd4c9",
    accent: "#ff006e",
    background: "#090a0a",
    text: "#e6e6e6",
    border: "#4a5f5a",
  },
  neon: {
    name: "Neon",
    primary: "#00ff88",
    secondary: "#00ccff",
    accent: "#ff00ff",
    background: "#0a0014",
    text: "#e6e6e6",
    border: "#00ffcc",
  },
  hacker: {
    name: "Hacker",
    primary: "#00ff00",
    secondary: "#00cc00",
    accent: "#ffff00",
    background: "#000000",
    text: "#00ff00",
    border: "#00cc00",
  },
  lunar: {
    name: "Lunar",
    primary: "#e0d5ff",
    secondary: "#b8a9d1",
    accent: "#8b5a8f",
    background: "#0f0e1a",
    text: "#e6e6e6",
    border: "#6b5a7f",
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState("cyberpunk");

  const switchTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem("portfolio-theme", themeName);
    }
  };

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, switchTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
