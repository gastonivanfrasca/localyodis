import { ActionTypes, useMainContext } from "../../context/main";
import { Plus, Settings } from "lucide-react";
import { PredefinedSource, SourceCategory } from "../../types/predefined-sources";

import { AddRSSSourceModals } from "../../components/AddSourceModals";
import { CategoryPill } from "../../components/CategoryPill";
import { GoogleNewsRSSBuilder } from "../../components/v2/GoogleNewsRSSBuilder";
import { SourceCard } from "../../components/SourceCard";
import { SupportedLanguage } from "../../types/i18n";
import { getPredefinedSources } from "../../utils/predefined-sources";
import { useI18n } from "../../context/i18n";
import { useNavigate } from "react-router";
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

export const FirstTimeUser = () => {
  const navigate = useNavigate();
  const { dispatch, state } = useMainContext();
  const { t } = useI18n();
  const predefinedSourcesData = getPredefinedSources();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());
  const [isRSSModalOpen, setIsRSSModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage | 'all'>('all');

  const handleCategorySelect = (categoryId: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const handleSourceToggle = (sourceUrl: string) => {
    const newSelected = new Set(selectedSources);
    if (newSelected.has(sourceUrl)) {
      newSelected.delete(sourceUrl);
    } else {
      newSelected.add(sourceUrl);
    }
    setSelectedSources(newSelected);
  };

  const handleLanguageSelect = (language: SupportedLanguage | 'all') => {
    setSelectedLanguage(language);
  };

  const handleFinishSetup = () => {
    const currentSources = [...state.sources];
    const newSourceIds: string[] = [];

    selectedSources.forEach(sourceUrl => {
      // Find the source details from predefined data
      const sourceDetails = predefinedSourcesData.categories
        .flatMap(cat => cat.sources)
        .find(source => source.url === sourceUrl);

      if (sourceDetails) {
        const bgColor = generateRandomColor();
        const textColor = generateTextColorForBackground(bgColor);
        const sourceId = uuidv4();

        const newSource = {
          name: sourceDetails.name,
          url: sourceDetails.url,
          type: "rss",
          addedOn: new Date().toISOString(),
          id: sourceId,
          color: bgColor,
          textColor: textColor,
          initial: sourceDetails.name[0],
        };

        currentSources.push(newSource);
        newSourceIds.push(sourceId);
      }
    });

    // Update sources
    dispatch({
      type: ActionTypes.SET_SOURCES,
      payload: currentSources,
    });

    // Add all new sources to active sources
    dispatch({
      type: ActionTypes.SET_ACTIVE_SOURCES,
      payload: [...state.activeSources, ...newSourceIds],
    });

    // Navigate to home
    navigate("/");
  };

  // Get sources from all selected categories
  const allSelectedSources = selectedCategories.size === 0 
    ? [] 
    : predefinedSourcesData.categories
        .filter(cat => selectedCategories.has(cat.id))
        .flatMap(cat => cat.sources);

  // Filter sources by language and remove duplicates
  const filteredSources = Array.from(
    new Map(
      allSelectedSources
        .filter(source => selectedLanguage === 'all' || source.language === selectedLanguage)
        .map(source => [source.url, source])
    ).values()
  );

  // Get unique languages from all sources
  const availableLanguages = Array.from(new Set(
    predefinedSourcesData.categories.flatMap(cat => 
      cat.sources.map(source => source.language)
    )
  )).sort();

  return (
    <div className="w-full h-screen dark:bg-slate-950 flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Categories */}
        <div className="flex-shrink-0 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-white tracking-tight mb-1">
                  {t('ftu.categories')}
                </h2>
                {selectedCategories.size > 0 && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {selectedSources.size} {t('sources.selected')} {t('discover.addedCount')} {filteredSources.length}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsRSSModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 border-2 bg-zinc-100 dark:bg-slate-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-900 hover:bg-zinc-200 dark:hover:bg-slate-800"
              >
                <div className="bg-zinc-200 dark:bg-slate-800 p-1 rounded-lg">
                  <Plus className="w-3 h-3" />
                </div>
                <span className="tracking-tight">{t('ftu.addOwnSource')}</span>
              </button>
            </div>
            <div className="relative">
              <div className="overflow-x-auto hide-scrollbar">
                <div className="flex gap-2 pb-2 pr-8">
                  {predefinedSourcesData.categories.map((category: SourceCategory) => (
                    <CategoryPill
                      key={category.id}
                      category={category}
                      isSelected={selectedCategories.has(category.id)}
                      onSelect={handleCategorySelect}
                    />
                  ))}
                </div>
              </div>
              {/* Subtle gradient fade */}
              <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Language Filter */}
        {selectedCategories.size > 0 && (
          <div className="flex-shrink-0 px-6 py-2">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('ftu.language')}:
                </h3>
                <div className="relative flex-1">
                  <div className="overflow-x-auto hide-scrollbar">
                    <div className="flex gap-2 pr-8">
                      <button
                        onClick={() => handleLanguageSelect('all')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 text-nowrap flex-shrink-0 ${
                          selectedLanguage === 'all'
                            ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900'
                            : 'bg-zinc-200 dark:bg-slate-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-slate-700'
                        }`}
                      >
                        {t('ftu.allLanguages')}
                      </button>
                      {availableLanguages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageSelect(lang)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 text-nowrap flex-shrink-0 ${
                            selectedLanguage === lang
                              ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900'
                              : 'bg-zinc-200 dark:bg-slate-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-slate-700'
                          }`}
                        >
                          {lang.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Subtle gradient fade */}
                  <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sources Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Google News RSS Builder */}
            <div className="mb-8">
              <GoogleNewsRSSBuilder onSourceAdded={() => {
                // Refresh the component state if needed
              }} />
            </div>

            {selectedCategories.size > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSources.map((source: PredefinedSource) => (
                    <SourceCard
                      key={source.url}
                      source={source}
                      isSelected={selectedSources.has(source.url)}
                      onToggle={handleSourceToggle}
                    />
                  ))}
                </div>
                {filteredSources.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-zinc-500 dark:text-zinc-400">
                      {t('sources.noSourcesFound')} {selectedLanguage === 'all' ? t('ftu.categories') : selectedLanguage.toUpperCase()}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-500 dark:text-zinc-400 text-base">
                  {t('ftu.description')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-6 py-6 border-t border-zinc-300 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => {
              navigate("/settings");
            }}
            className="bg-zinc-200 dark:bg-slate-800 p-2.5 rounded-xl hover:bg-zinc-300 dark:hover:bg-slate-700 transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {selectedSources.size} {t('sources.selected')}
            </span>
            <button
              onClick={handleFinishSetup}
              disabled={selectedSources.size === 0}
              className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2.5 px-6 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-tight"
            >
              {t('common.continue')} {selectedSources.size > 0 && `(${selectedSources.size})`}
            </button>
          </div>
        </div>
      </div>

      {/* RSS Modal */}
      <AddRSSSourceModals
        isOpen={isRSSModalOpen}
        setIsModalOpen={setIsRSSModalOpen}
      />
    </div>
  );
}; 