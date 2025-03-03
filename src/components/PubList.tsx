import { Bookmark, BookmarkCheck } from "lucide-react";
import {
  getLocallyStoredData,
  getSourceByID,
  storeDataLocally,
} from "../utils/storage";
import { useEffect, useState } from "react";

import { Bookmark as BookmarkT } from "../types/storage";
import { RSSItem } from "../types/rss";
import { RoundedIdentifier } from "./RoundedIdentifier";
import { formatPubDate } from "../utils/format";

type PubsListProps = {
  rssItems: RSSItem[];
};

export const PubsList = (props: PubsListProps) => {
  const { rssItems } = props;
  const [bookmarks, setBookmarks] = useState<BookmarkT[]>([]);

  useEffect(() => {
    const localData = getLocallyStoredData();
    setBookmarks(localData.bookmarks || []);
  }, []);

  const bookmarkItem = (item: RSSItem) => {
    const localData = getLocallyStoredData();
    const bookmarks = localData.bookmarks || [];
    const newBookmark = {
      title: item.title![0],
      link: item.link![0],
      source: item.source,
      pubDate: item.pubDate![0],
    };
    storeDataLocally({ ...localData, bookmarks: [...bookmarks, newBookmark] });
    setBookmarks([...bookmarks, newBookmark]);
  };

  const unbookmarkItem = (item: RSSItem) => {
    const localData = getLocallyStoredData();
    const bookmarks = localData.bookmarks || [];
    const updatedBookmarks = bookmarks.filter(
      (bookmark) => bookmark.link !== item.link![0]
    );
    storeDataLocally({ ...localData, bookmarks: updatedBookmarks });
    setBookmarks(updatedBookmarks);
  };

  return (
    <div className="p-8 flex flex-col gap-8 max-h-full overflow-scroll items-center">
      {rssItems.map((item) => {
        const sourceData = getSourceByID(item.source);
        if (!sourceData) return null;
        return (
          <div
            className="flex flex-row w-full gap-1 md:w-[800px] rounded-sm border-b-2 border-neutral-200 dark:border-neutral-600 text-left cursor-pointer"
            key={item.link}
          >
            <div className="flex flex-col gap-2 rounded-sm dark:text-gray-200  grow break-words max-w-full items-start pb-4">
              <div className="flex flex-row gap-2 items-start">
                <button
                  onClick={() => window.open(item.link || "", "_blank")}
                  className="font-semibold text-lg text-left"
                >
                  {item.title}
                </button>
              </div>
              <div className="flex flex-row gap-2 w-full justify-end items-end mt-2">
                <RoundedIdentifier
                  color={sourceData.color}
                  textColor={sourceData.textColor}
                  initial={sourceData.initial}
                />
                <p className="text-xs overflow-ellipsis whitespace-nowrap">
                  {sourceData.name}
                </p>
                {item.pubDate && (
                  <p className="text-xs self-end text-right whitespace-nowrap">
                    {formatPubDate(item.pubDate)}
                  </p>
                )}

                {bookmarks.find(
                  (bookmark) => bookmark.link === item.link![0]
                ) ? (
                  <button
                    className="dark:text-gray-200 underline cursor-pointer"
                    onClick={() => unbookmarkItem(item)}
                  >
                    <BookmarkCheck
                      className="h-4"
                      style={{ color: "#1e7bc0" }}
                    />
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
      })}
    </div>
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
