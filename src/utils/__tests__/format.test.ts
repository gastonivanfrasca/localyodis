import { describe, it, expect, vi } from "vitest";

const modulePath = "../format";

describe("format utilities", () => {
  it("formats publication dates relative to today", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-05-08T12:00:00Z"));

    const { formatPubDate } = await import(modulePath);
    expect(formatPubDate("2024-05-08T08:00:00Z")).toBe("Today");
    expect(formatPubDate("2024-05-07T23:00:00Z")).toBe("Yesterday");
    expect(formatPubDate("2024-05-04T12:00:00Z")).toBe("4 days ago");
    expect(formatPubDate("2023-12-31T12:00:00Z")).toBe("Dec 31, 2023");
    expect(formatPubDate("invalid")).toBe("Unknown");

    vi.useRealTimers();
  });

  it("formats time values", async () => {
    const { formatTime } = await import(modulePath);
    const spy = vi.spyOn(Date.prototype, "toLocaleTimeString").mockReturnValue("8:30 AM");
    expect(formatTime("2024-05-08T08:30:00Z")).toBe("8:30 AM");
    expect(formatTime("invalid")).toBe("Unknown");
    spy.mockRestore();
  });

  it("determines date categories and separators", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-05-08T12:00:00Z"));

    const { getDateCategory, formatDateSeparator } = await import(modulePath);
    expect(getDateCategory("2024-05-08T00:00:00Z")).toBe("today");
    expect(getDateCategory("2024-05-07T00:00:00Z")).toBe("yesterday");
    const category = getDateCategory("2024-05-01T00:00:00Z");
    expect(category).toBe("May 1");
    expect(getDateCategory("invalid")).toBe("unknown");

    expect(formatDateSeparator("today")).toBe("today");
    expect(formatDateSeparator("yesterday")).toBe("yesterday");
    expect(formatDateSeparator("unknown")).toBe("unknown date");
    expect(formatDateSeparator("May 1")).toBe("May 1");

    vi.useRealTimers();
  });

  it("groups items by date including separators", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-05-08T12:00:00Z"));

    const { groupItemsByDateWithSeparators } = await import(modulePath);
    const items = [
      { title: "First", pubDate: "2024-05-08T00:00:00Z", source: null, id: null, link: null, description: null, rssName: null, rssImage: null, guid: null },
      { title: "Second", pubDate: "2024-05-07T00:00:00Z", source: null, id: null, link: null, description: null, rssName: null, rssImage: null, guid: null },
      { title: "Third", pubDate: "2024-05-01T00:00:00Z", source: null, id: null, link: null, description: null, rssName: null, rssImage: null, guid: null },
    ];

    const grouped = groupItemsByDateWithSeparators(items);
    expect(grouped.map((entry) => entry.type)).toEqual(["item", "separator", "item", "separator", "item"]);
    expect(grouped[1].category).toBe("yesterday");

    vi.useRealTimers();
  });

  it("calculates text color for a background", async () => {
    const { generateTextColorForBackground } = await import(modulePath);
    expect(generateTextColorForBackground("#ffffff")).toBe("#000000");
    expect(generateTextColorForBackground("#000000")).toBe("#ffffff");
  });

  it("formats older date times", async () => {
    const { formatOlderDateTime } = await import(modulePath);
    expect(formatOlderDateTime("2024-05-08T09:05:00Z")).toBe("08/05/24 - 09:05");
    expect(formatOlderDateTime("invalid")).toBe("Unknown");
  });
});
