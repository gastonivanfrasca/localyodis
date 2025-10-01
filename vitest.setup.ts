import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

if (typeof globalThis.alert !== "function") {
  // eslint-disable-next-line no-global-assign
  globalThis.alert = () => undefined;
}
