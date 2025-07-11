import { ActionTypes, useMainContext } from "../../context/main";
import { Plus, Settings } from "lucide-react";
import { PredefinedSource, SourceCategory } from "../../types/predefined-sources";

import { AddRSSSourceModals } from "../../components/AddSourceModals";
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
  const [isRSSModalOpen, setIsRSSModalOpen] = useState(false);

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



  const selectedCategoryData = predefinedSourcesData.categories.find(
    cat => cat.id === selectedCategory
  );

  return (
    <div className="w-full h-screen dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-zinc-600 dark:text-zinc-400 text-base">
            Get started by selecting from these community-suggested RSS sources to begin reading interesting content
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Categories */}
        <div className="flex-shrink-0 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-white tracking-tight">
                Categories
              </h2>
              <button
                onClick={() => setIsRSSModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 border-2 bg-zinc-100 dark:bg-slate-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-900 hover:bg-zinc-200 dark:hover:bg-slate-800"
              >
                <div className="bg-zinc-200 dark:bg-slate-800 p-1 rounded-lg">
                  <Plus className="w-3 h-3" />
                </div>
                <span className="tracking-tight">Add your own source</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
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
      <div className="flex-shrink-0 px-6 py-6 border-t border-zinc-300 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => dispatch({ type: ActionTypes.SET_NAVIGATION, payload: Navigations.SETTINGS })}
            className="bg-zinc-200 dark:bg-slate-800 p-2.5 rounded-xl hover:bg-zinc-300 dark:hover:bg-slate-700 transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {selectedSources.size} sources selected
            </span>
            <button
              onClick={handleFinishSetup}
              disabled={selectedSources.size === 0}
              className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2.5 px-6 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-tight"
            >
              Continue {selectedSources.size > 0 && `(${selectedSources.size})`}
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