import { SourceCategory } from "../types/predefined-sources";

type CategoryPillProps = {
  category: SourceCategory;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
};

export const CategoryPill = ({ category, isSelected, onSelect }: CategoryPillProps) => {
  return (
    <button
      onClick={() => onSelect(category.id)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200
        ${
          isSelected
            ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg scale-105'
            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-102'
        }
      `}
    >
      <span className="text-lg">{category.icon}</span>
      <span>{category.name}</span>
    </button>
  );
}; 