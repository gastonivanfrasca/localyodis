import { useEffect, useState } from "react";
import { Navigations } from "../types/navigation";
import { RSSItem } from "../types/rss";
import { Source } from "../types/storage";
import { fetchFeeds } from "../utils/api";

const CACHED_FEED_ITEMS_KEY = 'cachedFeedItems';
const LAST_FETCH_TIMESTAMP_KEY = 'lastFetchTimestamp';

// Helper function to get initial state from sessionStorage
const getInitialRssItems = (): RSSItem[] => {
  try {
    const cachedItems = sessionStorage.getItem(CACHED_FEED_ITEMS_KEY);
    return cachedItems ? JSON.parse(cachedItems) : [];
  } catch (error) {
    console.error("Failed to parse cached feed items:", error);
    sessionStorage.removeItem(CACHED_FEED_ITEMS_KEY); // Clear invalid cache
    return [];
  }
};

// Helper function to get last fetch timestamp
const getLastFetchTimestamp = (): number | null => {
  const timestamp = sessionStorage.getItem(LAST_FETCH_TIMESTAMP_KEY);
  return timestamp ? parseInt(timestamp, 10) : null;
};

export const useFeedItems = (
  navigation: Navigations,
  activeSources: string[],
  localBookmarks: RSSItem[],
  allSources: Source[]
) => {
  const [loading, setLoading] = useState(true);
  const [rssItems, setRssItems] = useState<RSSItem[]>(getInitialRssItems);
  const [newItemsCount, setNewItemsCount] = useState<number | null>(null);
  const [isFeedUpToDate, setIsFeedUpToDate] = useState<boolean>(false);
  const [showToastSignal, setShowToastSignal] = useState<number>(0); // Use a counter to trigger effect

  useEffect(() => {
    // Reset toast states on navigation change or source change
    setNewItemsCount(null);
    setIsFeedUpToDate(false);

    if (navigation === Navigations.BOOKMARKEDS) {
      setLoading(true); // Show loading for bookmark view transition
      const sortedBookmarks = [...localBookmarks].sort((a, b) => {
        const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
        const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
        return dateB - dateA;
      });
      setRssItems(sortedBookmarks);
      sessionStorage.removeItem(CACHED_FEED_ITEMS_KEY);
      sessionStorage.removeItem(LAST_FETCH_TIMESTAMP_KEY);
      setLoading(false);
      return;
    }

    const fetchRSSItems = async () => {
      // Show loading indicator if cache is empty or if it's a subsequent fetch (indicated by lastFetchTime)
      const lastFetchTime = getLastFetchTimestamp();
      if (rssItems.length === 0 || lastFetchTime) {
        setLoading(true);
      }
      setIsFeedUpToDate(false); // Reset up-to-date status before fetch
      setNewItemsCount(null); // Reset new items count

      const sourcesToFetch = allSources.filter((source) =>
        activeSources.includes(source.id)
      );

      if (sourcesToFetch.length < 1) {
        setRssItems([]);
        sessionStorage.removeItem(CACHED_FEED_ITEMS_KEY);
        sessionStorage.removeItem(LAST_FETCH_TIMESTAMP_KEY);
        setLoading(false);
        return;
      }

      const sourcesURL = sourcesToFetch.map((source) => ({
        id: source.id,
        url: source.url,
      }));

      // Store whether this fetch was triggered after a previous fetch existed
      const isRefresh = lastFetchTime !== null;

      try {
        const fetchedData = await fetchFeeds(sourcesURL);
        const sortedFeed = fetchedData.feed.sort((a: RSSItem, b: RSSItem) => {
          const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
          const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
          return dateB - dateA;
        });

        let currentNewCount = 0;
        // Calculate new items only if it was a refresh (lastFetchTime existed)
        if (isRefresh && lastFetchTime) {
          currentNewCount = sortedFeed.filter((item: { pubDate: string | number | Date; }) =>
            item.pubDate && new Date(item.pubDate).getTime() > lastFetchTime
          ).length;
          setNewItemsCount(currentNewCount);
          setIsFeedUpToDate(currentNewCount === 0);
        } else {
          // On the very first load (no lastFetchTime), don't set these states
          setNewItemsCount(null);
          setIsFeedUpToDate(false);
        }

        setRssItems(sortedFeed);
        const currentTimestamp = Date.now();
        sessionStorage.setItem(CACHED_FEED_ITEMS_KEY, JSON.stringify(sortedFeed));
        sessionStorage.setItem(LAST_FETCH_TIMESTAMP_KEY, currentTimestamp.toString());

        // Trigger toast visibility only if it was a refresh
        if (isRefresh) {
           setShowToastSignal(prev => prev + 1); // Increment signal to trigger toast
        }

      } catch (error) {
        console.error("Failed to fetch feeds:", error);
        // Keep stale data? Clear? For now, keep stale data from cache if available
        // setRssItems([]); // Optionally clear items on error
        // sessionStorage.removeItem(CACHED_FEED_ITEMS_KEY);
        // sessionStorage.removeItem(LAST_FETCH_TIMESTAMP_KEY);
        setNewItemsCount(null);
        setIsFeedUpToDate(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRSSItems();
  }, [navigation, activeSources, allSources, localBookmarks]); // Dependencies

  return { rssItems, loading, newItemsCount, isFeedUpToDate, showToastSignal };
};
