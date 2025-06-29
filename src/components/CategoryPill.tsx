import { SourceCategory } from "../types/predefined-sources";
import { Monitor, Newspaper, Microscope, Palette, Code, TrendingUp } from "lucide-react";

type CategoryPillProps = {
  category: SourceCategory;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
};

const getIcon = (iconName: string) => {
  const iconMap = {
    monitor: Monitor,
    newspaper: Newspaper,
    microscope: Microscope,
    palette: Palette,
    code: Code,
    "trending-up": TrendingUp,
  };
  
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
};

export const CategoryPill = ({ category, isSelected, onSelect }: CategoryPillProps) => {
  return (
    <button
      onClick={() => onSelect(category.id)}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 border
        ${
          isSelected
            ? 'bg-zinc-200 dark:bg-slate-800 text-zinc-800 dark:text-white border-zinc-400 dark:border-zinc-600'
            : 'bg-zinc-100 dark:bg-slate-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-900 hover:bg-zinc-200 dark:hover:bg-slate-800'
        }
      `}
    >
      <div className="bg-zinc-200 dark:bg-slate-800 p-1 rounded">
        {getIcon(category.icon)}
      </div>
      <span className="text-xs tracking-tight">{category.name}</span>
    </button>
  );
}; 