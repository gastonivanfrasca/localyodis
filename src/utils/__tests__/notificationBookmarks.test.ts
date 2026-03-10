import { buildBookmarkFromNotification, hasBookmarkLink, resolveSourceIdFromUrl } from "../notificationBookmarks";
import type { Items, Source } from "../../types/storage";
import { describe, expect, it } from "vitest";

describe("notificationBookmarks", () => {
  const sources: Source[] = [
    {
      id: "source-1",
      name: "My Feed",
      url: "https://example.com/feed.xml",
      addedOn: "2026-03-09T00:00:00.000Z",
      color: "#000000",
      textColor: "#ffffff",
      initial: "M",
      type: "rss",
    },
  ];

  it("resolves a source id from the source url", () => {
    expect(resolveSourceIdFromUrl("https://example.com/feed.xml", sources)).toBe("source-1");
    expect(resolveSourceIdFromUrl("https://unknown.com/feed.xml", sources)).toBeNull();
  });

  it("builds a bookmark payload for notification actions", () => {
    expect(
      buildBookmarkFromNotification(
        {
          title: "Saved from push",
          link: "https://example.com/article",
          sourceUrl: "https://example.com/feed.xml",
          pubDate: "2026-03-09T10:00:00.000Z",
        },
        sources,
      ),
    ).toEqual({
      title: "Saved from push",
      link: "https://example.com/article",
      source: "source-1",
      pubDate: "2026-03-09T10:00:00.000Z",
    });
  });

  it("returns null when the notification has no link", () => {
    expect(buildBookmarkFromNotification({ title: "Missing link" }, sources)).toBeNull();
  });

  it("detects duplicated bookmark links", () => {
    const bookmarks: Items[] = [
      {
        title: "Saved from push",
        link: "https://example.com/article",
        source: "source-1",
        pubDate: "2026-03-09T10:00:00.000Z",
      },
    ];

    expect(hasBookmarkLink(bookmarks, "https://example.com/article")).toBe(true);
    expect(hasBookmarkLink(bookmarks, "https://example.com/other")).toBe(false);
  });
});
