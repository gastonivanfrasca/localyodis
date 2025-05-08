import { Bookmark, BookmarkCheck } from "lucide-react";
// Removed getLocallyStoredData and storeDataLocally imports as they are handled by the context now
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

import AutoSizer from "react-virtualized-auto-sizer";
import { FilterSourcesModal } from "./FilterSourcesModal";
import { LoadingSpinner } from "./LoadingSpinner";
import { Navigations } from "../types/navigation";
import { RSSItem } from "../types/rss";
import { RoundedIdentifier } from "./v2/RoundedIdentifier";
import UpdateToast from "./UpdateToast"; // Import the new toast component
import { VariableSizeList } from "react-window";
import { formatPubDate } from "../utils/format";
import {
  getLocallyStoredData,
  getSourceByID,
  storeDataLocally,
} from "../utils/storage"; // Keep getSourceByID and storeDataLocally for bookmarks
import { useNavigation } from "../context/hooks";
import { useFeedItems } from "../hooks/useFeedItems";

type RowProps = {
  index: number;
  style: React.CSSProperties;
  items: RSSItem[];
  localBookmarks: RSSItem[];
  onBookmark: (item: RSSItem) => void;
  onUnbookmark: (item: RSSItem) => void;
};

const Row = ({
  index,
  style,
  items,
  localBookmarks,
  onBookmark,
  onUnbookmark,
}: RowProps) => {
  const item = items[index];
  if (!item) return null;
  const sourceData = getSourceByID(item.source);
  if (!sourceData) return null;

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

  const getRSSItemStrProp = (item: RSSItem, prop: keyof RSSItem): string => {
    if (!item[prop]) return "";
    const value = Array.isArray(item[prop]) ? item[prop][0] : item[prop];
    if (typeof value === "object" && value !== null && "_" in value) {
      return String(value._);
    }
    return String(value);
  };

  const bookmark = localBookmarks.find((bookmark) => {
    const bookmarkLink = bookmark.link;
    const itemLink = extractLink(item);
    return bookmarkLink === itemLink;
  });

  const link = extractLink(item);
  let title = getRSSItemStrProp(item, "title");

  return (
    <div
      className="flex flex-col w-full gap-2 px-2 pb-1 pt-4 md:w-[800px] border-b border-neutral-200 dark:border-neutral-600 cursor-pointer"
      key={link}
      style={style}
    >
      <div className="flex flex-col gap-1 w-full justify-between h-full">
        <button
          onClick={() => window.open(link, "_blank")}
          className="font-semibold text-base text-left hover:underline line-clamp-2"
          aria-label={`Read article: ${title}`}
        >
          {title}
        </button>
        
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row gap-2 items-center flex-1 min-w-0">
            <RoundedIdentifier
              color={sourceData.color}
              textColor={sourceData.textColor}
              initial={sourceData.initial}
              video={sourceData.type === "video"}
              small
            />
            <span className="text-xs truncate text-gray-600 dark:text-gray-400">{sourceData.name}</span>
            {item.pubDate && (
              <span className="text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                {formatPubDate(item.pubDate)}
              </span>
            )}
          </div>

          <button
            className="ml-2 p-1 flex-shrink-0"
            onClick={() => bookmark !== undefined ? onUnbookmark(item) : onBookmark(item)}
            aria-label={bookmark !== undefined ? "Remove bookmark" : "Bookmark item"}
          >
            {bookmark !== undefined ? (
              <BookmarkCheck className="h-4 w-4" style={{ color: "#1e7bc0" }} />
            ) : (
              <Bookmark className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const PubsList = () => {
  const initialLocalData = useMemo(() => getLocallyStoredData(), []);

  // Get activeSources, setActiveSources, and allSources from context
  const {
    navigation,
    setNavigation,
    activeSources,
    setActiveSources,
    allSources,
  } = useNavigation();
  const [localBookmarks, setLocalBookmarks] = useState(
    initialLocalData.bookmarks
  );
  // Removed local activeSources state

  const scrollPositionRef = useRef(0);
  const navigationRef = useRef(navigation);
  const listRef = useRef<VariableSizeList>(null);
  const [isToastVisible, setIsToastVisible] = useState(false); // State for toast visibility

  // Destructure refreshFeedItems from the hook
  const { rssItems, loading, newItemsCount, isFeedUpToDate, showToastSignal } =
    useFeedItems(
      navigation,
      activeSources, // Use activeSources from context
      localBookmarks,
      allSources // Use allSources from context
    );

  // Effect to show the toast when the signal changes
  useEffect(() => {
    if (showToastSignal > 0) {
      // Check if signal is greater than 0 (initial state)
      // Only show if there are new items or if the feed is explicitly up to date
      if (newItemsCount !== null || isFeedUpToDate) {
        setIsToastVisible(true);
      }
    }
  }, [showToastSignal, newItemsCount, isFeedUpToDate]); // Depend on the signal and the data it represents

  const handleToastDismiss = useCallback(() => {
    setIsToastVisible(false);
  }, []);

  useEffect(() => {
    const element = document.getElementById("pubs-list") as HTMLDivElement;
    if (!element) return;

    if (navigationRef.current !== navigation) {
      element.scrollTop = 0;
      navigationRef.current = navigation;
      listRef.current?.scrollTo(0);
    } else {
      element.scrollTop = scrollPositionRef.current;
    }
    // Reset toast visibility when navigation changes
    setIsToastVisible(false);
  }, [navigation]);

  const bookmarkItem = useCallback((item: RSSItem) => {
    const extractLinkLocal = (item: RSSItem): string => {
      if (Array.isArray(item.link) && item.link.length > 0) {
        if (typeof item.link[0] === "object" && item.link[0]["$"]) {
          return item.link[0]["$"].href;
        }
        if (typeof item.link[0] === "string") return item.link[0];
      }
      if (typeof item.link === "string") return item.link;
      return item.id || "";
    };
    const getRSSItemStrPropLocal = (
      item: RSSItem,
      prop: keyof RSSItem
    ): string => {
      if (!item[prop]) return "";
      const value = Array.isArray(item[prop]) ? item[prop][0] : item[prop];
      if (typeof value === "object" && value !== null && "_" in value) {
        return String(value._);
      }
      return String(value);
    };

    const newBookmark = {
      title: getRSSItemStrPropLocal(item, "title"),
      link: extractLinkLocal(item),
      source: item.source,
      pubDate: getRSSItemStrPropLocal(item, "pubDate"),
      id: item.id,
      description: getRSSItemStrPropLocal(item, "description"),
    } as RSSItem;

    setLocalBookmarks((prevBookmarks) => {
      const updatedBookmarks = [...prevBookmarks, newBookmark];
      // Persist bookmarks - context doesn't manage bookmarks yet
      const currentLocalData = getLocallyStoredData();
      storeDataLocally({
        ...currentLocalData,
        bookmarks: updatedBookmarks,
      });
      return updatedBookmarks;
    });
  }, []);

  const unbookmarkItem = useCallback((item: RSSItem) => {
    const extractLinkLocal = (item: RSSItem): string => {
      if (Array.isArray(item.link) && item.link.length > 0) {
        if (typeof item.link[0] === "object" && item.link[0]["$"]) {
          return item.link[0]["$"].href;
        }
        if (typeof item.link[0] === "string") return item.link[0];
      }
      if (typeof item.link === "string") return item.link;
      return item.id || "";
    };

    setLocalBookmarks((prevBookmarks) => {
      const updatedBookmarks = prevBookmarks.filter(
        (bookmark) => bookmark.link !== extractLinkLocal(item)
      );
      // Persist bookmarks - context doesn't manage bookmarks yet
      const currentLocalData = getLocallyStoredData();
      storeDataLocally({
        ...currentLocalData,
        bookmarks: updatedBookmarks,
      });
      return updatedBookmarks;
    });
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [rssItems]); // Keep dependency on rssItems

  if (
    rssItems.length < 1 &&
    navigation !== Navigations.BOOKMARKEDS &&
    !loading
  ) {
    return <PubListEmpty />;
  }

  if (
    navigation === Navigations.BOOKMARKEDS &&
    localBookmarks.length < 1 &&
    !loading
  ) {
    return <BookmarksEmpty />;
  }

  const getItemSize = (): number => {
    // Altura fija para el contenedor: padding (24px) + gap (8px) + altura del título (2 líneas máximo * 20px) + altura metadata (20px)
    return 24 + 8 + 40 + 40;
  };

  return (
    <>
      {/* Render the UpdateToast component */}
      <UpdateToast
        count={newItemsCount}
        isUpToDate={isFeedUpToDate}
        visible={isToastVisible}
        onDismiss={handleToastDismiss}
      />
      <div
        id="pubs-list"
        className="flex flex-col w-full max-h-full h-full overflow-scroll md:w-[800px] relative"
        onScroll={(e) => {
          scrollPositionRef.current = (e.target as HTMLDivElement).scrollTop;
        }}
      >
        {/* Mostrar el loading spinner como overlay siempre que esté cargando */}
        {loading && <LoadingSpinner overlay={true} />}
        
        {/* Render list if there are items */}
        {rssItems.length > 0 && (
          <AutoSizer>
            {({ height, width }) => (
              <VariableSizeList
                ref={listRef}
                itemSize={getItemSize}
                itemCount={rssItems.length}
                width={width}
                height={height}
                className="flex flex-col gap-4 variable-list"
                itemKey={(index) => {
                  const item = rssItems[index];
                  const link = item?.link || item?.id || index;
                  return `${item?.source || "src"}-${link}-${
                    item?.pubDate || index
                  }`;
                }}
              >
                {(props) => (
                  <Row
                    {...props}
                    items={rssItems}
                    localBookmarks={localBookmarks}
                    onBookmark={bookmarkItem}
                    onUnbookmark={unbookmarkItem}
                  />
                )}
              </VariableSizeList>
            )}
          </AutoSizer>
        )}
      </div>
      {navigation === Navigations.FILTER_SOURCES && (
        <FilterSourcesModal
          setNavigation={setNavigation}
          allSources={allSources} // Pass allSources from context
          activeSources={activeSources} // Pass activeSources from context
          setActiveSources={setActiveSources} // Pass setActiveSources from context
        />
      )}
    </>
  );
};

export const PubListEmpty = () => {
  return (
    <div className="p-8 flex flex-col gap-8 max-h-full overflow-scroll items-center">
      <p className="text-lg dark:text-gray-200">
        No rss sources added. Go to settings to add sources.
      </p>
    </div>
  );
};

export const BookmarksEmpty = () => {
  return (
    <div className="p-8 flex flex-col gap-8 max-h-full overflow-scroll items-center">
      <p className="text-lg dark:text-gray-200">
        No bookmarks added. Bookmark a publication to see it here.
      </p>
    </div>
  );
};
