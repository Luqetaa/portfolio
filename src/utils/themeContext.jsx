import { createContext, useState, useContext } from "react";

export const themes = {
  royal: {
    name: "ROYAL",
    primary: "#0000FF",
    secondary: "#0000cc",
    accent: "#fff",
    background: "#090a0a",
    text: "#e6e6e6",
    border: "#2a2a5f",
  },
  acid: {
    name: "ACID",
    primary: "#CCFF00",
    secondary: "#a6cc00",
    accent: "#1a1a1a",
    background: "#090a0a",
    text: "#e6e6e6",
    border: "#4a5f2a",
  },
  blaze: {
    name: "BLAZE",
    primary: "#FF0601",
    secondary: "#cc0500",
    accent: "#fff",
    background: "#0a0000",
    text: "#e6e6e6",
    border: "#5f2a2a",
  },
  pulse: {
    name: "PULSE",
    primary: "#FF00E4",
    secondary: "#cc00b6",
    accent: "#fff",
    background: "#0a0014",
    text: "#e6e6e6",
    border: "#5a2a5f",
  },
  ember: {
    name: "EMBER",
    primary: "#FF5A00",
    secondary: "#cc4800",
    accent: "#1a1a1a",
    background: "#0a0500",
    text: "#e6e6e6",
    border: "#5f3a1a",
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState("royal");

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
