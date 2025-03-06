export type RSSItem = {
  title: string | null | undefined;
  link: string | null | undefined | YTLink | string[];
  description: string | null | undefined;
  rssName: string | null | undefined;
  rssImage: string | null | undefined;
  guid: string[] | null | undefined;
  pubDate: string | null | undefined;
  source: string | null | undefined;
};

type YTLink = Array<{
  $?: {
    href: string;
  };
  [key: string]: string | number | boolean | object | null | undefined;
}>;
