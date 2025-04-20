
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Palette, Save, Trash2, Check } from "lucide-react";
import { useTheme, CustomTheme, ThemeBase } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ThemeSettings({ open, onOpenChange }: ThemeSettingsProps) {
  const { customThemes, createTheme, applyTheme, deleteTheme, currentTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<string>("browse");
  const [newThemeName, setNewThemeName] = useState<string>("My Custom Theme");
  const [newThemeBase, setNewThemeBase] = useState<ThemeBase>("light");
  const [newPrimaryColor, setNewPrimaryColor] = useState<string>("#6366f1");
  const [newAccentColor, setNewAccentColor] = useState<string>("#4f46e5");

  const handleCreateTheme = () => {
    createTheme({
      name: newThemeName.trim() || "Custom Theme",
      base: newThemeBase,
      primaryColor: newPrimaryColor,
      accentColor: newAccentColor
    });
    
    // Reset form
    setNewThemeName("My Custom Theme");
    setActiveTab("browse");
  };

  // Preview component to show how the theme will look
  const ThemePreview = ({ base, primary, accent }: { base: ThemeBase; primary: string; accent: string }) => {
    const isDark = base === "dark";
    
    return (
      <div className={cn(
        "p-4 rounded-md border transition-colors",
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800",
      )}>
        <div className="text-sm font-medium mb-2">Theme Preview</div>
        <div className="flex gap-2 mb-2">
          <div 
            className="w-8 h-8 rounded-full" 
            style={{ backgroundColor: primary }} 
            title="Primary color"
          />
          <div 
            className="w-8 h-8 rounded-full" 
            style={{ backgroundColor: accent }} 
            title="Accent color"
          />
        </div>
        <div className="flex gap-2 mb-3">
          <button 
            className="px-2 py-1 rounded-md text-xs text-white"
            style={{ backgroundColor: primary }}
          >
            Primary Button
          </button>
          <button 
            className="px-2 py-1 rounded-md text-xs text-white"
            style={{ backgroundColor: accent }}
          >
            Accent Button
          </button>
        </div>
        <div 
          className="px-3 py-2 rounded-md text-xs mb-2"
          style={{ 
            backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", 
            borderLeft: `3px solid ${primary}`
          }}
        >
          Card with primary border
        </div>
        <div 
          className="px-3 py-2 rounded-md text-xs"
          style={{ 
            backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", 
            borderLeft: `3px solid ${accent}`
          }}
        >
          Card with accent border
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </DialogTitle>
          <DialogDescription>
            Customize the appearance of your TaskFlow application
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="browse">Browse Themes</TabsTrigger>
            <TabsTrigger value="create">Create New Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customThemes.map((theme) => (
                <Card 
                  key={theme.id} 
                  className={cn(
                    "p-3 cursor-pointer hover:shadow-md transition-shadow",
                    theme.id === currentTheme && "ring-2 ring-primary"
                  )}
                  onClick={() => applyTheme(theme.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{theme.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {theme.base === "dark" ? "Dark base" : "Light base"}
                      </p>
                    </div>
                    {theme.id === currentTheme && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex gap-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: theme.primaryColor }} 
                      title="Primary color"
                    />
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: theme.accentColor }} 
                      title="Accent color"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    {!["system", "light", "dark"].includes(theme.id) && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTheme(theme.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  placeholder="My Custom Theme"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Base Theme</Label>
                <RadioGroup 
                  value={newThemeBase} 
                  onValueChange={(value) => setNewThemeBase(value as ThemeBase)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="cursor-pointer">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="cursor-pointer">Dark</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={newPrimaryColor}
                    onChange={(e) => setNewPrimaryColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={newPrimaryColor}
                    onChange={(e) => setNewPrimaryColor(e.target.value)}
                    className="flex-1"
                    placeholder="#6366f1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Used for buttons, active items, and important UI elements
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="accent-color"
                    type="color"
                    value={newAccentColor}
                    onChange={(e) => setNewAccentColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={newAccentColor}
                    onChange={(e) => setNewAccentColor(e.target.value)}
                    className="flex-1"
                    placeholder="#4f46e5"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Used for highlights, secondary actions, and decorative elements
                </p>
              </div>
              
              <div>
                <Label className="mb-2 block">Preview</Label>
                <ThemePreview 
                  base={newThemeBase} 
                  primary={newPrimaryColor} 
                  accent={newAccentColor} 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This preview shows how your theme will look. Dark/light base themes will still affect many other colors automatically.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {activeTab === "create" ? (
            <Button onClick={handleCreateTheme} className="mt-4">
              <Save className="mr-2 h-4 w-4" />
              Save Theme
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
