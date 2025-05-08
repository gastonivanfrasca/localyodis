import { Navigations } from "./navigation";
import { RSSItem } from "./rss"; // Import RSSItem

export type Source = {
  name: string | null | undefined;
  url: string;
  addedOn: string;
  id: string;
  color: string;
  textColor: string;
  initial: string;
  type: string;
};

// Make Bookmark compatible with RSSItem by adding missing optional fields
export type Bookmark = Pick<RSSItem, 'title' | 'link' | 'source' | 'pubDate' | 'id' | 'description' | 'guid' | 'rssName' | 'rssImage'>;

export type LocallyStoredData = {
  theme: string;
  sources: Source[];
  bookmarks: Bookmark[]; // Now uses the updated Bookmark type
  navigation: Navigations;
  activeSources?: string[]; // Add activeSources as optional
};
