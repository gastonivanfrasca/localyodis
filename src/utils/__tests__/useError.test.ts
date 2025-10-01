import { describe, it, expect, vi } from "vitest";
import type { LocallyStoredData } from "../../types/storage";

let dispatchMock = vi.fn();

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
        newItemsCount: 0,
        latestFetchStatus: "idle",
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
    const { useError } = await import("../useError");
    const { ActionTypes } = await import("../../context/main");
    const { showError, clearError } = useError();

    showError("Oops", "warning");
    expect(dispatchMock).toHaveBeenCalledWith({
      type: ActionTypes.SET_ERROR,
      payload: { message: "Oops", type: "warning" },
    });

    clearError();
    expect(dispatchMock).toHaveBeenCalledWith({
      type: ActionTypes.CLEAR_ERROR,
      payload: null,
    });
  });
});
