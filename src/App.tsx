import "./App.css";

import { PubListEmpty, PubsList } from "./components/PubList";
import { useEffect, useState } from "react";

import { BottomNavBar } from "./components/BottomNavBar";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { RSSItem } from "./types/rss";
import { fetchRSS } from "./utils/rss";
import { getLocallyStoredData } from "./utils/storage";

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

  return (
    <div className="w-full h-screen dark:bg-neutral-800 max-h-screen">
      <div className="p-8 pb-24 flex flex-col gap-8 max-h-full overflow-scroll items-center">
        {loading && <LoadingSpinner />}
        {rssItems?.length < 1 && !loading && <PubListEmpty />}
        {rssItems?.length > 1 && <PubsList rssItems={rssItems} />}
      </div>
      <BottomNavBar menu home />
    </div>
  );
}

export default App;
