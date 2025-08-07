import { RSSItem } from "../types/rss";
import type { DiscoveredFeed } from "../types/rss-discovery";
import { getApiUrl } from "./api";

type SourceToFetch = {
  id: string;
  url: string;
};

export const fetchRSS = async (sources: SourceToFetch[]) => {
    const response = await fetch(getApiUrl("/rss/fetch-feeds"), {
      method: "POST",
      body: JSON.stringify({
        urls: sources,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  const rssFeed = await response.json();
  return rssFeed;
};

export const fetchSingleRSS = async (id: string, video: boolean) => {
  try {
    const response = await fetch(getApiUrl('/rss'), {
      method: "POST",
      body: JSON.stringify({
        id: id,
        video: video,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const rssFeed = await response.json();
    return rssFeed;
  } catch (error) {
    console.log(error);
  }
};

export const getRSSItemStrProp = (item: RSSItem, prop: keyof RSSItem): string => {
  if (!item[prop]) return "";
  return Array.isArray(item[prop]) ? item[prop][0] : item[prop];
};

// Discover RSS/Atom feeds from a website URL by probing common endpoints
// and inspecting HTML <link rel="alternate"> tags via the backend.
export const discoverFeedsFromSite = async (siteUrl: string): Promise<DiscoveredFeed[]> => {
  const response = await fetch(getApiUrl("/rss/discover"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: siteUrl }),
  });

  if (!response.ok) {
    throw new Error(`Failed to discover feeds: ${response.status}`);
  }

  const data = (await response.json()) as { feeds?: DiscoveredFeed[] } | DiscoveredFeed[];
  // Accept either direct array or { feeds }
  const feeds = Array.isArray(data) ? data : data.feeds ?? [];

  // Normalize and dedupe by URL
  const unique = new Map<string, DiscoveredFeed>();
  for (const feed of feeds) {
    if (!feed?.url) continue;
    try {
      // Ensure absolute URLs resolve
      const normalized = new URL(feed.url, siteUrl).toString();
      unique.set(normalized, { url: normalized, title: feed.title });
    } catch {
      // skip invalid URL entries
    }
  }
  return Array.from(unique.values());
};
