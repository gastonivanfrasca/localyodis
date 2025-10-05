import { describe, it, expect } from "vitest";
import type { LanguageOption } from "../../types/i18n";
import { en } from "../../i18n/translations/en";

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
    expect(SUPPORTED_LANGUAGES.map((lang: LanguageOption) => lang.code)).toContain("en");
  });

  it("returns translations and language options", async () => {
    const { getTranslation, getLanguageOption } = await import(modulePath);
    expect(getTranslation("en", "home")).toBe("Home");
    expect(getTranslation("en", "home", "Fallback")).toBe("Home");
    expect(getTranslation("unknown" as never, "home")).toBe("Home");
    expect(getLanguageOption("en")).toEqual(expect.objectContaining({ code: "en" }));
  });

  it("uses fallback when translation is not available", async () => {
    const { getTranslation } = await import(modulePath);
    expect(
      getTranslation("en", "nonexistent.key" as keyof typeof en, "Fallback")
    ).toBe("Fallback");
  });
});
