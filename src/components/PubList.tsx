import { Bookmark, BookmarkCheck } from "lucide-react";
import { getSourceByID, storeDataLocally } from "../utils/storage";
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
import { getLocallyStoredData } from "../utils/storage";
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

const Row = ({ index, style, items, localBookmarks, onBookmark, onUnbookmark }: RowProps) => {
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
    if (typeof value === 'object' && value !== null && '_' in value) {
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
      className="flex flex-row w-full gap-1 md:w-[800px] rounded-sm border-b-2 border-neutral-200 dark:border-neutral-600 text-left cursor-pointer mt-4"
      key={link}
      style={style}
    >
      <div className="flex flex-col gap-2 rounded-sm dark:text-gray-200  grow break-words max-w-full items-start justify-end pb-4 w-full">
        <div className="flex flex-row gap-2 items-start">
          <button
            onClick={() => window.open(link, "_blank")}
            className="font-semibold text-lg text-left hover:underline"
            aria-label={`Read article: ${title}`}
          >
            {title}
          </button>
        </div>
        <div className="flex flex-row gap-2 w-full justify-between items-end mt-2">
          <div className="flex flex-row gap-2 items-center">
            <RoundedIdentifier
              color={sourceData.color}
              textColor={sourceData.textColor}
              initial={sourceData.initial}
              video={sourceData.type === "video"}
              small
            />
            <p className="text-xs truncate max-w-[100px]">
              {sourceData.name}
            </p>
            {item.pubDate && (
              <p className="text-xs self-end text-right whitespace-nowrap">
                {formatPubDate(item.pubDate)}
              </p>
            )}
          </div>

          {bookmark !== undefined ? (
            <button
              className="dark:text-gray-200 underline cursor-pointer p-1"
              onClick={() => onUnbookmark(item)}
              aria-label="Remove bookmark"
            >
              <BookmarkCheck className="h-4" style={{ color: "#1e7bc0" }} />
            </button>
          ) : (
            <button
              className="dark:text-gray-200 underline cursor-pointer p-1"
              onClick={() => onBookmark(item)}
              aria-label="Bookmark item"
            >
              <Bookmark className="h-4 text-gray-800 dark:text-gray-400 " />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const PubsList = () => {
  const initialLocalData = useMemo(() => getLocallyStoredData(), []);

  const { navigation, setNavigation, isDesktop } = useNavigation();
  const [localBookmarks, setLocalBookmarks] = useState(initialLocalData.bookmarks);
  const [activeSources, setActiveSources] = useState<string[]>(() =>
    initialLocalData.sources.map((source) => source.id)
  );
  const scrollPositionRef = useRef(0);
  const navigationRef = useRef(navigation);
  const listRef = useRef<VariableSizeList>(null);
  const [isToastVisible, setIsToastVisible] = useState(false); // State for toast visibility

  const { rssItems, loading, newItemsCount, isFeedUpToDate, showToastSignal } = useFeedItems(
    navigation,
    activeSources,
    localBookmarks,
    initialLocalData.sources
  );

  // Effect to show the toast when the signal changes
  useEffect(() => {
    if (showToastSignal > 0) { // Check if signal is greater than 0 (initial state)
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
    const getRSSItemStrPropLocal = (item: RSSItem, prop: keyof RSSItem): string => {
      if (!item[prop]) return "";
      const value = Array.isArray(item[prop]) ? item[prop][0] : item[prop];
      if (typeof value === 'object' && value !== null && '_' in value) {
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

    setLocalBookmarks(prevBookmarks => {
        const updatedBookmarks = [...prevBookmarks, newBookmark];
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

    setLocalBookmarks(prevBookmarks => {
        const updatedBookmarks = prevBookmarks.filter(
          (bookmark) => bookmark.link !== extractLinkLocal(item)
        );
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
  }, [rssItems]);

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

  const getItemSize = (index: number): number => {
    const item = rssItems[index];
    if (!item) return 0;
    const getRSSItemStrPropLocal = (item: RSSItem, prop: keyof RSSItem): string => {
      if (!item[prop]) return "";
      const value = Array.isArray(item[prop]) ? item[prop][0] : item[prop];
      if (typeof value === 'object' && value !== null && '_' in value) {
          return String(value._);
      }
      return String(value); 
    };

    const title = getRSSItemStrPropLocal(item, "title");
    const titleLines = Math.ceil(title.length / (isDesktop ? 60 : 40));
    const baseHeight = 100;
    const titleHeight = titleLines * 20;
    return baseHeight + titleHeight;
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
        className="flex flex-col w-full max-h-full h-full overflow-scroll md:w-[800px] relative" // Added relative positioning for overlay spinner
        onScroll={(e) => {
          scrollPositionRef.current = (e.target as HTMLDivElement).scrollTop;
        }}
      >
        {/* Conditional rendering logic improved */}
        {loading && rssItems.length === 0 && <LoadingSpinner />} {/* Show spinner only if loading initial items */}

        {!loading && rssItems.length === 0 && navigation !== Navigations.BOOKMARKEDS && <PubListEmpty />}
        {!loading && rssItems.length === 0 && navigation === Navigations.BOOKMARKEDS && localBookmarks.length === 0 && <BookmarksEmpty />}

        {/* Render list only if there are items */}
        {rssItems.length > 0 && (
          <AutoSizer>
            {({ height, width }) => (
              <VariableSizeList
                ref={listRef}
                itemSize={getItemSize}
                itemCount={rssItems.length}
                width={width}
                height={height}
                itemKey={(index) => {
                  const item = rssItems[index];
                  const link = item?.link || item?.id || index;
                  return `${item?.source || 'src'}-${link}-${item?.pubDate || index}`;
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
         {/* Show loading spinner overlay if loading *after* initial items are shown */}
         {loading && rssItems.length > 0 && <LoadingSpinner overlay={true} />}
      </div>
      {navigation === Navigations.FILTER_SOURCES && (
        <FilterSourcesModal
          setNavigation={setNavigation}
          allSources={initialLocalData.sources}
          activeSources={activeSources}
          setActiveSources={setActiveSources}
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
