import { PredefinedSource, SourceCategory } from "../../types/predefined-sources";

import { ActionTypes } from "../../context/main";
import { AddCustomSourceSection } from "../../components/v2/AddCustomSourceSection";
import { CategoryPill } from "../../components/CategoryPill";
import { DiscoverSourceCard } from "../../components/DiscoverSourceCard";
import { Settings } from "lucide-react";
import { SupportedLanguage } from "../../types/i18n";
import { getPredefinedSources } from "../../utils/predefined-sources";
import { useError } from "../../utils/useError";
import { useI18n } from "../../context/i18n";
import { useMainContext } from "../../context/main";
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

type Tab = 'recommended' | 'custom';

export const FirstTimeUser = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
  const { showError } = useError();

  const [activeTab, setActiveTab] = useState<Tab>('recommended');

  const handleFinishSetup = () => {
    navigate("/");
  };
  
  const totalSources = state.sources.length;
  const canContinue = totalSources > 0;

  const predefinedSourcesData = getPredefinedSources();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(['news'])
  );
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

  const handleLanguageSelect = (language: SupportedLanguage | 'all') => {
    setSelectedLanguage(language);
  };

  const handleAddSource = (sourceUrl: string) => {
    const existingSource = state.sources.find(source => source.url === sourceUrl);
    if (existingSource) {
      showError("Source already exists!", "warning");
      return;
    }

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

      dispatch({ type: ActionTypes.SET_SOURCES, payload: [...state.sources, newSource] });
      dispatch({ type: ActionTypes.SET_ACTIVE_SOURCES, payload: [...state.activeSources, sourceId] });

      showError("Source added successfully!", "success");
    }
  };

  const allSelectedSources = selectedCategories.size === 0 
    ? [] 
    : predefinedSourcesData.categories
        .filter(cat => selectedCategories.has(cat.id))
        .flatMap(cat => cat.sources);

  const filteredSources = Array.from(
    new Map(
      allSelectedSources
        .filter(source => selectedLanguage === 'all' || source.language === selectedLanguage)
        .map(source => [source.url, source])
    ).values()
  );

  const availableLanguages = Array.from(new Set(
    predefinedSourcesData.categories.flatMap(cat => 
      cat.sources.map(source => source.language)
    )
  )).sort();

  const addedSourceUrls = new Set(state.sources.map(source => source.url));

  const addedSourcesInCategory = filteredSources.filter(source => 
    addedSourceUrls.has(source.url)
  ).length || 0;

  const renderContent = () => {
    switch (activeTab) {
      case 'recommended':
        return (
          <section>
             <div className="mb-6">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-white tracking-tight mb-1">
                {t('discover.predefinedSources')}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                {t('discover.predefinedSourcesSubtitle')}
              </p>
              {selectedCategories.size > 0 && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {addedSourcesInCategory} {t('discover.addedCount')} {filteredSources.length} {t('discover.added')}
                </p>
              )}
            </div>
            
            <div className="relative mb-6">
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
              <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none"></div>
            </div>

            {selectedCategories.size > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t('discover.language')}:
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
                          {t('discover.allLanguages')}
                        </button>
                        {availableLanguages.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => handleLanguageSelect(lang as SupportedLanguage)}
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
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </div>
            )}

            {selectedCategories.size > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSources.map((source: PredefinedSource) => (
                    <DiscoverSourceCard
                      key={source.url}
                      source={source}
                      isAdded={addedSourceUrls.has(source.url)}
                      onAdd={() => handleAddSource(source.url)}
                    />
                  ))}
                </div>
                {filteredSources.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-zinc-500 dark:text-zinc-400">
                      {t('sources.noSourcesFound')}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  {t('discover.selectCategories')}
                </p>
              </div>
            )}
          </section>
        );
      case 'custom':
        return <AddCustomSourceSection />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-dvh dark:bg-slate-950 flex flex-col">
      <div className="flex-shrink-0 px-6 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white tracking-tight mb-3">
            {t('ftu.welcome')}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-base max-w-2xl mx-auto">
            {t('ftu.description')}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto flex space-x-6">
            {(['recommended', 'custom'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 font-semibold text-sm transition-colors duration-200 ${
                  activeTab === tab 
                    ? 'text-zinc-800 dark:text-white border-b-2 border-zinc-800 dark:border-white'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                {t(`discover.tabs.${tab}` as const)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8 pb-20 md:pb-8">
            {renderContent()}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-6 py-6 border-t border-zinc-300 dark:border-zinc-800 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className="order-1 text-sm text-zinc-600 dark:text-zinc-400 md:order-2 md:text-right">
            {totalSources > 0 ? (
              <span className="text-zinc-700 dark:text-zinc-300">
                {totalSources} {totalSources === 1 ? t('ftu.sourceReady') : t('ftu.sourcesReady')}
              </span>
            ) : (
              t('ftu.addInterests')
            )}
          </span>
          <div className="order-2 flex items-center justify-between gap-4 md:order-1 md:justify-start">
            <button
              onClick={() => {
                navigate("/settings");
              }}
              className="bg-zinc-200 dark:bg-slate-800 p-2.5 rounded-xl hover:bg-zinc-300 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <Settings className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            </button>
            <button
              onClick={handleFinishSetup}
              disabled={!canContinue}
              className="flex-1 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2.5 px-6 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-tight md:flex-none"
            >
              {t('common.continue')} {totalSources > 0 && `(${totalSources})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 