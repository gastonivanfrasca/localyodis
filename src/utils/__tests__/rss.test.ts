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
});
