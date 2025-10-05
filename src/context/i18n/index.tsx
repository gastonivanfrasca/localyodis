import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SupportedLanguage } from '../../types/i18n';
import { getBrowserLanguage, getTranslation, SUPPORTED_LANGUAGES } from '../../i18n';
import { en } from '../../i18n/translations/en';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: keyof typeof en, fallback?: string) => string;
  languages: typeof SUPPORTED_LANGUAGES;
}

const I18nContext = createContext<I18nContextType | null>(null);

const I18N_STORAGE_KEY = 'localyodis-language';

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  // Initialize language from localStorage or browser preference
  const getInitialLanguage = (): SupportedLanguage => {
    const stored = localStorage.getItem(I18N_STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.find(lang => lang.code === stored)) {
      return stored as SupportedLanguage;
    }
    return getBrowserLanguage();
  };

  const [language, setLanguageState] = useState<SupportedLanguage>(getInitialLanguage);

  // Function to change language and persist in localStorage
  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    localStorage.setItem(I18N_STORAGE_KEY, newLanguage);
  };

  // Translation function
  const t = (key: keyof typeof en, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    languages: SUPPORTED_LANGUAGES,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}; 