import { useEffect, useState } from "react";
import { Navigations } from "../types/navigation";
import { RSSItem } from "../types/rss";
import { Source } from "../types/storage";
import { fetchFeeds } from "../utils/api";

export const useFeedItems = (
  navigation: Navigations,
  activeSources: string[],
  localBookmarks: RSSItem[],
  allSources: Source[]
) => {
  const [loading, setLoading] = useState(true);
  const [rssItems, setRssItems] = useState<RSSItem[]>([]);

  useEffect(() => {
    setLoading(true);
    setRssItems([]);

    if (navigation === Navigations.BOOKMARKEDS) {
      setRssItems(
        [...localBookmarks].sort((a, b) => {
          const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
          const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
          return dateB - dateA;
        })
      );
      setLoading(false);
      return;
    }

    // Fetch feeds only if not in bookmark view
    const fetchRSSItems = async () => {
      const sourcesToFetch = allSources.filter((source) =>
        activeSources.includes(source.id)
      );

      if (sourcesToFetch.length < 1) {
        setRssItems([]); // No sources selected or available
        setLoading(false);
        return;
      }

      const sourcesURL = sourcesToFetch.map((source) => ({
        id: source.id,
        url: source.url,
      }));

      try {
        const fetchedData = await fetchFeeds(sourcesURL);
        // Sort fetched items by date, newest first
        const sortedFeed = fetchedData.feed.sort((a: { pubDate: string | number | Date; }, b: { pubDate: string | number | Date; }) => {
          const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
          const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
          return dateB - dateA;
        });
        setRssItems(sortedFeed);
      } catch (error) {
        console.error("Failed to fetch feeds:", error);
        setRssItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRSSItems();
  }, [navigation, activeSources, allSources, localBookmarks]);

  return { rssItems, loading };
};
