import { afterEach, vi } from "vitest";

// Ensure deterministic date/time behavior across environments
// Some CI/dev machines run in non-UTC timezones which break date-based tests
// Setting TZ here keeps tests consistent with expectations
process.env.TZ = 'UTC';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

if (typeof globalThis.alert !== "function") {
  // eslint-disable-next-line no-global-assign
  globalThis.alert = () => undefined;
}
