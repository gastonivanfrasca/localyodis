import type { Items, Source } from "../types/storage";

export type NotificationBookmarkPayload = {
  title?: string | null;
  link?: string | null;
  sourceUrl?: string | null;
  sourceName?: string | null;
  pubDate?: string | null;
};

export const resolveSourceIdFromUrl = (sourceUrl: string | null | undefined, sources: Source[]) => {
  if (!sourceUrl) {
    return null;
  }

  return sources.find((source) => source.url === sourceUrl)?.id ?? null;
};

export const buildBookmarkFromNotification = (
  payload: NotificationBookmarkPayload,
  sources: Source[],
): Items | null => {
  if (!payload.link) {
    return null;
  }

  return {
    title: payload.title || payload.link,
    link: payload.link,
    source: resolveSourceIdFromUrl(payload.sourceUrl, sources),
    pubDate: payload.pubDate || null,
  };
};

export const hasBookmarkLink = (bookmarks: Items[], link: string | null | undefined) => {
  if (!link) {
    return false;
  }

  return bookmarks.some((bookmark) => bookmark.link === link);
};
