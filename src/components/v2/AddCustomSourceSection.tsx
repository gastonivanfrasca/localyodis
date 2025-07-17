import { ActionTypes, useMainContext } from "../../context/main";
import { Link, Plus } from "lucide-react";

import { useError } from "../../utils/useError";
import { useI18n } from "../../context/i18n";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const generateRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor.padStart(6, "0");
};

const generateTextColorForBackground = (bgColor: string) => {
  const r = parseInt(bgColor.substr(1, 2), 16);
  const g = parseInt(bgColor.substr(3, 2), 16);
  const b = parseInt(bgColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "#000000" : "#ffffff";
};

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const AddCustomSourceSection = () => {
  const { t } = useI18n();
  const { dispatch, state } = useMainContext();
  const { showError } = useError();

  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCustomSource = async () => {
    if (!url.trim()) {
      showError("Please enter a URL", "warning");
      return;
    }

    if (!validateUrl(url.trim())) {
      showError("Please enter a valid URL", "warning");
      return;
    }

    const trimmedUrl = url.trim();
    const trimmedName = name.trim();

    // Check if source already exists
    const existingSource = state.sources.find(source => source.url === trimmedUrl);
    if (existingSource) {
      showError("Source already exists!", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const bgColor = generateRandomColor();
      const textColor = generateTextColorForBackground(bgColor);
      const sourceId = uuidv4();

      // Use provided name or generate one from URL
      const sourceName = trimmedName || new URL(trimmedUrl).hostname.replace('www.', '');

      const newSource = {
        name: sourceName,
        url: trimmedUrl,
        type: "rss",
        addedOn: new Date().toISOString(),
        id: sourceId,
        color: bgColor,
        textColor: textColor,
        initial: sourceName[0].toUpperCase(),
      };

      // Add to sources
      dispatch({
        type: ActionTypes.SET_SOURCES,
        payload: [...state.sources, newSource],
      });

      // Add to active sources
      dispatch({
        type: ActionTypes.SET_ACTIVE_SOURCES,
        payload: [...state.activeSources, sourceId],
      });

      showError("Custom source added successfully!", "success");
      
      // Reset form
      setUrl("");
      setName("");
    } catch {
      showError("Failed to add custom source", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="bg-zinc-200 dark:bg-slate-800 p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 flex-shrink-0">
          <Link className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-white tracking-tight">
            {t('sources.addCustom')}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
            {t('sources.addCustomSubtitle')}
          </p>
        </div>
      </div>

      {/* Form Grid - Responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URL Input */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            {t('sources.url')} *
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/rss"
            className="w-full bg-zinc-100 dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-zinc-500/20 focus:border-zinc-500 dark:focus:border-zinc-400 transition-all duration-200"
          />
        </div>

        {/* Name Input */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            {t('sources.customName')} ({t('sources.optional')})
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('sources.customNamePlaceholder')}
            className="w-full bg-zinc-100 dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-zinc-500/20 focus:border-zinc-500 dark:focus:border-zinc-400 transition-all duration-200"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 bg-zinc-50 dark:bg-slate-800/50 p-2 rounded-lg">
            💡 {t('sources.customNameHelp')}
          </p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddCustomSource}
          disabled={!url.trim() || isLoading}
          className="flex-1 flex items-center justify-center gap-3 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-semibold py-4 px-6 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:transform-none"
        >
          <Plus className="w-5 h-5" />
          <span>
            {isLoading ? t('common.loading') : t('sources.addCustomSource')}
          </span>
        </button>
      </div>
    </div>
  );
}; 