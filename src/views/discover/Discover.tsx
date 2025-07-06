import { ActionTypes, useMainContext } from "../../context/main";
import { ArrowLeft, Compass, Plus } from "lucide-react";
import { PredefinedSource, SourceCategory } from "../../types/predefined-sources";
import { useEffect, useState } from "react";

import { AddRSSSourceModals } from "../../components/AddSourceModals";
import { CategoryPill } from "../../components/CategoryPill";
import { DiscoverSourceCard } from "../../components/DiscoverSourceCard";
import { Link } from "react-router";
import { Navigations } from "../../types/navigation";
import Snackbar from "../../components/Snackbar";
import { getPredefinedSources } from "../../utils/predefined-sources";
import { useError } from "../../utils/useError";
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

export const Discover = () => {
  const { dispatch, state } = useMainContext();
  const { showError } = useError();
  const predefinedSourcesData = getPredefinedSources();
  const [selectedCategory, setSelectedCategory] = useState<string>(predefinedSourcesData.categories[0]?.id || "");
  const [isRSSModalOpen, setIsRSSModalOpen] = useState(false);

  // Set navigation state when component mounts
  useEffect(() => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.DISCOVER,
    });
  }, [dispatch]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddSource = (sourceUrl: string) => {
    // Check if source is already added
    const existingSource = state.sources.find(source => source.url === sourceUrl);
    if (existingSource) {
      showError("Source already exists!", "warning");
      return;
    }

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

      showError("Source added successfully!", "success");
    }
  };

  const selectedCategoryData = predefinedSourcesData.categories.find(
    cat => cat.id === selectedCategory
  );

  // Get added sources URLs for comparison
  const addedSourceUrls = new Set(state.sources.map(source => source.url));

  // Count added sources in current category
  const addedSourcesInCategory = selectedCategoryData?.sources.filter(source => 
    addedSourceUrls.has(source.url)
  ).length || 0;

  return (
    <div className="w-full h-screen dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <button className="bg-zinc-200 dark:bg-slate-800 p-2.5 rounded-xl hover:bg-zinc-300 dark:hover:bg-slate-700 transition-all duration-200">
                <ArrowLeft className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
              <h1 className="text-2xl font-bold text-zinc-800 dark:text-white tracking-tight">
                Discover Sources
              </h1>
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-base">
            Explore and add new RSS sources to enhance your reading experience. Green indicators show sources you've already added.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Categories */}
        <div className="flex-shrink-0 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-white tracking-tight">
                  Categories
                </h2>
                {selectedCategoryData && (
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {addedSourcesInCategory} of {selectedCategoryData.sources.length} added
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsRSSModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 border-2 bg-zinc-100 dark:bg-slate-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-900 hover:bg-zinc-200 dark:hover:bg-slate-800"
              >
                <div className="bg-zinc-200 dark:bg-slate-800 p-1 rounded-lg">
                  <Plus className="w-3 h-3" />
                </div>
                <span className="tracking-tight">Add custom source</span>
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
                    <DiscoverSourceCard
                      key={source.url}
                      source={source}
                      isAdded={addedSourceUrls.has(source.url)}
                      onAdd={handleAddSource}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RSS Modal */}
      <AddRSSSourceModals
        isOpen={isRSSModalOpen}
        setIsModalOpen={setIsRSSModalOpen}
      />
      
      {/* Snackbar */}
      <Snackbar />
    </div>
  );
}; 