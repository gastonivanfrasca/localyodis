import type { Source } from "../types/storage";

export const checkIfSourceExists = (
  sources: Source[],
  url: string
): boolean => {
  return sources.some((source) => source.url === url);
};

export const isValidHttpUrl = (string: string) => {
  let url;
  
  try {
    url = new URL(string);
  } catch {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
