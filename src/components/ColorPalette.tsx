
import React from 'react';
import { cn } from "@/lib/utils";
import { Check, Layers } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ColorPaletteProps {
  selectedColor?: string;
  onSelectColor: (color: string) => void;
  showHarmonies?: boolean;
}

// Helper functions for color harmonies
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

// Convert RGB to HSL
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Convert HSL to RGB
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

// Generate complementary color (opposite on the color wheel)
const getComplementary = (hex: string): string => {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const newHue = (h + 180) % 360;
  const [newR, newG, newB] = hslToRgb(newHue, s, l);
  return rgbToHex(newR, newG, newB);
};

// Generate analogous colors (adjacent on the color wheel)
const getAnalogous = (hex: string): string[] => {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  
  const hue1 = (h + 30) % 360;
  const hue2 = (h - 30 + 360) % 360;
  
  const [r1, g1, b1] = hslToRgb(hue1, s, l);
  const [r2, g2, b2] = hslToRgb(hue2, s, l);
  
  return [rgbToHex(r1, g1, b1), rgbToHex(r2, g2, b2)];
};

export const ColorPalette = ({ selectedColor, onSelectColor, showHarmonies = false }: ColorPaletteProps) => {
  const presetColors = [
    { name: 'Purple', value: '#9b87f5' },
    { name: 'Ocean Blue', value: '#0EA5E9' },
    { name: 'Magenta', value: '#D946EF' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Red', value: '#ea384c' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Indigo', value: '#6366f1' },
  ];

  // Generate harmonies for selected color
  const generateHarmonies = (color: string) => {
    if (!color) return [];
    
    const complementary = getComplementary(color);
    const analogous = getAnalogous(color);
    
    return [
      { name: 'Complementary', value: complementary },
      { name: 'Analogous 1', value: analogous[0] },
      { name: 'Analogous 2', value: analogous[1] },
    ];
  };

  const harmonies = selectedColor ? generateHarmonies(selectedColor) : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {presetColors.map((color) => (
          <button
            key={color.value}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              "border-2 transition-all duration-200",
              selectedColor === color.value ? "border-primary" : "border-transparent",
            )}
            style={{ backgroundColor: color.value }}
            onClick={() => onSelectColor(color.value)}
            title={color.name}
          >
            {selectedColor === color.value && (
              <Check className="h-4 w-4 text-white" />
            )}
          </button>
        ))}
      </div>
      
      {showHarmonies && selectedColor && (
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
            <Layers className="h-3 w-3" />
            <span>Color Harmonies</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {harmonies.map((color) => (
              <TooltipProvider key={color.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="w-full h-8 rounded-md flex items-center justify-center hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: color.value }}
                      onClick={() => onSelectColor(color.value)}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{color.name}</p>
                    <p className="text-xs opacity-80">{color.value}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
