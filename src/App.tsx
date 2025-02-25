import "./App.css";

import { useEffect, useState } from "react";

import { BottomNavBar } from "./components/BottomNavBar";
import { fetchRSS } from "./utils/rss";
import { getLocallyStoredData } from "./utils/storage";

type RSSItem = {
  title: string | null | undefined;
  link: string | null | undefined;
  description: string | null | undefined;
  rssName: string | null | undefined;
  rssImage: string | null | undefined;
  guid: string | null | undefined;
  pubDate: string | null | undefined;
  source: string | null | undefined;
};

function App() {
  const [rssItems, setRssItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRSSItems = async () => {
      const localData = getLocallyStoredData();
      if (localData.sources.length < 1) return;
      const sourcesURL = localData.sources.map((source) => {
        return {
          id: source.id,
          url: source.url,
        };
      });
      try {
        const rssItems = await fetchRSS(sourcesURL);
        setRssItems(rssItems);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRSSItems()
      .then(() => setLoading(false))
      .catch(console.error);
  }, []);

/*   const getImageBySourceID = (sourceID: string) => {
    const source = getLocallyStoredData().sources.find(
      (source) => source.id === sourceID
    );
    return source?.image || rssPlaceholder;
  }; */

  if (loading) {
    return (
      <div className="w-full h-screen dark:bg-neutral-800 flex justify-center items-center">
        <p className="text-lg dark:text-gray-200">Loading...</p>
      </div>
    );
  }

  if (rssItems.length < 1) {
    return (
      <div className="w-full h-screen dark:bg-neutral-800 flex justify-center items-center">
        <p className="text-lg dark:text-gray-200">No RSS items to display</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen dark:bg-neutral-800 max-h-screen">
      <div className="p-8 flex flex-col gap-8 max-h-full overflow-scroll items-center">
        {rssItems.map((item) => (
          <button
            className="flex flex-row w-full gap-1 md:w-[500px] rounded-sm border-b-2 border-neutral-500 dark:border-neutral-500 text-left cursor-pointer"
            key={item.guid}
            onClick={() => window.open(item.link || "", "_blank")}
          >
            <div className="flex flex-col gap-2 rounded-sm dark:text-gray-200  grow break-words max-w-full items-start pb-4">
              <div className="flex flex-row gap-2 items-start">
                {/*
                <div className="flex items-center rounded-full pt-1 max-w-[20px]">
                  <img
                    src={getImageBySourceID(item.source || "")}
                    alt={item.rssName || ""}
                    className="rounded-full w-[200px] h-[20px]"
                  />
                </div> */}
                <p className="font-semibold text-lg">{item.title}</p>
              </div>
              <div className="flex flex-row gap-2 w-full justify-end items-end mt-2">
                <p className="text-xs overflow-ellipsis whitespace-nowrap">
                  {getSourceName(item.source)} |{" "}
                </p>
                {item.pubDate && (
                  <p className="text-xs self-end text-right whitespace-nowrap">
                    {formatPubDate(item.pubDate)}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      <BottomNavBar menu home />
    </div>
  );
}

const formatPubDate = (pubDate: string) => {
  const publicationDate = new Date(pubDate);
  const date = publicationDate.toLocaleDateString(undefined, {
    dateStyle: "short",
  });
  const time = publicationDate.toLocaleTimeString(undefined, {
    timeStyle: "short",
  });
  return `${date} - ${time}`;
};

const getSourceName = (sourceID: string | null | undefined) => {
  if (!sourceID) return "Unknown";
  const source = getLocallyStoredData().sources.find(
    (source) => source.id === sourceID
  );
  return source?.name || "Unknown";
};

export default App;
