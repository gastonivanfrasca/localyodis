import { Bookmark, BookmarkCheck, EyeOff } from "lucide-react";

import { RSSItem } from "../../types/rss";
import { RoundedIdentifier } from "./RoundedIdentifier";
import { Source } from "../../types/storage";
import { formatPubDate } from "../../utils/format";
import { useNavigate } from "react-router";
import { useState } from "react";

interface PubListItemProps {
  item: RSSItem;
  index: number;
  sourceData?: Source;
  bookmark: RSSItem | undefined;
  onBookmark: (item: RSSItem) => void;
  onUnbookmark: (item: RSSItem) => void;
  onHide: (item: RSSItem) => void;
}

export const PubListItem = ({ item, index, sourceData, bookmark, onBookmark, onUnbookmark, onHide }: PubListItemProps) => {
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  
  if (!sourceData) return null;

  const link = extractLink(item);
  let title = getRSSItemStrProp(item, "title");
  if (typeof title === "object") {
    title = title["_"];
  }

  const handleSourceClick = () => {
    navigate(`/sources/${sourceData.id}`);
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setSwipeProgress(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    
    if (touchStart) {
      const distance = currentX - touchStart;
      if (distance > 0) { // Only for right swipes
        // Normalize progress: 0-1 based on 150px swipe distance
        const progress = Math.min(distance / 150, 1);
        setSwipeProgress(progress);
      } else {
        setSwipeProgress(0);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setSwipeProgress(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -80; // Increased threshold for better UX
    
    if (isRightSwipe && !isAnimating) {
      // Start exit animation
      setIsAnimating(true);
      
      // Hide item after animation completes (300ms)
      setTimeout(() => {
        onHide(item);
      }, 300);
    } else {
      // Reset if swipe wasn't sufficient - smooth bounce back
      setSwipeProgress(0);
    }
  };

  return (
    <div
      className={`relative flex flex-row w-full gap-1 md:w-full text-left cursor-pointer mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden ${
        isAnimating ? 'swipe-out' : ''
      }`}
      key={`${link}-${title}-${index}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isAnimating 
          ? 'translateX(100%) scale(0.9)' 
          : `translateX(${swipeProgress * 30}px) scale(${1 - swipeProgress * 0.05})`, // Show preview during swipe
        opacity: isAnimating ? 0 : Math.max(0.3, 1 - swipeProgress * 0.7), // Fade preview
        transition: isAnimating 
          ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out' 
          : swipeProgress === 0 && touchEnd !== null 
            ? 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease-out' // Bounce back
            : 'none'
      }}
    >
      {/* Swipe indicator background */}
      {swipeProgress > 0 && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-end pr-4"
          style={{
            opacity: swipeProgress * 0.8,
            transition: 'opacity 0.1s ease-out'
          }}
        >
          <EyeOff 
            className="w-5 h-5 text-red-600 dark:text-red-400" 
            style={{
              transform: `scale(${0.8 + swipeProgress * 0.4})`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        </div>
      )}
      
      <div className="flex flex-col gap-2 text-gray-900 dark:text-gray-200 grow break-words max-w-full items-start relative z-10">
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

          <div className="relative z-20">
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