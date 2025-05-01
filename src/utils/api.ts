import { SourceToFetch } from "../types/rss";
import { LocallyStoredData as StoredData } from "../types/storage";

export const API_BASE_URL = import.meta.env.VITE_SERVER_BASEPATH;

export const getApiUrl = (path: string) => {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

// --- RSS Feed Fetching ---

export const fetchFeeds = async (sources: SourceToFetch[]) => {
  const response = await fetch(getApiUrl("/rss/fetch-feeds"), {
    method: "POST",
    body: JSON.stringify({ urls: sources }),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch feeds: ${response.statusText}`);
  }
  return response.json();
};

export const fetchSingleFeed = async (id: string, video: boolean) => {
  const response = await fetch(getApiUrl('/rss'), {
    method: "POST",
    body: JSON.stringify({ id, video }),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch single feed: ${response.statusText}`);
  }
  return response.json();
};

// --- Configuration Management ---

export const uploadConfig = async (data: StoredData): Promise<{ id: string }> => {
  const response = await fetch(getApiUrl('/config/upload'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
  const result = await response.json();
   if (typeof result.id !== 'string') {
       throw new Error('Invalid server response: ID not found or not a string');
   }
  return result;
};

export const downloadConfig = async (id: string): Promise<StoredData> => {
  const response = await fetch(getApiUrl('/config/download'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }
  return response.json();
};