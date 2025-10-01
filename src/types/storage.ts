import { Navigations } from "./navigation";
import { RSSItem } from "./rss";
import { SupportedLanguage } from "./i18n";

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

export type HistoryItem = {
  title: string;
  link: string;
  source: string;
  visitedAt: string;
  sourceName?: string;
};

export type ErrorState = {
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
} | null;

export type LocallyStoredData = {
  theme: string;
  language: SupportedLanguage;
  sources: Source[];
  bookmarks: Items[];
  navigation: Navigations | null;
  items: RSSItem[];
  activeSources: string[];
  scrollPosition: number;
  loading: boolean;
  lastUpdated: string;
  searchQuery: string | null;
  activeItems: RSSItem[];
  error: ErrorState;
  hiddenItems: string[]; // Array of hidden item IDs
  history: HistoryItem[]; // Array of visited links
  newItemsCount: number;
};
