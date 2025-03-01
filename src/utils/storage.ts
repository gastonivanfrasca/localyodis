import { Source } from "../types/storage";
import rssPlaceholder from "../assets/rss_placeholder.png";

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

export const getSourceByID = (sourceID: string | null | undefined) => {
  if (!sourceID) return null;
  const source = getLocallyStoredData().sources.find(
    (source) => source.id === sourceID
  );
  return source;
}

export const getSourceName = (sourceID: string | null | undefined) => {
  if (!sourceID) return "Unknown";
  const source = getLocallyStoredData().sources.find(
    (source) => source.id === sourceID
  );
  return source?.name || "Unknown";
};

export const getImageBySourceID = (sourceID: string) => {
    const source = getLocallyStoredData().sources.find(
      (source) => source.id === sourceID
    );
    return source?.image || rssPlaceholder;
};

export const getColorBySourceID = (sourceID: string | null | undefined) => {
  const source = getLocallyStoredData().sources.find(
    (source) => source.id === sourceID
  );
  return source?.color || "#000000";
}

export const getInitialsBySourceID = (sourceID: string | null | undefined) => {
  const source = getLocallyStoredData().sources.find(
    (source) => source.id === sourceID
  );
  return source?.initial || "?";
}