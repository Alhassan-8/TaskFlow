
import { useState } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import ThemeSettings from "./ThemeSettings";

export function ThemeToggle() {
  const { customThemes, currentTheme, applyTheme } = useTheme();
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);
  
  // Find the current active theme
  const activeTheme = customThemes.find(t => t.id === currentTheme);
  const isDarkMode = activeTheme?.base === "dark" || 
    (activeTheme?.id === "system" && 
     window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    // If current theme is system or light, switch to dark
    // If current theme is dark, switch to light
    // If current theme is custom, switch to system
    if (currentTheme === "system" || currentTheme === "light") {
      applyTheme("dark");
    } else if (currentTheme === "dark") {
      applyTheme("light");
    } else {
      applyTheme("system");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleTheme}
        className="rounded-full"
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => setThemeSettingsOpen(true)}
        className="rounded-full"
        aria-label="Theme settings"
      >
        <Palette className="h-5 w-5" />
      </Button>
      
      <ThemeSettings 
        open={themeSettingsOpen} 
        onOpenChange={setThemeSettingsOpen} 
      />
    </div>
  );
}
