import { Bookmark, BookmarkCheck } from "lucide-react";
import { getSourceByID, storeDataLocally } from "../utils/storage";
import { useEffect, useRef, useState } from "react";

import AutoSizer from "react-virtualized-auto-sizer";
import { FilterSourcesModal } from "./FilterSourcesModal";
import { LoadingSpinner } from "./LoadingSpinner";
import { Navigations } from "../types/navigation";
import { RSSItem } from "../types/rss";
import { RoundedIdentifier } from "./v2/RoundedIdentifier";
import { VariableSizeList } from "react-window";
import { fetchFeeds } from "../utils/api";
import { formatPubDate } from "../utils/format";
import { getLocallyStoredData } from "../utils/storage";
import { useNavigation } from "../context/hooks";

type RowProps = {
  index: number;
  style: React.CSSProperties;
};

export const PubsList = () => {
  const localData = getLocallyStoredData();
  const { navigation, setNavigation, isDesktop } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [rssItems, setRssItems] = useState<RSSItem[]>([]);
  const [localBookmarks, setLocalBookmarks] = useState(localData.bookmarks);
  const [activeSources, setActiveSources] = useState<string[]>([
    ...localData.sources.map((source) => source.id),
  ]);
  const scrollPositionRef = useRef(0);
  const navigationRef = useRef(navigation);

  useEffect(() => {
    const element = document.getElementById("pubs-list") as HTMLDivElement;
    if (!element) return;

    if (navigationRef.current !== navigation) {
      element.scrollTop = 0;
      navigationRef.current = navigation;
    } else {
      element.scrollTop = scrollPositionRef.current;
    }
  }, [navigation]);

  useEffect(() => {
    setLoading(true);

    if (navigation === Navigations.BOOKMARKEDS) {
      setRssItems([...(localBookmarks as RSSItem[])]);
      setLoading(false);
      return;
    }

    const fetchRSSItems = async () => {
      const sourcesToFetch = localData.sources.filter((source) =>
        activeSources.includes(source.id)
      );
      if (sourcesToFetch.length < 1) return;
      const sourcesURL = sourcesToFetch.map((source) => {
        return {
          id: source.id,
          url: source.url,
        };
      });
      try {
        const rssItems = await fetchFeeds(sourcesURL);
        setRssItems(rssItems.feed);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRSSItems()
      .then(() => setLoading(false))
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [localBookmarks, navigation, activeSources]);

  const bookmarkItem = (item: RSSItem) => {
    const newBookmark = {
      title: getRSSItemStrProp(item, "title"),
      link: extractLink(item),
      source: item.source,
      pubDate: getRSSItemStrProp(item, "pubDate"),
    };
    storeDataLocally({
      ...localData,
      bookmarks: [...localBookmarks, newBookmark],
    });
    setLocalBookmarks([...localBookmarks, newBookmark]);
  };

  const unbookmarkItem = (item: RSSItem) => {
    const updatedBookmarks = localBookmarks.filter(
      (bookmark) => bookmark.link !== extractLink(item)
    );
    storeDataLocally({ ...localData, bookmarks: updatedBookmarks });
    setLocalBookmarks(updatedBookmarks);
  };

  const Row = ({ index, style }: RowProps) => {
    const item = rssItems[index];
    if (!item) return null;
    const sourceData = getSourceByID(item.source);
    if (!sourceData) return null;
    const bookmark = localBookmarks.find((bookmark) => {
      const bookmarkLink = bookmark.link;
      const itemLink = extractLink(item);
      return bookmarkLink === itemLink;
    });

    const link = extractLink(item);
    let title = getRSSItemStrProp(item, "title");
    if (typeof title === "object") {
      title = title["_"];
    }

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
              className="font-semibold text-lg text-left"
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
                className="dark:text-gray-200 underline cursor-pointer"
                onClick={() => unbookmarkItem(item)}
              >
                <BookmarkCheck className="h-4" style={{ color: "#1e7bc0" }} />
              </button>
            ) : (
              <button
                className="dark:text-gray-200 underline cursor-pointer"
                onClick={() => bookmarkItem(item)}
              >
                <Bookmark className="h-4 text-gray-800 dark:text-gray-400 " />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

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

  const getItemSize = (index: number) => {
    const item = rssItems[index];
    if (!item) return 0;
    const sourceData = getSourceByID(item.source);
    if (!sourceData) return 0;
    const title = getRSSItemStrProp(item, "title");
    if (typeof title === "string") {
      const titleSize = Math.ceil(title.length / 40) * 20;
      return titleSize + 110;
    }

    if (typeof title === "object") {
      const nodedTitle = title["_"] as string;
      if (!nodedTitle) return 0;
      const titleSize = Math.ceil(nodedTitle.length / 40) * 20;
      return titleSize + 110;
    }
    return 0;
  };

  return (
    <>
      <div
        id="pubs-list"
        className="p-8 pt-0 flex flex-col gap-8 max-h-full items-center h-full overflow-scroll"
        onScroll={(e) => {
          const element = e.target as HTMLDivElement;
          const bottom =
            element.scrollHeight - element.scrollTop === element.clientHeight;
          if (bottom && !loading) {
            scrollPositionRef.current = element.scrollTop;
            setLoading(true);
          }
        }}
      >
        <AutoSizer disableWidth>
          {({ height }) => (
            <VariableSizeList
              itemSize={getItemSize}
              itemCount={rssItems.length}
              width={isDesktop ? 800 : 300}
              height={height}
            >
              {Row}
            </VariableSizeList>
          )}
        </AutoSizer>
      </div>
      {loading && <LoadingSpinner />}
      {navigation === Navigations.FILTER_SOURCES && (
        <FilterSourcesModal
          setNavigation={setNavigation}
          allSources={localData.sources}
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

const getRSSItemStrProp = (item: RSSItem, prop: keyof RSSItem): string => {
  if (!item[prop]) return "";
  return Array.isArray(item[prop]) ? item[prop][0] : item[prop];
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
