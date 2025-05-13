import { Bookmark, BookmarkCheck } from "lucide-react";

import { Navigations } from "../types/navigation";
import { useNavigation } from "../hooks/navigation";

export const BookmarkedsButton = () => {
  const { navigation, setNavigation } = useNavigation();

  if (navigation === Navigations.BOOKMARKEDS) {
    return (
      <button
        className="cursor-pointer"
        onClick={() => {
          setNavigation(Navigations.HOME);
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
      }}
      className="cursor-pointer"
    >
      <Bookmark className="text-gray-800 dark:text-gray-400" />
    </button>
  );
};
