import { RSSItem } from "../types/rss";
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

export const getRSSItemLink = (item: RSSItem): string => {
  if (Array.isArray(item.link) && item.link.length > 0) {
    const [firstLink] = item.link;
    if (typeof firstLink === "object" && firstLink && "$" in firstLink && firstLink["$"]?.href) {
      return firstLink["$"]?.href ?? "";
    }
    if (typeof firstLink === "string") {
      return firstLink;
    }
  }

  if (typeof item.link === "string") {
    return item.link;
  }

  if (typeof item.id === "string") {
    return item.id;
  }

  return "";
};

export const getRSSItemIdentifier = (item: RSSItem): string => {
  const link = getRSSItemLink(item);
  if (link) {
    return link;
  }

  if (Array.isArray(item.guid) && item.guid.length > 0) {
    const [firstGuid] = item.guid;
    if (typeof firstGuid === "string" && firstGuid) {
      return firstGuid;
    }
  }

  if (typeof item.id === "string" && item.id) {
    return item.id;
  }

  const title = getRSSItemStrProp(item, "title");
  const pubDate = getRSSItemStrProp(item, "pubDate");

  const fallback = `${title}-${pubDate}`.trim();
  if (fallback !== "-") {
    return fallback;
  }

  return title || pubDate;
};

export const calculateNewItemsCount = (
  previousItems: RSSItem[] | undefined,
  nextItems: RSSItem[] | undefined,
): number => {
  if (!Array.isArray(previousItems) || previousItems.length === 0) {
    return 0;
  }

  if (!Array.isArray(nextItems) || nextItems.length === 0) {
    return 0;
  }

  const previousIdentifiers = new Set(
    previousItems
      .map(getRSSItemIdentifier)
      .filter((identifier): identifier is string => Boolean(identifier)),
  );

  let newItems = 0;

  for (const item of nextItems) {
    const identifier = getRSSItemIdentifier(item);
    if (!identifier) continue;
    if (!previousIdentifiers.has(identifier)) {
      newItems += 1;
    }
  }

  return newItems;
};
