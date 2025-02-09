import type { Source } from "../types/storage";

export const checkIfSourceExists = (
  sources: Source[],
  name: string,
  url: string
): boolean => {
  sources.forEach((source) => {
    if (source.name === name || source.url === url) {
      return true;
    }
  });
  return false;
};
