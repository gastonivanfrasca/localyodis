export type Source = {
  name: string | null | undefined;
  url: string;
  addedOn: string;
  id: string;
  color: string;
  textColor: string;
  initial: string;
};

export type Bookmark = {
  title: string | null | undefined;
  link: string | null | undefined;
  source: string | null | undefined;
  pubDate: string | null | undefined;
};