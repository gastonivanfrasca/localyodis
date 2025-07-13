import { SupportedLanguage } from './i18n';

export type PredefinedSource = {
  name: string;
  url: string;
  description: string;
  language: SupportedLanguage;
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