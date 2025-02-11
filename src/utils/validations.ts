import type { Source } from "../types/storage";

export const checkIfSourceExists = (
  sources: Source[],
  url: string
): boolean => {
  return sources.some((source) => source.url === url);
};
