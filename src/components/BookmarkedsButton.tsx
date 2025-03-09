import { Bookmark, BookmarkCheck } from "lucide-react";
import { getLocallyStoredData, storeDataLocally } from "../utils/storage";

import { Navigations } from "../types/navigation";

type BookmarkedsButtonProps = {
  navigation: Navigations;
  setNavigation: (value: Navigations) => void;
};

export const BookmarkedsButton = (props: BookmarkedsButtonProps) => {
  const { navigation, setNavigation } = props;
  const localData = getLocallyStoredData();

  if (navigation === Navigations.BOOKMARKEDS) {
    return (
      <button
        className="cursor-pointer"
        onClick={() => {
          setNavigation(Navigations.HOME);
          storeDataLocally({ ...localData, navigation: Navigations.HOME });
        }}
      >
        <BookmarkCheck style={{ color: "#1e7bc0" }} />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        setNavigation(Navigations.BOOKMARKEDS);
        storeDataLocally({ ...localData, navigation: Navigations.BOOKMARKEDS });
      }}
      className="cursor-pointer"
    >
      <Bookmark className="text-gray-800 dark:text-gray-400" />
    </button>
  );
};
