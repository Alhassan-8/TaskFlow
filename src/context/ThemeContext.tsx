
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

// Define theme types
export type ThemeBase = "light" | "dark";

export interface CustomTheme {
  id: string;
  name: string;
  base: ThemeBase;
  primaryColor: string;
  accentColor: string;
  isActive: boolean;
}

interface ThemeContextProps {
  currentTheme: string;
  customThemes: CustomTheme[];
  createTheme: (theme: Omit<CustomTheme, "id" | "isActive">) => void;
  applyTheme: (themeId: string) => void;
  deleteTheme: (themeId: string) => void;
  updateSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Default themes
const defaultThemes: CustomTheme[] = [
  {
    id: "system",
    name: "System",
    base: "light", // This will be determined dynamically
    primaryColor: "hsl(235, 86%, 65%)",
    accentColor: "hsl(245, 58%, 51%)",
    isActive: true,
  },
  {
    id: "light",
    name: "Light",
    base: "light",
    primaryColor: "hsl(235, 86%, 65%)",
    accentColor: "hsl(245, 58%, 51%)",
    isActive: false,
  },
  {
    id: "dark",
    name: "Dark",
    base: "dark",
    primaryColor: "hsl(235, 86%, 65%)",
    accentColor: "hsl(245, 58%, 51%)",
    isActive: false,
  },
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(() => {
    const storedThemes = localStorage.getItem("customThemes");
    return storedThemes ? JSON.parse(storedThemes) : defaultThemes;
  });
  
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    const storedTheme = localStorage.getItem("currentTheme");
    return storedTheme || "system";
  });

  // Apply theme colors based on current theme
  useEffect(() => {
    // Find active theme
    const activeTheme = customThemes.find(theme => theme.id === currentTheme);
    
    if (!activeTheme) return;
    
    // Apply base theme (dark/light)
    let themeBase = activeTheme.base;
    
    // Handle system theme for "system" option
    if (activeTheme.id === "system") {
      themeBase = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    if (themeBase === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Apply custom colors
    document.documentElement.style.setProperty("--custom-primary", activeTheme.primaryColor);
    document.documentElement.style.setProperty("--custom-accent", activeTheme.accentColor);
    
    // Save current theme to localStorage
    localStorage.setItem("currentTheme", currentTheme);
  }, [currentTheme, customThemes]);

  // Save custom themes to localStorage
  useEffect(() => {
    localStorage.setItem("customThemes", JSON.stringify(customThemes));
  }, [customThemes]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (currentTheme === "system") {
        // Re-apply system theme when system preference changes
        updateSystemTheme();
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [currentTheme]);

  // Create a new custom theme
  const createTheme = (theme: Omit<CustomTheme, "id" | "isActive">) => {
    const newTheme: CustomTheme = {
      ...theme,
      id: `custom-${Date.now()}`,
      isActive: false,
    };
    
    setCustomThemes(prev => [...prev, newTheme]);
    toast.success(`Theme "${theme.name}" created`);
  };

  // Apply a theme
  const applyTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    
    setCustomThemes(prev => 
      prev.map(theme => ({
        ...theme,
        isActive: theme.id === themeId
      }))
    );
    
    const themeName = customThemes.find(t => t.id === themeId)?.name || "Custom";
    toast.success(`Applied "${themeName}" theme`);
  };

  // Delete a custom theme
  const deleteTheme = (themeId: string) => {
    // Don't allow deleting default themes
    if (["system", "light", "dark"].includes(themeId)) {
      toast.error("Cannot delete default themes");
      return;
    }
    
    // If deleting active theme, switch to system
    if (currentTheme === themeId) {
      applyTheme("system");
    }
    
    setCustomThemes(prev => prev.filter(theme => theme.id !== themeId));
    toast.success("Theme deleted");
  };

  // Update system theme
  const updateSystemTheme = () => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        customThemes,
        createTheme,
        applyTheme,
        deleteTheme,
        updateSystemTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
