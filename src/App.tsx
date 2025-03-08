import "./App.css";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { getLocallyStoredData, storeDataLocally } from "./utils/storage";

import { BottomNavBar } from "./components/BottomNavBar";
import { PubsList } from "./components/PubList";
import { useState } from "react";

function App() {
  const localData = getLocallyStoredData();
  const [bookmarkeds, setBoookmarkeds] = useState(localData.showBookmarkeds);

  return (
    <div className="w-full h-screen dark:bg-neutral-800 max-h-screen">
      <div className="p-8 pb-24 flex flex-col gap-8 max-h-full overflow-scroll items-center">
        <PubsList bookmarkeds={bookmarkeds} />
      </div>
      <BottomNavBar
        home="scroll"
        menu
        customButtons={
          <BookmarkedsButton
            bookmarkeds={bookmarkeds}
            setBoookmarkeds={setBoookmarkeds}
          />
        }
      />
    </div>
  );
}

type BookmarkedsButtonProps = {
  bookmarkeds: boolean;
  setBoookmarkeds: (value: boolean) => void;
};

export const BookmarkedsButton = (props: BookmarkedsButtonProps) => {
  const { bookmarkeds, setBoookmarkeds } = props;
  const localData = getLocallyStoredData();
  return (
    <button
      onClick={() => {
        setBoookmarkeds(!bookmarkeds);
        storeDataLocally({ ...localData, showBookmarkeds: !bookmarkeds });
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
