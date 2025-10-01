import { describe, it, expect, vi } from "vitest";
import type { HistoryItem, Items, Source } from "../../types/storage";
import type { BookmarkSourceStats, SourceStatistics } from "../statistics";

const modulePath = "../statistics";

describe("statistics utilities", () => {
  const sources: Source[] = [
    { id: "1", name: "Source One", url: "https://one.com", addedOn: "2024-01-01", color: "#123456", textColor: "#ffffff", initial: "S", type: "rss" },
    { id: "2", name: "Source Two", url: "https://two.com", addedOn: "2024-01-01", color: "#654321", textColor: "#000000", initial: "T", type: "rss" },
  ];

  it("calculates statistics for history entries", async () => {
    const { calculateSourceStatistics } = await import(modulePath);
    const history: HistoryItem[] = [
      { title: "A", link: "https://one.com/a", source: "1", visitedAt: "2024-05-01T10:00:00Z", sourceName: "Source One" },
      { title: "B", link: "https://one.com/b", source: "1", visitedAt: "2024-05-02T11:00:00Z", sourceName: "Source One" },
      { title: "C", link: "https://two.com/c", source: "2", visitedAt: "2024-05-03T12:00:00Z", sourceName: "Source Two" },
    ];

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-05-04T00:00:00Z"));

    const stats = calculateSourceStatistics(history, sources);
    expect(stats.totalVisits).toBe(3);
    expect(stats.uniqueSources).toBe(2);
    expect(stats.mostActiveSource?.sourceId).toBe("1");
    expect(stats.leastActiveSource?.sourceId).toBe("2");
    expect(stats.sourceStats.find((stat: SourceStatistics) => stat.sourceId === "1")?.totalVisits).toBe(2);
    expect(stats.lastSevenDays).toHaveLength(7);

    vi.useRealTimers();
  });

  it("returns empty statistics when history is empty", async () => {
    const { calculateSourceStatistics } = await import(modulePath);
    const stats = calculateSourceStatistics([], sources);
    expect(stats.totalVisits).toBe(0);
    expect(stats.sourceStats).toEqual([]);
    expect(stats.lastSevenDays).toHaveLength(7);
  });

  it("calculates bookmark statistics", async () => {
    const { calculateBookmarksStatistics } = await import(modulePath);
    const bookmarks: Items[] = [
      { title: "A", link: "https://one.com/a", source: "1", pubDate: "2024-05-01T00:00:00Z" },
      { title: "B", link: "https://one.com/b", source: "1", pubDate: "2024-05-02T00:00:00Z" },
      { title: "C", link: "https://two.com/c", source: "2", pubDate: "2024-05-03T00:00:00Z" },
    ];

    const stats = calculateBookmarksStatistics(bookmarks, sources);
    expect(stats.totalBookmarks).toBe(3);
    expect(stats.mostBookmarkedSource?.sourceId).toBe("1");
    expect(stats.sourceStats.find((stat: BookmarkSourceStats) => stat.sourceId === "2")?.totalBookmarks).toBe(1);
  });

  it("formats dates relative to now", async () => {
    const { formatDate } = await import(modulePath);
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-05-04T12:00:00Z"));

    expect(formatDate("2024-05-04T11:30:00Z")).toBe("Just now");
    expect(formatDate("2024-05-04T01:00:00Z")).toBe("11 hours ago");
    expect(formatDate("2024-05-03T12:00:00Z")).toBe("Yesterday");
    expect(formatDate("2024-05-01T12:00:00Z")).toBe("3 days ago");

    vi.useRealTimers();
  });

  it("formats day of week labels", async () => {
    const { formatDayOfWeek } = await import(modulePath);
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-05-04T12:00:00Z"));

    expect(formatDayOfWeek("2024-05-04T00:00:00Z")).toBe("Today");
    expect(formatDayOfWeek("2024-05-03T00:00:00Z")).toBe("Yesterday");
    expect(formatDayOfWeek("2024-05-02T00:00:00Z")).toBe("Thu");

    vi.useRealTimers();
  });
});
