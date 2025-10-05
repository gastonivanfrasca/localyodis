import type { LanguageOption, SupportedLanguage, Translations } from '../types/i18n';

import { en } from './translations/en';
import { es } from './translations/es';
import { fr } from './translations/fr';

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Supported languages configuration
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
  },
];

// All translations
export const translations: Partial<Translations> = {
  en,
  es,
  fr,
};

// Utility function to get browser language
export const getBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  return SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang)?.code || DEFAULT_LANGUAGE;
};

// Utility function to get translation by key
export const getTranslation = (
  language: SupportedLanguage,
  key: keyof typeof en,
  fallback?: string
): string => {
  const langTranslations = translations[language];
  if (!langTranslations) {
    return translations[DEFAULT_LANGUAGE]?.[key] || fallback || key;
  }

  return langTranslations[key] || translations[DEFAULT_LANGUAGE]?.[key] || fallback || key;
};

// Utility function to get language option by code
export const getLanguageOption = (code: SupportedLanguage): LanguageOption | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}; 