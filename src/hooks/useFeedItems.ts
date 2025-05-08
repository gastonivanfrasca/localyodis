import { useEffect, useState, useCallback, useRef } from "react";
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
  const isFetchingRef = useRef(false); // Prevent concurrent fetches
  const isManualRefreshRef = useRef(false); // Track if fetch was triggered manually

  const fetchRSSItems = useCallback(async (manualRefresh: boolean = false) => {
    if (isFetchingRef.current) return; // Prevent concurrent fetches
    isFetchingRef.current = true;
    isManualRefreshRef.current = manualRefresh; // Set if this is a manual refresh

    // Show loading indicator appropriately
    const lastFetchTime = getLastFetchTimestamp();
    // Show loading if cache is empty, or if it's a manual refresh
    if (rssItems.length === 0 || manualRefresh) {
       setLoading(true);
    }
    // Always reset toast states before a fetch, especially manual ones
    setIsFeedUpToDate(false);
    setNewItemsCount(null);

    const sourcesToFetch = allSources.filter((source) =>
      activeSources.includes(source.id)
    );

    if (sourcesToFetch.length < 1) {
      setRssItems([]);
      sessionStorage.removeItem(CACHED_FEED_ITEMS_KEY);
      sessionStorage.removeItem(LAST_FETCH_TIMESTAMP_KEY);
      setLoading(false);
      isFetchingRef.current = false;
      return;
    }

    const sourcesURL = sourcesToFetch.map((source) => ({
      id: source.id,
      url: source.url,
    }));

    const isRefresh = lastFetchTime !== null; // Was there a previous fetch?

    try {
      const fetchedData = await fetchFeeds(sourcesURL);
      const sortedFeed = fetchedData.feed.sort((a: RSSItem, b: RSSItem) => {
        const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
        const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
        return dateB - dateA;
      });

      let currentNewCount = 0;
      // Calculate new items and trigger toast *only* if it was a manual refresh *and* there was a previous fetch time
      if (isManualRefreshRef.current && isRefresh && lastFetchTime) {
        currentNewCount = sortedFeed.filter((item: { pubDate: string | number | Date; }) =>
          item.pubDate && new Date(item.pubDate).getTime() > lastFetchTime
        ).length;
        setNewItemsCount(currentNewCount);
        setIsFeedUpToDate(currentNewCount === 0);
        setShowToastSignal(prev => prev + 1); // Trigger toast visibility
      } else {
         // For non-manual refreshes (initial load, filter change), reset toast states
         setNewItemsCount(null);
         setIsFeedUpToDate(false);
      }

      setRssItems(sortedFeed);
      const currentTimestamp = Date.now();
      sessionStorage.setItem(CACHED_FEED_ITEMS_KEY, JSON.stringify(sortedFeed));
      // Only update timestamp if data was actually fetched successfully
      sessionStorage.setItem(LAST_FETCH_TIMESTAMP_KEY, currentTimestamp.toString());

    } catch (error) {
      console.error("Failed to fetch feeds:", error);
      // Keep stale data? Clear? For now, keep stale data from cache if available
      setNewItemsCount(null);
      setIsFeedUpToDate(false);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      isManualRefreshRef.current = false; // Reset manual refresh flag
    }
  // Include dependencies needed for fetch logic
  }, [activeSources, allSources, rssItems.length]); // Added rssItems.length to re-evaluate loading state

  useEffect(() => {
    // This effect handles navigation changes and initial load/filter changes

    // Reset toast states immediately on navigation or filter change
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
      // Don't clear timestamp here, keep it for subsequent manual refreshes on HOME
      setLoading(false);
      return;
    }

    // Fetch items for HOME view (initial load or filter change)
    // Pass `false` to indicate it's not a manual refresh
    fetchRSSItems(false);

  // Dependencies: navigation triggers view change (bookmarks vs home),
  // activeSources/allSources trigger refetch on filter change.
  // fetchRSSItems is memoized and included.
  }, [navigation, activeSources, allSources, localBookmarks, fetchRSSItems]);

  // Expose a function for manual refresh
  const refreshFeedItems = useCallback(() => {
     // Call fetchRSSItems with manualRefresh = true
     fetchRSSItems(true);
  }, [fetchRSSItems]); // Depends on the memoized fetchRSSItems

  return { rssItems, loading, newItemsCount, isFeedUpToDate, showToastSignal, refreshFeedItems }; // Expose refresh function
};
