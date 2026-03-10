import { Outlet, useLocation, useNavigate } from "react-router";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { ActionTypes, useMainContext } from "../context/main";
import { getLocallyStoredData } from "../utils/storage";
import { getViewNameFromPath } from "../utils/analytics";
import { kromemo } from "kromemo";
import { useError } from "../utils/useError";
import { useI18n } from "../context/i18n";
import {
  buildBookmarkFromNotification,
  hasBookmarkLink,
  type NotificationBookmarkPayload,
} from "../utils/notificationBookmarks";
import Snackbar from "../components/Snackbar";

type NotificationBookmarkMode = "add" | "remove";

type PushBookmarkMessage = {
  type: "push-notification-bookmark-toggle";
  bookmark: NotificationBookmarkPayload;
  mode: NotificationBookmarkMode;
};

const isPushBookmarkMessage = (payload: unknown): payload is PushBookmarkMessage => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return (payload as { type?: string }).type === "push-notification-bookmark-toggle";
};

export const ThemeLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
  const { showError } = useError();
  const processedNotificationActions = useRef(new Set<string>());

  const applyNotificationBookmarkAction = useCallback((payload: NotificationBookmarkPayload, mode: NotificationBookmarkMode) => {
    const bookmark = buildBookmarkFromNotification(payload, state.sources);

    if (!bookmark?.link) {
      return;
    }

    const actionKey = JSON.stringify([mode, bookmark.link, bookmark.pubDate, bookmark.title]);
    if (processedNotificationActions.current.has(actionKey)) {
      return;
    }

    processedNotificationActions.current.add(actionKey);

    const alreadySaved = hasBookmarkLink(state.bookmarks, bookmark.link);

    if (mode === "remove") {
      dispatch({
        type: ActionTypes.REMOVE_BOOKMARK,
        payload: bookmark.link,
      });
      showError(t("bookmarks.removedFromNotification"), "info");
      return;
    }

    dispatch({
      type: ActionTypes.ADD_BOOKMARK,
      payload: bookmark,
    });

    showError(
      alreadySaved ? t("bookmarks.alreadySaved") : t("bookmarks.savedFromNotification"),
      alreadySaved ? "info" : "success",
    );
  }, [dispatch, showError, state.bookmarks, state.sources, t]);

  useLayoutEffect(() => {
    const localData = getLocallyStoredData();
    const localTheme = localData.theme;
    document.body.classList.add(localTheme);
  }, []);

  useEffect(() => {
    const info = getViewNameFromPath(location.pathname);
    if (info) {
      kromemo.trackView({ name: info.name, payload: info.payload });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const handleMessage = (event: MessageEvent<unknown>) => {
      if (!isPushBookmarkMessage(event.data)) {
        return;
      }

      applyNotificationBookmarkAction(event.data.bookmark, event.data.mode);
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [applyNotificationBookmarkAction]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("notificationAction") !== "toggle-bookmark") {
      return;
    }

    const mode = params.get("mode") === "remove" ? "remove" : "add";

    applyNotificationBookmarkAction(
      {
        title: params.get("title"),
        link: params.get("link"),
        sourceUrl: params.get("sourceUrl"),
        sourceName: params.get("sourceName"),
        pubDate: params.get("pubDate"),
      },
      mode,
    );

    ["notificationAction", "mode", "title", "link", "sourceUrl", "sourceName", "pubDate"].forEach((key) => {
      params.delete(key);
    });

    navigate(
      {
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { replace: true },
    );
  }, [applyNotificationBookmarkAction, location.pathname, location.search, navigate]);

  return (
    <div className="theme-layout">
      <Outlet />
      <Snackbar />
    </div>
  );
};
