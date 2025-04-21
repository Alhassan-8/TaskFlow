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
  recentThemes: string[];
  createTheme: (theme: Omit<CustomTheme, "id" | "isActive">) => void;
  applyTheme: (themeId: string) => void;
  deleteTheme: (themeId: string) => void;
  updateSystemTheme: () => void;
  exportTheme: (themeId: string) => string;
  importTheme: (themeData: string) => boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Default themes
const defaultThemes: CustomTheme[] = [
  {
    id: "system",
    name: "System",
    base: "dark",
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

// Helper function to convert hex to HSL
const hexToHSL = (hex: string): string => {
  // Remove the # if present
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find the min and max values to compute the lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Calculate lightness
  let l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    // Calculate saturation
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);

    // Calculate hue
    if (max === r) {
      h = (g - b) / (max - min) + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / (max - min) + 2;
    } else if (max === b) {
      h = (r - g) / (max - min) + 4;
    }

    h = h * 60;
  }

  // Round values
  h = Math.round(h);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(() => {
    const storedThemes = localStorage.getItem("customThemes");
    return storedThemes ? JSON.parse(storedThemes) : defaultThemes;
  });

  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    const storedTheme = localStorage.getItem("currentTheme");
    return storedTheme || "dark";
  });

  // Track recently used themes (last 5)
  const [recentThemes, setRecentThemes] = useState<string[]>(() => {
    const storedRecent = localStorage.getItem("recentThemes");
    return storedRecent ? JSON.parse(storedRecent) : ["system"];
  });

  // Apply theme colors based on current theme
  useEffect(() => {
    // Find active theme
    const activeTheme = customThemes.find((theme) => theme.id === currentTheme);

    if (!activeTheme) return;

    // Apply base theme (dark/light)
    let themeBase = activeTheme.base;

    // Handle system theme for "system" option
    if (activeTheme.id === "system") {
      themeBase = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    if (themeBase === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Convert colors to HSL format if they're in hex format
    let primaryColor = activeTheme.primaryColor;
    let accentColor = activeTheme.accentColor;

    // Check if the color is in hex format and convert to HSL
    if (primaryColor.startsWith("#")) {
      primaryColor = hexToHSL(primaryColor);
    }

    if (accentColor.startsWith("#")) {
      accentColor = hexToHSL(accentColor);
    }

    // Apply custom colors as CSS variables
    document.documentElement.style.setProperty(
      "--custom-primary",
      primaryColor
    );
    document.documentElement.style.setProperty("--custom-accent", accentColor);

    // Save current theme to localStorage
    localStorage.setItem("currentTheme", currentTheme);

    // Update recent themes
    setRecentThemes((prev) => {
      const newRecent = [
        currentTheme,
        ...prev.filter((id) => id !== currentTheme),
      ].slice(0, 5);
      localStorage.setItem("recentThemes", JSON.stringify(newRecent));
      return newRecent;
    });

    // Log for debugging
    console.log("Theme applied:", {
      id: activeTheme.id,
      base: themeBase,
      primaryColor,
      accentColor,
    });
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

    setCustomThemes((prev) => [...prev, newTheme]);
    toast.success(`Theme "${theme.name}" created`);
  };

  // Apply a theme
  const applyTheme = (themeId: string) => {
    setCurrentTheme(themeId);

    setCustomThemes((prev) =>
      prev.map((theme) => ({
        ...theme,
        isActive: theme.id === themeId,
      }))
    );

    const themeName =
      customThemes.find((t) => t.id === themeId)?.name || "Custom";
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

    setCustomThemes((prev) => prev.filter((theme) => theme.id !== themeId));
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

  // Export theme as JSON string
  const exportTheme = (themeId: string): string => {
    const theme = customThemes.find((t) => t.id === themeId);
    if (!theme) {
      toast.error("Theme not found");
      return "";
    }

    // Create a version without the isActive property and with a generic id
    const exportableTheme = {
      name: theme.name,
      base: theme.base,
      primaryColor: theme.primaryColor,
      accentColor: theme.accentColor,
    };

    return JSON.stringify(exportableTheme);
  };

  // Import theme from JSON string
  const importTheme = (themeData: string): boolean => {
    try {
      const importedTheme = JSON.parse(themeData);

      // Validate theme data
      if (
        !importedTheme.name ||
        !importedTheme.base ||
        !importedTheme.primaryColor ||
        !importedTheme.accentColor
      ) {
        toast.error("Invalid theme data");
        return false;
      }

      // Create the theme
      createTheme({
        name: `${importedTheme.name} (Imported)`,
        base: importedTheme.base as ThemeBase,
        primaryColor: importedTheme.primaryColor,
        accentColor: importedTheme.accentColor,
      });

      return true;
    } catch (error) {
      toast.error("Failed to import theme");
      console.error("Theme import error:", error);
      return false;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        customThemes,
        recentThemes,
        createTheme,
        applyTheme,
        deleteTheme,
        updateSystemTheme,
        exportTheme,
        importTheme,
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
