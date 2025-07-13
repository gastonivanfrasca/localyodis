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
  return IconComponent ? <IconComponent className="w-3 h-3" /> : null;
};

export const CategoryPill = ({ category, isSelected, onSelect }: CategoryPillProps) => {
  return (
    <button
      onClick={() => onSelect(category.id)}
      className={`
        flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 border text-nowrap flex-shrink-0
        ${
          isSelected
            ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 border-zinc-800 dark:border-zinc-200'
            : 'bg-zinc-100 dark:bg-slate-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-900 hover:bg-zinc-200 dark:hover:bg-slate-800'
        }
      `}
    >
      <div className={`p-0.5 rounded ${isSelected ? 'bg-zinc-600 dark:bg-zinc-400' : 'bg-zinc-200 dark:bg-slate-800'}`}>
        {getIcon(category.icon)}
      </div>
      <span className="text-xs tracking-tight">{category.name}</span>
    </button>
  );
}; 