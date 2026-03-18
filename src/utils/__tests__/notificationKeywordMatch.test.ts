import { describe, expect, it } from "vitest";

import { matchesNotificationKeyword, matchesNotificationKeywordFilters, sanitizeNotificationSearchableText } from "../notificationKeywordMatch";

describe("notificationKeywordMatch", () => {
  it("matches complete words ignoring case and accents", () => {
    expect(matchesNotificationKeyword("Irán acelera el conflicto", "iran")).toBe(true);
    expect(matchesNotificationKeyword("Claude Code llega a producción", "claude code")).toBe(true);
    expect(matchesNotificationKeyword("Trump analiza nuevas medidas", "TRUMP")).toBe(true);
  });

  it("does not match partial substrings inside larger words", () => {
    expect(matchesNotificationKeyword("riesgo país en baja", "AI")).toBe(false);
    expect(matchesNotificationKeyword("OpenAI presenta un modelo nuevo", "AI")).toBe(false);
  });

  it("matches when any configured keyword matches", () => {
    expect(matchesNotificationKeywordFilters(
      "Israel refuerza su ofensiva tras nuevas amenazas",
      ["iran", "AI", "israel"],
    )).toBe(true);
  });

  it("allows all notifications when no keyword filters are configured", () => {
    expect(matchesNotificationKeywordFilters("Cualquier titular", [])).toBe(true);
    expect(matchesNotificationKeywordFilters("Cualquier titular", null)).toBe(true);
  });

  it("ignores keywords that only appear inside HTML links", () => {
    const searchableText = sanitizeNotificationSearchableText(
      [
        "Australia to release nearly 20% of fuel stockpile",
        "&lt;p&gt;Energy minister cuts fuel companies minimum stock obligations&lt;/p&gt;",
        "&lt;a href=\"https://www.theguardian.com/australia-news/live/2026/mar/13/iran-war-politics-market-reactions\"&gt;Follow our Australia news live blog&lt;/a&gt;",
      ].join(" "),
    );

    expect(matchesNotificationKeywordFilters(searchableText, ["Irán", "War"])).toBe(false);
  });

  it("keeps visible text from HTML descriptions for matching", () => {
    const searchableText = sanitizeNotificationSearchableText(
      "&lt;p&gt;Donald Trump said the policy would continue.&lt;/p&gt;",
    );

    expect(matchesNotificationKeywordFilters(searchableText, ["Trump"])).toBe(true);
  });
});
