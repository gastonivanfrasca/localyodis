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

  const [interests, setInterests] = useState("");
  const [languageCountry, setLanguageCountry] = useState(LANGUAGE_COUNTRY_OPTIONS[0]);
  const [showExamples, setShowExamples] = useState(false);

  // Generate the Google News RSS URL for a specific interest
  const generateRSSUrlForInterest = (interest: string) => {
    if (!interest.trim()) return "";
    
    const query = interest.trim();
    const encodedQuery = encodeURIComponent(query);
    return `https://news.google.com/rss/search?q=${encodedQuery}&hl=${languageCountry.hl}&gl=${languageCountry.gl}&ceid=${languageCountry.ceid}`;
  };

  // Parse interests from input (comma-separated)
  const parseInterests = () => {
    return interests
      .split(',')
      .map(interest => interest.trim())
      .filter(interest => interest.length > 0);
  };

  const handleAddSources = async () => {
    if (!interests.trim()) {
      showError("Please enter at least one interest", "warning");
      return;
    }

    const interestList = parseInterests();
    if (interestList.length === 0) {
      showError("Please enter valid interests separated by commas", "warning");
      return;
    }

    try {
      const newSources = [];
      const newSourceIds = [];
      let addedCount = 0;
      let skippedCount = 0;

      for (const interest of interestList) {
        const rssUrl = generateRSSUrlForInterest(interest);
        
        // Check if source already exists
        const existingSource = state.sources.find(source => source.url === rssUrl);
        if (existingSource) {
          skippedCount++;
          continue;
        }

        const bgColor = generateRandomColor();
        const textColor = generateTextColorForBackground(bgColor);
        const sourceId = uuidv4();

        // Create a descriptive name for the source
        const sourceName = `GN - ${interest}`;

        const newSource = {
          name: sourceName,
          url: rssUrl,
          type: "rss",
          addedOn: new Date().toISOString(),
          id: sourceId,
          color: bgColor,
          textColor: textColor,
          initial: interest[0].toUpperCase(),
        };

        newSources.push(newSource);
        newSourceIds.push(sourceId);
        addedCount++;
      }

      if (newSources.length > 0) {
        // Add to sources
        dispatch({
          type: ActionTypes.SET_SOURCES,
          payload: [...state.sources, ...newSources],
        });

        // Add to active sources
        dispatch({
          type: ActionTypes.SET_ACTIVE_SOURCES,
          payload: [...state.activeSources, ...newSourceIds],
        });

        let message = "";
        if (addedCount > 0 && skippedCount > 0) {
          message = `Added ${addedCount} new interests, ${skippedCount} already existed`;
        } else if (addedCount > 0) {
          message = `Successfully added ${addedCount} Google News RSS ${addedCount === 1 ? 'feed' : 'feeds'}!`;
        }
        
        showError(message, "success");
        
        // Reset form
        setInterests("");
        
        onSourceAdded?.();
      } else {
        showError("All interests already exist as sources", "warning");
      }
    } catch {
      showError("Failed to add Google News RSS feeds", "error");
    }
  };

  const handleExampleClick = (example: string) => {
    setInterests(example);
    setShowExamples(false);
  };

  // Generate preview URLs for current interests
  const previewUrls = parseInterests().map(interest => ({
    interest,
    url: generateRSSUrlForInterest(interest)
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="bg-zinc-200 dark:bg-slate-800 p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 flex-shrink-0">
          <Newspaper className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-white tracking-tight">
            {t('googleNews.title')}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
            {t('googleNews.subtitle')}
          </p>
        </div>
      </div>

      {/* Form Grid - Responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interests Input */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            {t('googleNews.interests')}
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder={t('googleNews.interests.placeholder')}
            className="w-full bg-zinc-100 dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-zinc-500/20 focus:border-zinc-500 dark:focus:border-zinc-400 transition-all duration-200"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 bg-zinc-50 dark:bg-slate-800/50 p-2 rounded-lg">
            💡 {t('googleNews.interests.help')}
          </p>
        </div>

        {/* Language & Country */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            {t('googleNews.language')} & {t('googleNews.country')}
          </label>
          <select
            value={languageCountry.code}
            onChange={(e) => {
              const selected = LANGUAGE_COUNTRY_OPTIONS.find(option => option.code === e.target.value);
              if (selected) setLanguageCountry(selected);
            }}
            className="w-full bg-zinc-100 dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-zinc-500/20 focus:border-zinc-500 dark:focus:border-zinc-400 transition-all duration-200"
          >
            {LANGUAGE_COUNTRY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Examples */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            {t('googleNews.examples')}
          </label>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors p-3 rounded-xl border-2 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-slate-800/50"
          >
            <HelpCircle className="w-4 h-4" />
            {showExamples ? 'Hide examples' : 'Show examples'}
          </button>
          {showExamples && (
            <div className="mt-3 space-y-2 bg-zinc-50 dark:bg-slate-800/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700">
              {(['googleNews.examples.1', 'googleNews.examples.2', 'googleNews.examples.3', 'googleNews.examples.4'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => handleExampleClick(t(key))}
                  className="block w-full text-left text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-slate-700 border border-zinc-200 dark:border-zinc-600"
                >
                  📰 {t(key)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview URLs */}
      {previewUrls.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            {t('googleNews.preview')} ({previewUrls.length} {previewUrls.length === 1 ? t('googleNews.source') : t('googleNews.sources')})
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-zinc-50 dark:bg-slate-800/30">
            {previewUrls.map(({ interest, url }, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-zinc-200 dark:border-zinc-600 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-zinc-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {interest[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                    GN - {interest}
                  </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors flex-shrink-0 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-slate-700"
                    title="Preview RSS feed"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono break-all bg-zinc-100 dark:bg-slate-700 p-2 rounded line-clamp-2">
                  {url}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddSources}
          disabled={!interests.trim()}
          className="flex-1 flex items-center justify-center gap-3 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-semibold py-4 px-6 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:transform-none"
        >
          <Plus className="w-5 h-5" />
          <span>
            {previewUrls.length > 1 
              ? `${t('googleNews.addToSources')} (${previewUrls.length})`
              : t('googleNews.addToSources')
            }
          </span>
        </button>
      </div>
    </div>
  );
}; 