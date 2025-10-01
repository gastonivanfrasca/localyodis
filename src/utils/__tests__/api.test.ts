import { describe, it, expect, vi, beforeEach } from "vitest";

const modulePath = "../api";

describe("getApiUrl", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.stubEnv("VITE_SERVER_BASEPATH", "https://example.com");
  });

  it("prepends a slash when missing", async () => {
    const { getApiUrl } = await import(modulePath);
    expect(getApiUrl("endpoint")).toBe("https://example.com/endpoint");
  });

  it("does not duplicate slashes when path already starts with one", async () => {
    const { getApiUrl } = await import(modulePath);
    expect(getApiUrl("/endpoint")).toBe("https://example.com/endpoint");
  });
});
