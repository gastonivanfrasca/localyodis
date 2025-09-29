import { Check, Plus, Rss } from "lucide-react";

import { PredefinedSource } from "../types/predefined-sources";

type DiscoverSourceCardProps = {
  source: PredefinedSource;
  isAdded: boolean;
  onAdd: (sourceUrl: string) => void;
  onRemove?: (sourceUrl: string) => void;
};

export const DiscoverSourceCard = ({ source, isAdded, onAdd, onRemove }: DiscoverSourceCardProps) => {
  const canRemove = Boolean(onRemove);

  return (
    <div
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 group
        ${
          isAdded
            ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/20'
            : 'border-zinc-300 dark:border-zinc-900 bg-zinc-100 dark:bg-slate-900 hover:bg-zinc-200 dark:hover:bg-slate-800'
        }
      `}
    >
      {/* Action indicator */}
      <button
        type="button"
        className={`
          absolute top-3 right-3 w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center
          ${
            isAdded
              ? `border-green-500 dark:border-green-400 bg-green-500 dark:bg-green-400 ${
                  canRemove
                    ? 'hover:bg-green-600 dark:hover:bg-green-300'
                    : 'opacity-80 cursor-not-allowed'
                }`
              : 'border-zinc-400 dark:border-zinc-600 bg-transparent group-hover:border-zinc-500 dark:group-hover:border-zinc-500'
          }
        `}
        onClick={(event) => {
          event.stopPropagation();
          if (isAdded) {
            if (!canRemove) {
              return;
            }
            onRemove?.(source.url);
          } else {
            onAdd(source.url);
          }
        }}
        aria-label={isAdded ? (canRemove ? 'Remove source' : 'Source already added') : 'Add source'}
        disabled={isAdded && !canRemove}
      >
        {isAdded ? (
          <Check className="w-4 h-4 text-white dark:text-zinc-900" />
        ) : (
          <Plus className="w-4 h-4 text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-800 dark:group-hover:text-zinc-200" />
        )}
      </button>

      {/* Source info */}
      <div className="pr-10 flex items-start gap-3">
        <div className={`
          p-2 rounded-lg mt-1 flex-shrink-0
          ${
            isAdded
              ? 'bg-green-200 dark:bg-green-900/50'
              : 'bg-zinc-200 dark:bg-slate-800'
          }
        `}>
          <Rss className={`
            w-4 h-4
            ${
              isAdded
                ? 'text-green-700 dark:text-green-300'
                : 'text-zinc-700 dark:text-zinc-300'
            }
          `} />
        </div>
        <div className="flex-1">
          <h4 className={`
            font-semibold mb-2 text-base tracking-tight
            ${
              isAdded
                ? 'text-green-800 dark:text-green-200'
                : 'text-zinc-800 dark:text-white'
            }
          `}>
            {source.name}
          </h4>
          <p className={`
            text-sm leading-relaxed
            ${
              isAdded
                ? 'text-green-600 dark:text-green-400'
                : 'text-zinc-600 dark:text-zinc-400'
            }
          `}>
            {source.description}
          </p>
          {isAdded && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium">
                <Check className="w-3 h-3" />
                {canRemove ? 'Added · Click to remove' : 'Added'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 