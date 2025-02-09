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
