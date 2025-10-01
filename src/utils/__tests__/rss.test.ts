import type { RSSItem } from "../../types/rss";
import { describe, it, expect, vi, beforeEach } from "vitest";

const modulePath = "../rss";

describe("rss utilities", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.stubEnv("VITE_SERVER_BASEPATH", "https://api.example.com");
  });

  it("fetches rss feeds for multiple sources", async () => {
    const mockResponse = { feeds: [] };
    const fetchMock = vi.fn().mockResolvedValue({ json: () => Promise.resolve(mockResponse) });
    globalThis.fetch = fetchMock;

    const { fetchRSS } = await import(modulePath);
    const result = await fetchRSS([{ id: "1", url: "https://example.com" }]);

    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/rss/fetch-feeds", expect.objectContaining({ method: "POST" }));
    expect(result).toEqual(mockResponse);
  });

  it("fetches a single rss feed", async () => {
    const mockResponse = { feed: {} };
    const fetchMock = vi.fn().mockResolvedValue({ json: () => Promise.resolve(mockResponse) });
    globalThis.fetch = fetchMock;

    const { fetchSingleRSS } = await import(modulePath);
    const result = await fetchSingleRSS("1", true);

    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/rss", expect.objectContaining({ method: "POST" }));
    expect(result).toEqual(mockResponse);
  });

  it("extracts string properties from rss items", async () => {
    const { getRSSItemStrProp } = await import(modulePath);
    expect(getRSSItemStrProp({ title: "Hello" } as never, "title")).toBe("Hello");
    expect(getRSSItemStrProp({ title: ["World"] } as never, "title")).toBe("World");
    expect(getRSSItemStrProp({ title: undefined } as never, "title")).toBe("");
  });

  it("gets rss item links from different formats", async () => {
    const { getRSSItemLink } = await import(modulePath);

    expect(getRSSItemLink({ link: "https://example.com" } as never)).toBe("https://example.com");
    expect(getRSSItemLink({ link: ["https://array-link.com"] } as never)).toBe("https://array-link.com");
    expect(getRSSItemLink({ link: [{ $: { href: "https://object-link.com" } }] } as never)).toBe("https://object-link.com");
    expect(getRSSItemLink({ id: "fallback-id", link: undefined } as never)).toBe("fallback-id");
  });

  it("calculates new items count based on identifiers", async () => {
    const { calculateNewItemsCount } = await import(modulePath);

    const previous: RSSItem[] = [
      { link: "https://example.com/a", title: "A" } as RSSItem,
      { id: "persist-id", title: "B" } as RSSItem,
    ];

    const next: RSSItem[] = [
      { link: "https://example.com/a", title: "Updated A" } as RSSItem,
      { link: [{ $: { href: "https://example.com/b" } }] as never, title: "B" } as RSSItem,
      { id: "persist-id", title: "Still B" } as RSSItem,
    ];

    expect(calculateNewItemsCount(previous, next)).toBe(1);
    expect(calculateNewItemsCount([], next)).toBe(0);
  });
});
