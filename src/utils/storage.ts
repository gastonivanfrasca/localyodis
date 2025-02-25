import { Source } from "../types/storage";

type LocallyStoredData = {
  theme: string;
  sources: Source[];
};

const defaultLocallyStoredData = {
  theme: "dark",
  sources: [],
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

export const getSourceName = (sourceID: string | null | undefined) => {
  if (!sourceID) return "Unknown";
  const source = getLocallyStoredData().sources.find(
    (source) => source.id === sourceID
  );
  return source?.name || "Unknown";
};

/* const getImageBySourceID = (sourceID: string) => {
    const source = getLocallyStoredData().sources.find(
      (source) => source.id === sourceID
    );
    return source?.image || rssPlaceholder;
}; */
