
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Palette, Save, Trash2, Check, Clock, Download, Upload, Layers } from "lucide-react";
import { useTheme, CustomTheme, ThemeBase } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ColorPalette } from "./ColorPalette";
import { toast } from "sonner";

interface ThemeSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ThemeSettings({ open, onOpenChange }: ThemeSettingsProps) {
  const { customThemes, createTheme, applyTheme, deleteTheme, currentTheme, recentThemes, exportTheme, importTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<string>("browse");
  const [newThemeName, setNewThemeName] = useState<string>("My Custom Theme");
  const [newThemeBase, setNewThemeBase] = useState<ThemeBase>("light");
  const [newPrimaryColor, setNewPrimaryColor] = useState<string>("#6366f1");
  const [newAccentColor, setNewAccentColor] = useState<string>("#4f46e5");
  const [importText, setImportText] = useState<string>("");

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
  
  const handleExportTheme = (themeId: string) => {
    const themeData = exportTheme(themeId);
    if (themeData) {
      // Copy to clipboard
      navigator.clipboard.writeText(themeData)
        .then(() => toast.success("Theme copied to clipboard"))
        .catch(() => toast.error("Failed to copy to clipboard"));
    }
  };
  
  const handleImportTheme = () => {
    if (!importText.trim()) {
      toast.error("Please paste theme data");
      return;
    }
    
    const success = importTheme(importText);
    if (success) {
      setImportText("");
      setActiveTab("browse");
    }
  };

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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="browse">Browse Themes</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="import">Import/Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            {recentThemes.length > 0 && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Recently Used</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentThemes.map(themeId => {
                    const theme = customThemes.find(t => t.id === themeId);
                    if (!theme) return null;
                    return (
                      <Button 
                        key={themeId} 
                        variant={currentTheme === themeId ? "default" : "outline"}
                        size="sm"
                        onClick={() => applyTheme(themeId)}
                        className="flex gap-2"
                      >
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: theme.primaryColor }} 
                        />
                        {theme.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
            
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
                  
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportTheme(theme.id);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
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
                <div className="space-y-4">
                  <ColorPalette
                    selectedColor={newPrimaryColor}
                    onSelectColor={setNewPrimaryColor}
                    showHarmonies={true}
                  />
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
                </div>
                <p className="text-xs text-muted-foreground">
                  Used for buttons, active items, and important UI elements
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="space-y-4">
                  <ColorPalette
                    selectedColor={newAccentColor}
                    onSelectColor={setNewAccentColor}
                    showHarmonies={true}
                  />
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
          
          <TabsContent value="import" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="import-theme">Import Theme</Label>
                <div className="border rounded-md p-4 bg-muted/30 space-y-4">
                  <textarea 
                    id="import-theme"
                    className="w-full h-32 rounded-md p-3 bg-background border resize-none"
                    placeholder='Paste theme data here: {"name":"My Theme","base":"light","primaryColor":"#6366f1","accentColor":"#4f46e5"}'
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                  />
                  <Button 
                    onClick={handleImportTheme}
                    className="w-full flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import Theme
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste theme data that you've received from another user
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Export My Themes</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Select a theme to export and share with others
                </p>
                <div className="space-y-2">
                  {customThemes
                    .filter(theme => !["system", "light", "dark"].includes(theme.id))
                    .map(theme => (
                      <Card key={theme.id} className="p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: theme.primaryColor }} 
                          />
                          <span>{theme.name}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportTheme(theme.id)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Copy
                        </Button>
                      </Card>
                    ))}
                    
                  {customThemes.filter(theme => !["system", "light", "dark"].includes(theme.id)).length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                      No custom themes created yet. Create one in the "Create New" tab.
                    </p>
                  )}
                </div>
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
