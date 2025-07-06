import { PredefinedSourcesData } from "../types/predefined-sources";
import predefinedSourcesData from "../data/predefined-sources.json";

export const getPredefinedSources = (): PredefinedSourcesData => {
  return predefinedSourcesData;
}; 