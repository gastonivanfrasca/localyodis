import { LocallyStoredData } from "../types/storage";
import { Navigations } from "../types/navigation";

const defaultLocallyStoredData = {
  theme: "dark",
  sources: [],
  bookmarks: [],
  navigation: Navigations.HOME,
} as LocallyStoredData;

export const storeDataLocally = (data: LocallyStoredData) => {
  localStorage.setItem("localyodis", JSON.stringify(data));
};

export const getLocallyStoredData = (): LocallyStoredData => {
  const storedData = localStorage.getItem("localyodis");
  return storedData
    ? JSON.parse(storedData)
    : (defaultLocallyStoredData as LocallyStoredData);
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
}