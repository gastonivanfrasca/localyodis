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

      {/* Interests Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {t('googleNews.interests')}
        </label>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder={t('googleNews.interests.placeholder')}
          className="w-full bg-white dark:bg-slate-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 border border-zinc-300 dark:border-zinc-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {t('googleNews.interests.help')}
        </p>
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
            {(['googleNews.examples.1', 'googleNews.examples.2', 'googleNews.examples.3', 'googleNews.examples.4'] as const).map((key) => (
              <button
                key={key}
                onClick={() => handleExampleClick(t(key))}
                className="block w-full text-left text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-slate-800 rounded px-2 py-1 transition-colors"
              >
                {t(key)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview URLs */}
      {previewUrls.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            {t('googleNews.preview')} ({previewUrls.length} {previewUrls.length === 1 ? t('googleNews.source') : t('googleNews.sources')})
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {previewUrls.map(({ interest, url }, index) => (
              <div key={index} className="bg-zinc-100 dark:bg-slate-800 rounded-lg p-3 border border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    GN - {interest}
                  </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono break-all">
                  {url}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Button */}
      <button
        onClick={handleAddSources}
        disabled={!interests.trim()}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        {previewUrls.length > 1 
          ? `${t('googleNews.addToSources')} (${previewUrls.length})`
          : t('googleNews.addToSources')
        }
      </button>
    </div>
  );
}; 