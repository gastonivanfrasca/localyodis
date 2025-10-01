import { describe, it, expect } from "vitest";
import type { Source } from "../../types/storage";

const modulePath = "../validations";

describe("validation utilities", () => {
  it("checks if a source exists", async () => {
    const { checkIfSourceExists } = await import(modulePath);
    const sources: Source[] = [
      { id: "1", name: "Source", url: "https://example.com", addedOn: "2024-01-01", color: "#000", textColor: "#fff", initial: "S", type: "rss" },
    ];
    expect(checkIfSourceExists(sources, "https://example.com")).toBe(true);
    expect(checkIfSourceExists(sources, "https://other.com")).toBe(false);
  });

  it("validates http urls", async () => {
    const { isValidHttpUrl } = await import(modulePath);
    expect(isValidHttpUrl("https://example.com")).toBe(true);
    expect(isValidHttpUrl("http://example.com")).toBe(true);
    expect(isValidHttpUrl("ftp://example.com")).toBe(false);
    expect(isValidHttpUrl("not-a-url")).toBe(false);
  });
});
