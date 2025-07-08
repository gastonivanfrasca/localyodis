import { Bookmark, BookmarkCheck } from "lucide-react";

import { RSSItem } from "../../types/rss";
import { RoundedIdentifier } from "./RoundedIdentifier";
import { Source } from "../../types/storage";
import { formatPubDate } from "../../utils/format";
import { useNavigate } from "react-router";

interface PubListItemProps {
  item: RSSItem;
  index: number;
  sourceData?: Source;
  bookmark: RSSItem | undefined;
  onBookmark: (item: RSSItem) => void;
  onUnbookmark: (item: RSSItem) => void;
}

export const PubListItem = ({ item, index, sourceData, bookmark, onBookmark, onUnbookmark }: PubListItemProps) => {
  const navigate = useNavigate();
  
  if (!sourceData) return null;

  const link = extractLink(item);
  let title = getRSSItemStrProp(item, "title");
  if (typeof title === "object") {
    title = title["_"];
  }

  const handleSourceClick = () => {
    navigate(`/sources/${sourceData.id}`);
  };

  return (
    <div
      className="flex flex-row w-full gap-1 md:w-full text-left cursor-pointer mb-6 pb-4 border-b border-gray-200 dark:border-gray-700"
      key={`${link}-${title}-${index}`}
    >
      <div className="flex flex-col gap-2 text-gray-900 dark:text-gray-200 grow break-words max-w-full items-start">
        <div className="flex flex-row gap-2 items-start">
          <button
            onClick={() => window.open(link, "_blank")}
            className="font-semibold text-lg text-left cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
            <button
              onClick={handleSourceClick}
              className="text-xs truncate max-w-[100px] hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left text-gray-600 dark:text-gray-400"
            >
              {sourceData.name}
            </button>
            {item.pubDate && (
              <p className="text-xs self-end text-right whitespace-nowrap text-gray-500 dark:text-gray-400">
                {formatPubDate(item.pubDate)}
              </p>
            )}
          </div>

          {bookmark !== undefined ? (
            <button
              className="text-gray-700 dark:text-gray-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => onUnbookmark(item)}
            >
              <BookmarkCheck
                className="h-4"
                style={{ color: "#1e7bc0" }}
              />
            </button>
          ) : (
            <button
              className="text-gray-700 dark:text-gray-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => onBookmark(item)}
            >
              <Bookmark className="h-4 text-gray-800 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
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