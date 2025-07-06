import { ActionTypes, useMainContext } from "../context/main";
import { Bookmark, Search, Settings } from "lucide-react";
import { fetchRSS, getRSSItemStrProp } from "../utils/rss";
import { useEffect, useRef } from "react";

import { BackgroundedButtonWithIcon } from "./v2/AddSourceButton";
import { LoadingSpinner } from "./LoadingSpinner";
import { Navigations } from "../types/navigation";
import { PubListItem } from "./v2/PubListItem";
import { RSSItem } from "../types/rss";
import { STORAGE_CONFIG } from "../utils/storage";
import { Virtuoso } from "react-virtuoso";
import { errorMap } from "../utils/errors";
import { useError } from "../utils/useError";
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
        
        // Aplicar límites de storage automáticamente
        const limitedItems = applyStorageLimits(newItems);
        
        dispatch({
          type: ActionTypes.SET_ITEMS,
          payload: limitedItems,
        });
        dispatch({
          type: ActionTypes.SET_ACTIVE_ITEMS,
          payload: limitedItems,
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

  if (
    state.activeItems?.length < 1 &&
    state.navigation === Navigations.HOME &&
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
    state.navigation === Navigations.SEARCH &&
    state.activeItems?.length < 1 &&
    !state.loading
  ) {
    return <SearchEmpty />;
  }

  return (
    <>
      <div id="pubs-list" className="p-8 flex flex-col gap-8 h-full w-full bg-white dark:bg-slate-950">
        <Virtuoso
          style={{
            height: "100vh",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
          totalCount={state.activeItems?.length || 0}
          components={{ ScrollSeekPlaceholder: PubListShapeSkeleton }}
          scrollSeekConfiguration={{
            enter: (velocity) => Math.abs(velocity) > 500,
            exit: (velocity) => Math.abs(velocity) < 500,
          }}
          itemContent={(index) => {
            const item = state.activeItems?.[index];
            const bookmark = state.bookmarks?.find((bookmark) => {
              const bookmarkLink = bookmark.link;
              const itemLink = extractLink(item);
              return bookmarkLink === itemLink;
            }) as RSSItem | undefined;

            return (
              <PubListItem
                key={`${item.link}-${index}`}
                item={item}
                index={index}
                sourceData={state.sources.find(s => s.id === item.source)}
                bookmark={bookmark}
                onBookmark={bookmarkItem}
                onUnbookmark={unbookmarkItem}
              />
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
  return (
    <div className="p-4 md:p-16 flex flex-col gap-8 max-h-full overflow-scroll items-center bg-white dark:bg-slate-950">
      <div className="text-center max-w-md mx-auto px-4 md:px-0">
        <p className="text-xl dark:text-gray-200">No rss sources added</p>
        <p className="text-sm dark:text-gray-400 mt-2">Go to sources to add one.</p>
      </div>
      <BackgroundedButtonWithIcon
        onClick={() => {
          navigate("/sources");
        }}
        icon={<Settings className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />}
        label="Go to sources"
      />
    </div>
  );
};

export const BookmarksEmpty = () => {
  return (
    <div className="p-4 md:p-16 flex flex-col gap-6 max-h-full overflow-scroll items-center justify-center min-h-[400px] bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
          <Bookmark className="w-8 h-8 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            No bookmarks yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base px-4 md:px-0">
            Start bookmarking your favorite publications to read them later. 
            They'll appear here for easy access.
          </p>
        </div>
      </div>
      <div className="text-center px-4 md:px-0">
        <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1 flex-wrap">
          <span>Tap the</span>
          <Bookmark className="w-4 h-4 flex-shrink-0" />
          <span>icon on any publication to bookmark it</span>
        </p>
      </div>
    </div>
  );
};

export const SearchEmpty = () => {
  return (
    <div className="p-4 md:p-16 flex flex-col gap-6 max-h-full overflow-scroll items-center justify-center min-h-[400px] bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base px-4 md:px-0">
            We couldn't find any publications matching your search. 
            Try adjusting your search terms or checking the spelling.
          </p>
        </div>
      </div>
      <div className="text-center space-y-2 px-4 md:px-0">
        <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
          Search tips:
        </p>
        <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
          <li>• Try different keywords</li>
          <li>• Use fewer words</li>
          <li>• Check your spelling</li>
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
  
  // Limitar items por fuente
  const itemsBySource = new Map<string, RSSItem[]>();
  sortedItems.forEach(item => {
    const source = item.source || 'unknown';
    if (!itemsBySource.has(source)) {
      itemsBySource.set(source, []);
    }
    const sourceItems = itemsBySource.get(source)!;
    if (sourceItems.length < STORAGE_CONFIG.MAX_ITEMS_PER_SOURCE) {
      sourceItems.push(item);
    }
  });
  
  // Combinar todos los items limitados por fuente
  const limitedItems = Array.from(itemsBySource.values()).flat();
  
  // Aplicar límite total si es necesario
  return limitedItems.slice(0, STORAGE_CONFIG.MAX_TOTAL_ITEMS);
};
