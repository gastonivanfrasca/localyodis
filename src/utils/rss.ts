import { getApiUrl } from "./api";

type SourceToFetch = {
  id: string;
  url: string;
};

export const fetchRSS = async (sources: SourceToFetch[]) => {
  try {
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
  } catch (error) {
    console.log(error);
  }
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
