export type Source = {
  name: string | null | undefined;
  url: string;
  addedOn: string;
  id: string;
  image: string | null | undefined;
  description: string | null | undefined;
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