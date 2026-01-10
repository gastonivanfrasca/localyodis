import { describe, it, expect, vi } from "vitest";
import { createRoot } from "react-dom/client";
import React, { act, useEffect } from "react";
import { ActionTypes } from "../../context/main";
import { useError } from "../useError";
import type { LocallyStoredData } from "../../types/storage";

let dispatchMock = vi.fn();
type ErrorHookApi = {
  showError: (message: string, type?: "error" | "warning" | "success" | "info") => void;
  clearError: () => void;
};

vi.mock("../../context/main", async () => {
  const actual = await vi.importActual<typeof import("../../context/main")>("../../context/main");
  return {
    ...actual,
    useMainContext: () => ({
      state: {
        theme: "dark",
        language: "en",
        sources: [],
        bookmarks: [],
        navigation: null,
        items: [],
        activeSources: [],
        scrollPosition: 0,
        loading: false,
        lastUpdated: "2024-01-01T00:00:00.000Z",
        searchQuery: null,
        activeItems: [],
        error: null,
        hiddenItems: [],
        history: [],
      } as LocallyStoredData,
      dispatch: dispatchMock,
    }),
  };
});

describe("useError", () => {
  it("dispatches show and clear actions", async () => {
    dispatchMock = vi.fn();
    const container = document.createElement("div");
    const root = createRoot(container);

    let resolveApi!: (api: ErrorHookApi) => void;
    const hookApiPromise = new Promise<ErrorHookApi>((resolve) => {
      resolveApi = resolve;
    });

    const TestComponent = () => {
      const api = useError();

      useEffect(() => {
        resolveApi(api);
      }, [api]);

      return null;
    };

    await act(async () => {
      root.render(React.createElement(TestComponent));
    });

    const hookApi = await hookApiPromise;

    hookApi.showError("Oops", "warning");
    expect(dispatchMock).toHaveBeenCalledWith({
      type: ActionTypes.SET_ERROR,
      payload: { message: "Oops", type: "warning" },
    });

    hookApi.clearError();
    expect(dispatchMock).toHaveBeenCalledWith({
      type: ActionTypes.CLEAR_ERROR,
      payload: null,
    });

    await act(async () => {
      root.unmount();
    });
  });
});
