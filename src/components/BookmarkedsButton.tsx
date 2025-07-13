import { Bookmark, BookmarkCheck } from "lucide-react";

import { ActionTypes } from "../context/main";
import { Navigations } from "../types/navigation";
import { useMainContext } from "../context/main";

export const BookmarkedsButton = () => {
  const { state, dispatch } = useMainContext();
  const navigation = state.navigation;

  if (navigation === Navigations.BOOKMARKEDS) {
    return (
      <button
        className="cursor-pointer"
        onClick={() => {
          dispatch({
            type: ActionTypes.SET_NAVIGATION,
            payload: null,
          });
        }}
      >
        <BookmarkCheck style={{ color: "#1e7bc0" }} />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        dispatch({
          type: ActionTypes.SET_NAVIGATION,
          payload: Navigations.BOOKMARKEDS,
        });
      }}
      className="cursor-pointer"
    >
      <Bookmark className="text-gray-800 dark:text-gray-400" />
    </button>
  );
};
