import { describe, it, expect } from "vitest";

const modulePath = "../../i18n";

describe("i18n utilities", () => {
  it("returns a supported browser language or default", async () => {
    const { getBrowserLanguage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } = await import(modulePath);
    const originalLanguage = navigator.language;
    Object.defineProperty(navigator, "language", { value: "es-AR", configurable: true });
    expect(getBrowserLanguage()).toBe("es");

    Object.defineProperty(navigator, "language", { value: "de-DE", configurable: true });
    expect(getBrowserLanguage()).toBe(DEFAULT_LANGUAGE);

    Object.defineProperty(navigator, "language", { value: originalLanguage, configurable: true });
    expect(SUPPORTED_LANGUAGES.map((lang) => lang.code)).toContain("en");
  });

  it("returns translations and language options", async () => {
    const { getTranslation, getLanguageOption } = await import(modulePath);
    expect(getTranslation("en", "home")).toBe("Home");
    expect(getTranslation("unknown" as never, "home")).toBe("Home");
    expect(getLanguageOption("en")).toEqual(expect.objectContaining({ code: "en" }));
  });
});
