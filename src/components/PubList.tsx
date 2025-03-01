import { RSSItem } from "../types/rss";
import { RoundedIdentifier } from "./RoundedIdentifier";
import { formatPubDate } from "../utils/format";
import { getSourceByID } from "../utils/storage";

type PubsListProps = {
  rssItems: RSSItem[];
};

export const PubsList = (props: PubsListProps) => {
  const { rssItems } = props;
  return (
    <div className="p-8 flex flex-col gap-8 max-h-full overflow-scroll items-center">
      {rssItems.map((item) => {
        const sourceData = getSourceByID(item.source);
        if (!sourceData) return null;
        return (
          <button
            className="flex flex-row w-full gap-1 md:w-[800px] rounded-sm border-b-2 border-neutral-200 dark:border-neutral-600 text-left cursor-pointer"
            key={item.guid}
            onClick={() => window.open(item.link || "", "_blank")}
          >
            <div className="flex flex-col gap-2 rounded-sm dark:text-gray-200  grow break-words max-w-full items-start pb-4">
              <div className="flex flex-row gap-2 items-start">
                <p className="font-semibold text-lg">{item.title}</p>
              </div>
              <div className="flex flex-row gap-2 w-full justify-end items-end mt-2">
                <RoundedIdentifier
                  color={sourceData.color}
                  textColor={sourceData.textColor}
                  initial={sourceData.initial}
                />
                <p className="text-xs overflow-ellipsis whitespace-nowrap">
                  {sourceData.name}
                </p>
                {item.pubDate && (
                  <p className="text-xs self-end text-right whitespace-nowrap">
                    {formatPubDate(item.pubDate)}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export const PubListEmpty = () => {
  return (
    <div className="p-8 flex flex-col gap-8 max-h-full overflow-scroll items-center">
      <p className="text-lg dark:text-gray-200">
        No rss sources added. Go to settings to add sources.
      </p>
    </div>
  );
};
