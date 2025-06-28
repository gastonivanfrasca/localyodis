import { LocallyStoredData } from "../types/storage";
import { Navigations } from "../types/navigation";

const defaultLocallyStoredData = {
  theme: "dark",
  sources: [],
  bookmarks: [],
  activeSources: [],
  scrollPosition: 0,
  loading: false,
  navigation: Navigations.HOME,
  items: [],
  lastUpdated: new Date().toISOString(),
  searchQuery: null,
  activeItems: [],
  error: null,
} as LocallyStoredData;

export const storeDataLocally = (data: LocallyStoredData) => {
  localStorage.setItem("localyodis", JSON.stringify(data));
};

export const getLocallyStoredData = (): LocallyStoredData => {
  const storedData = localStorage.getItem("localyodis");
  const parsedStoredData = storedData
    ? (JSON.parse(storedData) as LocallyStoredData)
    : (defaultLocallyStoredData as LocallyStoredData);

    parsedStoredData.sources.forEach((source) => {
      if (typeof source.name === "object" && source.name !== null) {
        source.name = source.name["_"] ? source.name["_"] : source.name;
        source.initial = source.name[0];
        storeDataLocally(parsedStoredData);
      }
    });

  return parsedStoredData;
};

export const removeSourceFromLocalData = (sourceId: string) => {
  const localData = getLocallyStoredData();
  const sources = localData.sources || [];
  const updatedSources = sources.filter((source) => source.id !== sourceId);
  storeDataLocally({ ...localData, sources: updatedSources });
};

export const getSourceByID = (sourceID: string | null | undefined) => {
  if (!sourceID) return null;
  const source = getLocallyStoredData().sources.find(
    (source) => source.id === sourceID
  );
  return source;
};
