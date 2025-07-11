import { Palette } from "lucide-react";

type ColorPickerProps = {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  className?: string;
};

export const ColorPicker = ({ selectedColor, onColorSelect, className = "" }: ColorPickerProps) => {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onColorSelect(event.target.value);
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Pick a color:</span>
        </div>
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-400 transition-colors"
          title="Choose color"
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <div 
          className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: selectedColor }}
        />
        <span>Current: {selectedColor.toUpperCase()}</span>
      </div>
    </div>
  );
}; 