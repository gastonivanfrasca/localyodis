import { ActionTypes, useMainContext } from "../../context/main";
import { PredefinedSource, SourceCategory } from "../../types/predefined-sources";

import { CategoryPill } from "../../components/CategoryPill";
import { Navigations } from "../../types/navigation";
import { SourceCard } from "../../components/SourceCard";
import { getPredefinedSources } from "../../utils/predefined-sources";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const generateRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor.padStart(6, "0");
};

const generateTextColorForBackground = (bgColor: string) => {
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness >= 128 ? "#000000" : "#ffffff";
};

export const FirstTimeUser = () => {
  const { dispatch, state } = useMainContext();
  const predefinedSourcesData = getPredefinedSources();
  const [selectedCategory, setSelectedCategory] = useState<string>(predefinedSourcesData.categories[0]?.id || "");
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.HOME,
    });
  };

  const handleSkip = () => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.HOME,
    });
  };

  const selectedCategoryData = predefinedSourcesData.categories.find(
    cat => cat.id === selectedCategory
  );

  return (
    <div className="w-full h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Get started by selecting some popular RSS sources to begin reading interesting content
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Categories */}
        <div className="flex-shrink-0 px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {predefinedSourcesData.categories.map((category: SourceCategory) => (
                <CategoryPill
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onSelect={handleCategorySelect}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sources Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            {selectedCategoryData && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <span>{selectedCategoryData.icon}</span>
                  {selectedCategoryData.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCategoryData.sources.map((source: PredefinedSource) => (
                    <SourceCard
                      key={source.url}
                      source={source}
                      isSelected={selectedSources.has(source.url)}
                      onToggle={handleSourceToggle}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
          >
            Skip for now
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedSources.size} sources selected
            </span>
            <button
              onClick={handleFinishSetup}
              disabled={selectedSources.size === 0}
              className="bg-blue-600 dark:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue {selectedSources.size > 0 && `(${selectedSources.size})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 