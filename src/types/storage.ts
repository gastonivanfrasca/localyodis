import { Navigations } from "./navigation";
import { RSSItem } from "./rss";

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

export type Items = {
  title: string | null | undefined;
  link: string | null | undefined;
  source: string | null | undefined;
  pubDate: string | null | undefined;
};

export type ErrorState = {
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
} | null;

export type LocallyStoredData = {
  theme: string;
  sources: Source[];
  bookmarks: Items[];
  navigation: Navigations;
  items: RSSItem[];
  activeSources: string[];
  scrollPosition: number;
  loading: boolean;
  lastUpdated: string;
  searchQuery: string | null;
  activeItems: RSSItem[];
  error: ErrorState;
};
