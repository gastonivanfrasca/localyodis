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
