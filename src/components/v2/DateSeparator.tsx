import { formatDateSeparator } from "../../utils/format";

interface DateSeparatorProps {
  category: string;
}

export const DateSeparator = ({ category }: DateSeparatorProps) => {
  const label = formatDateSeparator(category);
  
  return (
    <div className="flex items-center justify-center my-6 w-full">
      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
      <div className="px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full mx-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
    </div>
  );
}; 