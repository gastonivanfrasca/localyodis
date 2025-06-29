import { PredefinedSource } from "../types/predefined-sources";
import { Rss, Check } from "lucide-react";

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
        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group
        ${
          isSelected
            ? 'border-zinc-400 dark:border-zinc-600 bg-zinc-200 dark:bg-slate-800'
            : 'border-zinc-300 dark:border-zinc-900 bg-zinc-100 dark:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-slate-800'
        }
      `}
    >
      {/* Selection indicator */}
      <div className={`
        absolute top-3 right-3 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center
        ${
          isSelected
            ? 'border-zinc-500 dark:border-zinc-400 bg-zinc-500 dark:bg-zinc-400'
            : 'border-zinc-400 dark:border-zinc-600 bg-transparent group-hover:border-zinc-500 dark:group-hover:border-zinc-500'
        }
      `}>
        {isSelected && (
          <Check className="w-3 h-3 text-white dark:text-zinc-900" />
        )}
      </div>

      {/* Source info */}
      <div className="pr-8 flex items-start gap-3">
        <div className="bg-zinc-200 dark:bg-slate-800 p-2 rounded-lg mt-1 flex-shrink-0">
          <Rss className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-zinc-800 dark:text-white mb-2 text-base tracking-tight">
            {source.name}
          </h4>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            {source.description}
          </p>
        </div>
      </div>
    </div>
  );
}; 