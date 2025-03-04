import "./App.css";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { BookmarksEmpty, PubListEmpty, PubsList } from "./components/PubList";
import { getLocallyStoredData, storeDataLocally } from "./utils/storage";
import { useEffect, useState } from "react";

import { BottomNavBar } from "./components/BottomNavBar";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { LocallyStoredData } from "./utils/storage";
import { RSSItem } from "./types/rss";
import { fetchRSS } from "./utils/rss";

function App() {
  const localData = getLocallyStoredData();

  const [loading, setLoading] = useState(true);
  const [rssItems, setRssItems] = useState<RSSItem[]>([]);
  const [bookmarks, setBookmarks] = useState(localData.bookmarks);
  const [bookmarkeds, setBoookmarkeds] = useState(localData.showBookmarkeds);

  const RenderedList = () => {
    if (loading) return <LoadingSpinner />;
    if (rssItems?.length >= 1) {
      return (
        <PubsList
          rssItems={rssItems}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          localData={localData}
        />
      );
    }
    if (bookmarkeds) return <BookmarksEmpty />;
    return <PubListEmpty />;
  };

  useEffect(() => {
    if (bookmarkeds) {
      setRssItems([...(bookmarks as RSSItem[])]);
      setLoading(false);
      return;
    }

    const fetchRSSItems = async () => {
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
  }, [bookmarkeds, bookmarks]);

  return (
    <div className="w-full h-screen dark:bg-neutral-800 max-h-screen">
      <div className="p-8 pb-24 flex flex-col gap-8 max-h-full overflow-scroll items-center">
        <RenderedList />
      </div>
      <BottomNavBar
        home="scroll"
        menu
        customButtons={
          <BookmarkedsButton
            localData={localData}
            bookmarkeds={bookmarkeds}
            setBoookmarkeds={setBoookmarkeds}
            setLoading={setLoading}
          />
        }
      />
    </div>
  );
}

type BookmarkedsButtonProps = {
  bookmarkeds: boolean;
  setBoookmarkeds: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  localData: LocallyStoredData;
};

export const BookmarkedsButton = (props: BookmarkedsButtonProps) => {
  const { bookmarkeds, setBoookmarkeds, localData, setLoading } = props;
  return (
    <button
      onClick={() => {
        setBoookmarkeds(!bookmarkeds);
        storeDataLocally({ ...localData, showBookmarkeds: !bookmarkeds });
        setLoading(true);
      }}
      className="cursor-pointer"
    >
      {bookmarkeds ? (
        <BookmarkCheck style={{ color: "#1e7bc0" }} />
      ) : (
        <Bookmark className="text-gray-800 dark:text-gray-400" />
      )}
    </button>
  );
};

export default App;
