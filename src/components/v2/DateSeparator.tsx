import { formatDateSeparator } from "../../utils/format";

interface DateSeparatorProps {
  category: string;
}

export const DateSeparator = ({ category }: DateSeparatorProps) => {
  const label = formatDateSeparator(category);
  
  return (
    <div className="flex items-center justify-center gap-3 my-3 w-full">
      <div className="w-8 border-t border-gray-300 dark:border-gray-600"></div>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <div className="w-8 border-t border-gray-300 dark:border-gray-600"></div>
    </div>
  );
}; 