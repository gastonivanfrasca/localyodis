import { ActionTypes, useMainContext } from "../context/main";
import { fetchRSS, getRSSItemStrProp } from "../utils/rss";
import { useEffect, useRef } from "react";

import { BackgroundedButtonWithIcon } from "./v2/AddSourceButton";
import { LoadingSpinner } from "./LoadingSpinner";
import { Navigations } from "../types/navigation";
import { PubListItem } from "./v2/PubListItem";
import { RSSItem } from "../types/rss";
import { Settings } from "lucide-react";
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
        dispatch({
          type: ActionTypes.SET_ACTIVE_ITEMS,
          payload: newItems,
        });
        dispatch({
          type: ActionTypes.SET_LAST_UPDATED,
          payload: new Date().toISOString(),
        });
      } catch {
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
      <div id="pubs-list" className="p-8 flex flex-col gap-8 h-full w-full">
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
    <div className="p-16 flex flex-col gap-8 max-h-full overflow-scroll items-center">
      <p className="text-xl dark:text-gray-200">No rss sources added</p>
      <p className="text-sm dark:text-gray-400">Go to sources to add one.</p>
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
    <div className="p-8 flex flex-col gap-8 max-h-full overflow-scroll items-center">
      <p className="text-lg dark:text-gray-200">
        No bookmarks added. Bookmark a publication to see it here.
      </p>
    </div>
  );
};

export const SearchEmpty = () => {
  return (
    <div className="p-8 flex flex-col gap-8 max-h-full overflow-scroll items-center">
      <p className="text-lg dark:text-gray-200">No results found.</p>
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
    <div className="p-8 flex flex-col gap-8 max-h-full overflow-scroll items-center">
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
    </div>
  );
};
