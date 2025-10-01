import { describe, it, expect, vi } from "vitest";

const modulePath = "../format-i18n";

describe("internationalized formatting", () => {
  it("formats publication dates using translations", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-05-08T12:00:00Z"));

    const { formatPubDateI18n } = await import(modulePath);
    expect(formatPubDateI18n("2024-05-08T08:00:00Z", "en")).toBe("Today");
    expect(formatPubDateI18n("2024-05-07T08:00:00Z", "en")).toBe("Yesterday");
    expect(formatPubDateI18n("2024-05-06T12:00:00Z", "en")).toBe("2 days ago");
    expect(formatPubDateI18n("invalid", "en")).toBe("Unknown");

    vi.useRealTimers();
  });

  it("formats time with translations", async () => {
    const { formatTimeI18n } = await import(modulePath);
    const spy = vi.spyOn(Date.prototype, "toLocaleTimeString").mockReturnValue("8:00 AM");
    expect(formatTimeI18n("invalid", "en")).toBe("Unknown");
    expect(formatTimeI18n("2024-05-08T08:00:00Z", "en")).toBe("8:00 AM");
    spy.mockRestore();
  });

  it("determines categories and separators with translations", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-05-08T12:00:00Z"));

    const { getDateCategoryI18n, formatDateSeparatorI18n } = await import(modulePath);
    expect(getDateCategoryI18n("2024-05-08T00:00:00Z")).toBe("today");
    expect(getDateCategoryI18n("2024-05-07T00:00:00Z")).toBe("yesterday");
    expect(getDateCategoryI18n("invalid")).toBe("unknown");

    expect(formatDateSeparatorI18n("today", "en")).toBe("today");
    expect(formatDateSeparatorI18n("yesterday", "en")).toBe("yesterday");
    expect(formatDateSeparatorI18n("unknown", "en")).toBe("unknown date");
    expect(formatDateSeparatorI18n("May 1", "en")).toBe("May 1");

    vi.useRealTimers();
  });
});
