
import React from 'react';
import { cn } from "@/lib/utils";
import { Circle, Check } from "lucide-react";

interface ColorPaletteProps {
  selectedColor?: string;
  onSelectColor: (color: string) => void;
}

export const ColorPalette = ({ selectedColor, onSelectColor }: ColorPaletteProps) => {
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

  return (
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
  );
};
