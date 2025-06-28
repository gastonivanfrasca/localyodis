import { PredefinedSource } from "../types/predefined-sources";

type SourceCardProps = {
  source: PredefinedSource;
  isSelected: boolean;
  onToggle: (sourceUrl: string) => void;
};

export const SourceCard = ({ source, isSelected, onToggle }: SourceCardProps) => {
  return (
    <div
      onClick={() => onToggle(source.url)}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
            : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-500'
        }
      `}
    >
      {/* Selection indicator */}
      <div className={`
        absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-all duration-200
        ${
          isSelected
            ? 'border-blue-500 bg-blue-500'
            : 'border-gray-300 dark:border-slate-500 bg-transparent'
        }
      `}>
        {isSelected && (
          <svg
            className="w-3 h-3 text-white absolute top-0.5 left-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Source info */}
      <div className="pr-8">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-lg">
          {source.name}
        </h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {source.description}
        </p>
        <div className="mt-3">
          <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
            RSS Feed
          </span>
        </div>
      </div>
    </div>
  );
}; 