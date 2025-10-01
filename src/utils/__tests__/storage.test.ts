import { describe, it, expect, beforeEach, vi } from "vitest";
import type { LocallyStoredData, HistoryItem } from "../../types/storage";
import type { RSSItem } from "../../types/rss";

vi.mock("../i18n", () => ({
  getBrowserLanguage: () => "en" as const,
}));

const modulePath = "../storage";

const createState = (overrides: Partial<LocallyStoredData> = {}): LocallyStoredData => ({
  theme: "dark",
  language: "en",
  sources: [],
  bookmarks: [],
  navigation: null,
  items: [],
  activeSources: [],
  scrollPosition: 0,
  loading: false,
  lastUpdated: "2024-01-01T00:00:00.000Z",
  searchQuery: null,
  activeItems: [],
  error: null,
  hiddenItems: [],
  history: [],
  ...overrides,
});

describe("storage utilities", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("stores data locally applying cleanup rules", async () => {
    const { storeDataLocally } = await import(modulePath);
    const items: RSSItem[] = [
      { title: "older", pubDate: "2024-01-01T00:00:00Z", source: "1", id: "1", link: "#", description: null, rssName: null, rssImage: null, guid: null },
      { title: "newer", pubDate: "2024-02-01T00:00:00Z", source: "1", id: "2", link: "#", description: null, rssName: null, rssImage: null, guid: null },
    ];

    const state = createState({ items, activeItems: items });

    storeDataLocally(state);

    const stored = JSON.parse(localStorage.getItem("localyodis")!);
    expect(stored.items.map((item: RSSItem) => item.title)).toEqual(["newer", "older"]);
    expect(stored.activeItems.map((item: RSSItem) => item.title)).toEqual(["newer", "older"]);
  });

  it("limits total items when exceeding maximum", async () => {
    const { cleanupStorageData, STORAGE_CONFIG } = await import(modulePath);
    const items: RSSItem[] = Array.from({ length: STORAGE_CONFIG.MAX_TOTAL_ITEMS + 5 }).map((_, index) => ({
      title: `item-${index}`,
      pubDate: new Date(2024, 0, index + 1).toISOString(),
      source: "1",
      id: `${index}`,
      link: "#",
      description: null,
      rssName: null,
      rssImage: null,
      guid: null,
    }));

    const cleaned = cleanupStorageData(createState({ items, activeItems: items }));
    expect(cleaned.items).toHaveLength(STORAGE_CONFIG.MAX_TOTAL_ITEMS);
    expect(cleaned.activeItems).toHaveLength(STORAGE_CONFIG.MAX_TOTAL_ITEMS);
  });

  it("returns default data when nothing stored", async () => {
    const { getLocallyStoredData } = await import(modulePath);
    const data = getLocallyStoredData();
    expect(data.theme).toBe("dark");
    expect(data.history).toEqual([]);
    expect(data.language).toBe("en");
  });

  it("removes a source from locally stored data", async () => {
    const { removeSourceFromLocalData, getLocallyStoredData } = await import(modulePath);
    const initial = createState({
      sources: [
        { id: "1", name: "A", url: "https://a.com", addedOn: "2024-01-01", color: "#000", textColor: "#fff", initial: "A", type: "rss" },
        { id: "2", name: "B", url: "https://b.com", addedOn: "2024-01-01", color: "#000", textColor: "#fff", initial: "B", type: "rss" },
      ],
      activeSources: ["1", "2"],
    });
    localStorage.setItem("localyodis", JSON.stringify(initial));

    removeSourceFromLocalData("1");
    const stored = getLocallyStoredData();
    expect(stored.sources).toHaveLength(1);
    expect(stored.sources[0].id).toBe("2");
  });

  it("retrieves source by id", async () => {
    const { getSourceByID } = await import(modulePath);
    const initial = createState({
      sources: [
        { id: "1", name: "A", url: "https://a.com", addedOn: "2024-01-01", color: "#000", textColor: "#fff", initial: "A", type: "rss" },
      ],
    });
    localStorage.setItem("localyodis", JSON.stringify(initial));

    const source = getSourceByID("1");
    expect(source?.name).toBe("A");
    expect(getSourceByID("missing")).toBeUndefined();
  });

  it("provides storage information", async () => {
    const { getStorageInfo } = await import(modulePath);
    const initial = createState({
      sources: [
        { id: "1", name: "A", url: "https://a.com", addedOn: "2024-01-01", color: "#000", textColor: "#fff", initial: "A", type: "rss" },
      ],
      bookmarks: [
        { title: "Bookmark", link: "#", source: "1", pubDate: "2024-01-01T00:00:00Z" },
      ],
      items: [
        { title: "Item", pubDate: "2024-01-01T00:00:00Z", source: "1", id: "1", link: "#", description: null, rssName: null, rssImage: null, guid: null },
      ],
      activeItems: [
        { title: "Item", pubDate: "2024-01-01T00:00:00Z", source: "1", id: "1", link: "#", description: null, rssName: null, rssImage: null, guid: null },
      ],
    });
    localStorage.setItem("localyodis", JSON.stringify(initial));

    const info = getStorageInfo();
    expect(info?.totalItems).toBe(1);
    expect(info?.totalBookmarks).toBe(1);
    expect(info?.totalSources).toBe(1);
    expect(info?.withinLimits.totalItems).toBe(true);
  });

  it("extracts item titles from multiple formats", async () => {
    const { extractItemTitle } = await import(modulePath);
    expect(extractItemTitle({ title: "Simple", id: null, link: null, description: null, rssName: null, rssImage: null, guid: null, pubDate: null, source: null })).toBe("Simple");
    expect(extractItemTitle({ title: ["Array"], id: null, link: null, description: null, rssName: null, rssImage: null, guid: null, pubDate: null, source: null })).toBe("Array");
    expect(extractItemTitle({ title: { _: "Object" } as never, id: null, link: null, description: null, rssName: null, rssImage: null, guid: null, pubDate: null, source: null })).toBe("Object");
  });

  it("hides and unhides items", async () => {
    const { hideItem, unhideItem, getLocallyStoredData } = await import(modulePath);
    hideItem("hidden-title");
    let stored = getLocallyStoredData();
    expect(stored.hiddenItems).toContain("hidden-title");

    unhideItem("hidden-title");
    stored = getLocallyStoredData();
    expect(stored.hiddenItems).not.toContain("hidden-title");
  });

  it("cleans up hidden items not present in current feed", async () => {
    const { cleanupHiddenItems, getLocallyStoredData } = await import(modulePath);
    const initial = createState({ hiddenItems: ["keep", "remove"] });
    localStorage.setItem("localyodis", JSON.stringify(initial));

    const currentItems: RSSItem[] = [
      { title: "keep", pubDate: "2024-01-01T00:00:00Z", source: "1", id: "1", link: "#", description: null, rssName: null, rssImage: null, guid: null },
    ];

    cleanupHiddenItems(currentItems);
    const stored = getLocallyStoredData();
    expect(stored.hiddenItems).toEqual(["keep"]);
  });

  it("filters hidden items from a feed", async () => {
    const { filterHiddenItems } = await import(modulePath);
    const items: RSSItem[] = [
      { title: "keep", pubDate: null, source: null, id: null, link: null, description: null, rssName: null, rssImage: null, guid: null },
      { title: "remove", pubDate: null, source: null, id: null, link: null, description: null, rssName: null, rssImage: null, guid: null },
    ];
    const filtered = filterHiddenItems(items, ["remove"]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("keep");
  });

  it("adds entries to history avoiding duplicates", async () => {
    const { addToHistory, getLocallyStoredData } = await import(modulePath);
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-03-01T00:00:00Z"));

    const entry: HistoryItem = { title: "Test", link: "https://a.com", source: "1", visitedAt: "2024-03-01T00:00:00Z" };
    addToHistory(entry);

    vi.setSystemTime(new Date("2024-03-02T00:00:00Z"));
    addToHistory({ ...entry, visitedAt: "2024-03-02T00:00:00Z" });

    const stored = getLocallyStoredData();
    expect(stored.history).toHaveLength(1);
    expect(stored.history[0].visitedAt).toBe("2024-03-02T00:00:00.000Z");

    vi.useRealTimers();
  });

  it("keeps only the latest 100 history items", async () => {
    const { addToHistory, getLocallyStoredData } = await import(modulePath);
    vi.useFakeTimers();

    for (let i = 0; i < 105; i++) {
      vi.setSystemTime(new Date(2024, 0, i + 1));
      addToHistory({ title: `Item ${i}`, link: `https://a.com/${i}`, source: "1", visitedAt: new Date(2024, 0, i + 1).toISOString() });
    }

    const stored = getLocallyStoredData();
    expect(stored.history).toHaveLength(100);
    expect(stored.history[0].title).toBe("Item 104");

    vi.useRealTimers();
  });

  it("clears and removes history entries", async () => {
    const { clearHistory, removeFromHistory, getLocallyStoredData, addToHistory } = await import(modulePath);
    const entries: HistoryItem[] = [
      { title: "A", link: "https://a.com", source: "1", visitedAt: "2024-01-01T00:00:00Z" },
      { title: "B", link: "https://b.com", source: "1", visitedAt: "2024-01-02T00:00:00Z" },
    ];

    entries.forEach(addToHistory);
    removeFromHistory("https://a.com");
    let stored = getLocallyStoredData();
    expect(stored.history).toHaveLength(1);

    clearHistory();
    stored = getLocallyStoredData();
    expect(stored.history).toEqual([]);
  });
});
