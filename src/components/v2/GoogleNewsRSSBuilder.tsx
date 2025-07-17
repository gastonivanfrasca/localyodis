import { ActionTypes, useMainContext } from "../../context/main";
import { ExternalLink, HelpCircle, Newspaper, Plus } from "lucide-react";

import { useError } from "../../utils/useError";
import { useI18n } from "../../context/i18n";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type GoogleNewsRSSBuilderProps = {
  onSourceAdded?: () => void;
};

type LanguageCountryOption = {
  code: string;
  name: string;
  hl: string;
  gl: string;
  ceid: string;
};

const LANGUAGE_COUNTRY_OPTIONS: LanguageCountryOption[] = [
  { code: "en-US", name: "English (US)", hl: "en-US", gl: "US", ceid: "US:en" },
  { code: "en-GB", name: "English (UK)", hl: "en-GB", gl: "GB", ceid: "GB:en" },
  { code: "es-ES", name: "Español (España)", hl: "es", gl: "ES", ceid: "ES:es" },
  { code: "es-AR", name: "Español (Argentina)", hl: "es-419", gl: "AR", ceid: "AR:es-419" },
  { code: "es-MX", name: "Español (México)", hl: "es-419", gl: "MX", ceid: "MX:es-419" },
  { code: "fr-FR", name: "Français (France)", hl: "fr", gl: "FR", ceid: "FR:fr" },
  { code: "de-DE", name: "Deutsch (Deutschland)", hl: "de", gl: "DE", ceid: "DE:de" },
  { code: "it-IT", name: "Italiano (Italia)", hl: "it", gl: "IT", ceid: "IT:it" },
  { code: "pt-BR", name: "Português (Brasil)", hl: "pt-BR", gl: "BR", ceid: "BR:pt-419" },
];

const TIME_FILTER_OPTIONS = [
  { value: "", label: "googleNews.timeFilter.all" },
  { value: "when:1h", label: "googleNews.timeFilter.1h" },
  { value: "when:12h", label: "googleNews.timeFilter.12h" },
  { value: "when:1d", label: "googleNews.timeFilter.1d" },
  { value: "when:7d", label: "googleNews.timeFilter.7d" },
  { value: "when:30d", label: "googleNews.timeFilter.30d" },
];

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

export const GoogleNewsRSSBuilder = ({ onSourceAdded }: GoogleNewsRSSBuilderProps) => {
  const { t } = useI18n();
  const { dispatch, state } = useMainContext();
  const { showError } = useError();

  const [searchTerms, setSearchTerms] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [languageCountry, setLanguageCountry] = useState(LANGUAGE_COUNTRY_OPTIONS[0]);
  const [showExamples, setShowExamples] = useState(false);

  // Generate the Google News RSS URL
  const generateRSSUrl = () => {
    if (!searchTerms.trim()) return "";
    
    let query = searchTerms.trim();
    if (timeFilter) {
      query += ` ${timeFilter}`;
    }
    
    const encodedQuery = encodeURIComponent(query);
    return `https://news.google.com/rss/search?q=${encodedQuery}&hl=${languageCountry.hl}&gl=${languageCountry.gl}&ceid=${languageCountry.ceid}`;
  };

  const handleAddSource = async () => {
    if (!searchTerms.trim()) {
      showError("Please enter search terms", "warning");
      return;
    }

    const rssUrl = generateRSSUrl();
    
    // Check if source already exists
    const existingSource = state.sources.find(source => source.url === rssUrl);
    if (existingSource) {
      showError("This Google News RSS feed already exists!", "warning");
      return;
    }

    try {
      const bgColor = generateRandomColor();
      const textColor = generateTextColorForBackground(bgColor);
      const sourceId = uuidv4();

      // Create a descriptive name for the source
      const sourceName = `Google News: ${searchTerms}${timeFilter ? ` (${timeFilter.replace('when:', '')})` : ''}`;

      const newSource = {
        name: sourceName,
        url: rssUrl,
        type: "rss",
        addedOn: new Date().toISOString(),
        id: sourceId,
        color: bgColor,
        textColor: textColor,
        initial: "GN",
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

      showError("Google News RSS feed added successfully!", "success");
      
      // Reset form
      setSearchTerms("");
      setTimeFilter("");
      
      onSourceAdded?.();
    } catch {
      showError("Failed to add Google News RSS feed", "error");
    }
  };

  const handleExampleClick = (example: string) => {
    setSearchTerms(example);
    setShowExamples(false);
  };

  const previewUrl = generateRSSUrl();

  return (
    <div className="bg-white dark:bg-slate-900 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
          <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white tracking-tight">
            {t('googleNews.title')}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {t('googleNews.subtitle')}
          </p>
        </div>
      </div>

      {/* Search Terms */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('googleNews.searchTerms')}
        </label>
        <input
          type="text"
          value={searchTerms}
          onChange={(e) => setSearchTerms(e.target.value)}
          placeholder={t('googleNews.searchTerms.placeholder')}
          className="w-full bg-white dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 border border-zinc-300 dark:border-zinc-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {t('googleNews.searchTerms.help')}
        </p>
      </div>

      {/* Time Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('googleNews.timeFilter')}
        </label>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
        >
          {TIME_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t(option.label as any)}
            </option>
          ))}
        </select>
      </div>

      {/* Language & Country */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('googleNews.language')} & {t('googleNews.country')}
        </label>
        <select
          value={languageCountry.code}
          onChange={(e) => {
            const selected = LANGUAGE_COUNTRY_OPTIONS.find(option => option.code === e.target.value);
            if (selected) setLanguageCountry(selected);
          }}
          className="w-full bg-white dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
        >
          {LANGUAGE_COUNTRY_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* Examples */}
      <div className="mb-4">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          {t('googleNews.examples')}
        </button>
        {showExamples && (
          <div className="mt-2 space-y-2">
            {['googleNews.examples.1', 'googleNews.examples.2', 'googleNews.examples.3', 'googleNews.examples.4'].map((key) => (
              <button
                key={key}
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                onClick={() => handleExampleClick(t(key as any))}
                className="block w-full text-left text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-slate-800 rounded px-2 py-1 transition-colors"
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {t(key as any)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview URL */}
      {previewUrl && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            {t('googleNews.preview')}
          </label>
          <div className="bg-zinc-100 dark:bg-slate-800 rounded-lg p-3 border border-zinc-300 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono break-all flex-1">
                {previewUrl}
              </p>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Button */}
      <button
        onClick={handleAddSource}
        disabled={!searchTerms.trim()}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        {t('googleNews.addToSources')}
      </button>
    </div>
  );
}; 