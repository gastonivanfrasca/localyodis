import { Check } from "lucide-react";

type ColorPickerProps = {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  className?: string;
};

// Paleta de colores predefinidos y atractivos
const COLOR_PALETTE = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#FDE047", // Yellow
  "#A855F7", // Purple
  "#64748B", // Slate
  "#374151", // Gray
  "#1F2937", // Dark Gray
  "#DC2626", // Dark Red
  "#059669", // Dark Green
  "#7C3AED", // Dark Purple
  "#DB2777", // Dark Pink
];

export const ColorPicker = ({ selectedColor, onColorSelect, className = "" }: ColorPickerProps) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {COLOR_PALETTE.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className="relative w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: color }}
          title={`Select ${color}`}
        >
          {selectedColor === color && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check 
                className="w-4 h-4 drop-shadow-lg" 
                style={{ 
                  color: getBrightness(color) >= 128 ? "#000000" : "#ffffff" 
                }}
              />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

// Función para calcular el brillo del color (reutilizada de generateTextColorForBackground)
const getBrightness = (hexColor: string): number => {
  const color = hexColor.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}; 