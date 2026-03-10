import { describe, expect, it } from "vitest";

import { formatKeywordFilters, keywordFiltersEqual, parseKeywordFilters } from "../pushKeywords";

describe("pushKeywords", () => {
  it("parses comma and newline separated keywords", () => {
    expect(parseKeywordFilters("ai, openai\nEconomia")).toEqual([
      "ai",
      "openai",
      "Economia",
    ]);
  });

  it("deduplicates keywords ignoring accents and case", () => {
    expect(parseKeywordFilters("Economia, economía, ECONOMIA")).toEqual([
      "Economia",
    ]);
  });

  it("formats and compares keyword filters", () => {
    expect(formatKeywordFilters(["ai", "openai"])).toBe("ai, openai");
    expect(keywordFiltersEqual(["ai"], ["ai"])).toBe(true);
    expect(keywordFiltersEqual(["ai"], ["openai"])).toBe(false);
  });
});
