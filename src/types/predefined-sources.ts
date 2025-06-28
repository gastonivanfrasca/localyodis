export type PredefinedSource = {
  name: string;
  url: string;
  description: string;
};

export type SourceCategory = {
  id: string;
  name: string;
  icon: string;
  sources: PredefinedSource[];
};

export type PredefinedSourcesData = {
  categories: SourceCategory[];
}; 