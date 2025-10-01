import { ActionTypes, useMainContext } from "../context/main";
import { Bookmark, Clock, Search, Settings } from "lucide-react";
import { STORAGE_CONFIG, cleanupHiddenItems, extractItemTitle, filterHiddenItems } from "../utils/storage";
import { fetchRSS, getRSSItemStrProp } from "../utils/rss";
import { useEffect, useRef } from "react";

import { BackgroundedButtonWithIcon } from "./v2/AddSourceButton";
import { DateSeparator } from "./v2/DateSeparator";
import { LoadingSpinner } from "./LoadingSpinner";
import { Navigations } from "../types/navigation";
import { PubListItem } from "./v2/PubListItem";
import { RSSItem } from "../types/rss";
import { Virtuoso } from "react-virtuoso";
import { errorMap } from "../utils/errors";
import { groupItemsByDateWithSeparators } from "../utils/format";
import { useError } from "../utils/useError";
import { useI18n } from "../context/i18n";
import { useNavigate } from "react-router";

export const PubsList = () => {
  const { state, dispatch } = useMainContext();
  const { showError } = useError();

  const scrollPositionRef = useRef(0);
  const navigationRef = useRef(state.navigation);

  useEffect(() => {
    const element = document.getElementById("pubs-list") as HTMLDivElement;
    if (!element) return;

    if (navigationRef.current !== state.navigation) {
      element.scrollTop = 0;
      navigationRef.current = state.navigation;
    } else {
      element.scrollTop = scrollPositionRef.current;
    }
  }, [state.navigation, state.activeItems]);

  useEffect(() => {
    dispatch({
      type: ActionTypes.SET_LOADING,
      payload: true,
    });

    if (state.navigation === Navigations.BOOKMARKEDS) {
      dispatch({
        type: ActionTypes.SET_ACTIVE_ITEMS,
        payload: state.bookmarks,
      });
      dispatch({
        type: ActionTypes.SET_LOADING,
        payload: false,
      });
      return;
    }

    if (state.navigation === Navigations.HISTORY) {
      // Convert history items to RSS-like format for PubListItem compatibility
      const historyAsRSSItems = state.history?.map(historyItem => ({
        title: historyItem.title,
        link: historyItem.link,
        source: historyItem.source,
        pubDate: historyItem.visitedAt,
        description: `Visited from ${historyItem.sourceName}`,
        id: historyItem.link,
      })) || [];
      
      dispatch({
        type: ActionTypes.SET_ACTIVE_ITEMS,
        payload: historyAsRSSItems,
      });
      dispatch({
        type: ActionTypes.SET_LOADING,
        payload: false,
      });
      return;
    }

    if (state.navigation === Navigations.SEARCH) {
      // For search mode, ensure items are available for filtering
      if (state.items.length === 0 && state.activeItems.length > 0) {
        dispatch({
          type: ActionTypes.SET_ITEMS,
          payload: state.activeItems,
        });
      }
      dispatch({
        type: ActionTypes.SET_LOADING,
        payload: false,
      });
      return;
    }

    const fetchRSSItems = async () => {
      const sourcesToFetch = state.sources.filter((source) =>
        state.activeSources.includes(source.id)
      );
      if (sourcesToFetch.length < 1) return;
      const sourcesURL = sourcesToFetch.map((source) => {
        return {
          id: source.id,
          url: source.url,
        };
      });
      try {
        const newItems = await fetchRSS(sourcesURL);
        
        // Cleanup hidden items that no longer exist in the new feed
        cleanupHiddenItems(newItems);
        
        // Aplicar límites de storage automáticamente
        const limitedItems = applyStorageLimits(newItems);

        // Filter out hidden items before saving to localStorage
        const filteredItems = filterHiddenItems(limitedItems, state.hiddenItems);

        const previousItems = state.items || [];
        const hasExistingItems = previousItems.length > 0;
        const previousItemLinks = new Set(previousItems.map(extractLink));
        const newItemsCount = hasExistingItems
          ? filteredItems.reduce((count, item) => {
              const link = extractLink(item);
              return previousItemLinks.has(link) ? count : count + 1;
            }, 0)
          : 0;

        dispatch({
          type: ActionTypes.SET_NEW_ITEMS_STATUS,
          payload: {
            count: newItemsCount,
            status: newItemsCount > 0 ? 'new' : 'upToDate',
          },
        });

        dispatch({
          type: ActionTypes.SET_ITEMS,
          payload: filteredItems,
        });
        
        dispatch({
          type: ActionTypes.SET_ACTIVE_ITEMS,
          payload: filteredItems,
        });
        dispatch({
          type: ActionTypes.SET_LAST_UPDATED,
          payload: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error fetching RSS:', error);
        showError(errorMap.fetchRSSItems);
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: false,
        });
      }
    };

    (async () => {
      try {
        await fetchRSSItems();
      } catch (error) {
        console.error(error);
      } finally {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: false,
        });
      }
    })();
  }, [
    state.navigation,
    dispatch,
    state.sources,
    state.activeSources,
    state.bookmarks,
    state.history,
  ]);

  const bookmarkItem = (item: RSSItem) => {
    const newBookmark = {
      title: getRSSItemStrProp(item, "title"),
      link: extractLink(item),
      source: item.source,
      pubDate: getRSSItemStrProp(item, "pubDate"),
    };
    dispatch({
      type: ActionTypes.SET_BOOKMARKS,
      payload: [...state.bookmarks, newBookmark],
    });
  };

  const unbookmarkItem = (item: RSSItem) => {
    const updatedBookmarks = state.bookmarks.filter(
      (bookmark) => bookmark.link !== extractLink(item)
    );
    dispatch({
      type: ActionTypes.SET_BOOKMARKS,
      payload: updatedBookmarks,
    });
  };

  const hideItem = (item: RSSItem) => {
    dispatch({
      type: ActionTypes.HIDE_ITEM,
      payload: item,
    });
    
    // Remove hidden item from both items and activeItems arrays
    const itemTitle = extractItemTitle(item);
    const filteredItems = state.items.filter(i => extractItemTitle(i) !== itemTitle);
    const filteredActiveItems = state.activeItems.filter(i => extractItemTitle(i) !== itemTitle);
    
    dispatch({
      type: ActionTypes.SET_ITEMS,
      payload: filteredItems,
    });
    
    dispatch({
      type: ActionTypes.SET_ACTIVE_ITEMS,
      payload: filteredActiveItems,
    });
  };

  const removeFromHistory = (item: RSSItem) => {
    const itemLink = extractLink(item);
    dispatch({
      type: ActionTypes.REMOVE_FROM_HISTORY,
      payload: itemLink,
    });
    
    // Also remove from activeItems if we're in history view
    if (state.navigation === Navigations.HISTORY) {
      const filteredActiveItems = state.activeItems.filter(i => extractLink(i) !== itemLink);
      dispatch({
        type: ActionTypes.SET_ACTIVE_ITEMS,
        payload: filteredActiveItems,
      });
    }
  };

  if (
    state.activeItems?.length < 1 &&
    state.navigation === null &&
    !state.loading
  ) {
    return <PubListEmpty />;
  }

  if (
    state.navigation === Navigations.BOOKMARKEDS &&
    state.bookmarks?.length < 1 &&
    !state.loading
  ) {
    return <BookmarksEmpty />;
  }

  if (
    state.navigation === Navigations.HISTORY &&
    state.history?.length < 1 &&
    !state.loading
  ) {
    return <HistoryEmpty />;
  }

  if (
    state.navigation === Navigations.SEARCH &&
    state.activeItems?.length < 1 &&
    !state.loading
  ) {
    return <SearchEmpty />;
  }

  return (
    <>
      <div id="pubs-list" className="p-0 flex flex-col gap-8 h-full w-full bg-white dark:bg-slate-950">
        <Virtuoso
          className="hide-scrollbar"
          style={{
            height: "100vh",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
          totalCount={groupItemsByDateWithSeparators(state.activeItems || []).length}
          components={{ ScrollSeekPlaceholder: PubListShapeSkeleton }}
          scrollSeekConfiguration={{
            enter: (velocity) => Math.abs(velocity) > 500,
            exit: (velocity) => Math.abs(velocity) < 500,
          }}
          itemContent={(index) => {
            const groupedItems = groupItemsByDateWithSeparators(state.activeItems || []);
            const currentItem = groupedItems[index];
            
            if (!currentItem) return null;
            
            const isFirstItem = index === 0;
            
            if (currentItem.type === 'separator') {
              return (
                <div className={isFirstItem ? 'pt-6' : ''}>
                  <DateSeparator 
                    key={`separator-${currentItem.category}`}
                    category={currentItem.category || 'unknown'}
                  />
                </div>
              );
            }
            
            const item = currentItem.data!;
            const bookmark = state.bookmarks?.find((bookmark) => {
              const bookmarkLink = bookmark.link;
              const itemLink = extractLink(item);
              return bookmarkLink === itemLink;
            }) as RSSItem | undefined;

            return (
              <div className={isFirstItem ? 'pt-6' : ''}>
                <PubListItem
                  key={`${item.link}-${index}`}
                  item={item}
                  index={index}
                  sourceData={state.sources.find(s => s.id === item.source)}
                  bookmark={bookmark}
                  onBookmark={bookmarkItem}
                  onUnbookmark={unbookmarkItem}
                  onHide={state.navigation === Navigations.HISTORY ? removeFromHistory : hideItem}
                />
              </div>
            );
          }}
        />
      </div>
      {state.loading && <LoadingSpinner />}
    </>
  );
};

export const PubListEmpty = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  return (
    <div className="p-4 md:p-16 flex flex-col gap-8 max-h-full overflow-scroll items-center bg-white dark:bg-slate-950">
      <div className="text-center max-w-md mx-auto px-4 md:px-0">
        <p className="text-xl dark:text-gray-200">{t('sources.noSourcesAdded')}</p>
        <p className="text-sm dark:text-gray-400 mt-2">{t('sources.goToAdd')}</p>
      </div>
      <BackgroundedButtonWithIcon
        onClick={() => {
          navigate("/sources");
        }}
        icon={<Settings className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />}
        label={t('sources.goToSources')}
      />
    </div>
  );
};

export const BookmarksEmpty = () => {
  const { t } = useI18n();
  return (
    <div className="p-4 md:p-16 flex flex-col gap-6 max-h-full overflow-scroll items-center justify-center min-h-[400px] bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
          <Bookmark className="w-8 h-8 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('bookmarks.empty')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base px-4 md:px-0">
            {t('bookmarks.emptyDescription')}
          </p>
        </div>
      </div>
      <div className="text-center px-4 md:px-0">
        <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1 flex-wrap">
          <span>{t('bookmarks.tapIcon')}</span>
          <Bookmark className="w-4 h-4 flex-shrink-0" />
          <span>{t('bookmarks.emptyHint')}</span>
        </p>
      </div>
    </div>
  );
};

export const HistoryEmpty = () => {
  const { t } = useI18n();
  return (
    <div className="p-4 md:p-16 flex flex-col gap-6 max-h-full overflow-scroll items-center justify-center min-h-[400px] bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
          <Clock className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('history.empty')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base px-4 md:px-0">
            {t('history.emptyDescription')}
          </p>
        </div>
      </div>
      <div className="text-center px-4 md:px-0">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          {t('history.startReading')}
        </p>
      </div>
    </div>
  );
};

export const SearchEmpty = () => {
  const { t } = useI18n();
  return (
    <div className="p-4 md:p-16 flex flex-col gap-6 max-h-full overflow-scroll items-center justify-center min-h-[400px] bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('search.noResults')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base px-4 md:px-0">
            {t('search.noResultsDescription')}
          </p>
        </div>
      </div>
      <div className="text-center space-y-2 px-4 md:px-0">
        <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
          {t('search.tips')}
        </p>
        <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
          <li>• {t('search.tipKeywords')}</li>
          <li>• {t('search.tipFewerWords')}</li>
          <li>• {t('search.tipSpelling')}</li>
        </ul>
      </div>
    </div>
  );
};

const extractLink = (item: RSSItem): string => {
  if (Array.isArray(item.link) && item.link.length > 0) {
    if (typeof item.link[0] === "object" && item.link[0]["$"]) {
      return item.link[0]["$"].href;
    }
    if (typeof item.link[0] === "string") return item.link[0];
  }

  if (typeof item.link === "string") return item.link;

  return item.id || "";
};

const PubListShapeSkeleton = () => {
  return (
    <div className="p-8 flex flex-col gap-8 max-h-full overflow-scroll items-center bg-white dark:bg-slate-950">
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
    </div>
  );
};

// Función para aplicar límites de storage a los items RSS
const applyStorageLimits = (items: RSSItem[]): RSSItem[] => {
  if (!items || items.length === 0) return items;
  
  // Ordenar por fecha de publicación (más recientes primero)
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.pubDate || '').getTime();
    const dateB = new Date(b.pubDate || '').getTime();
    return dateB - dateA;
  });
  
  // Si tenemos menos items que el límite total, mantener todos ordenados cronológicamente
  if (sortedItems.length <= STORAGE_CONFIG.MAX_TOTAL_ITEMS) {
    return sortedItems;
  }
  
  // Aplicar límite total manteniendo orden cronológico
  return sortedItems.slice(0, STORAGE_CONFIG.MAX_TOTAL_ITEMS);
};
