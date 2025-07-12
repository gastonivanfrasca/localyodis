export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt';

export type LanguageOption = {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
};

export type TranslationKeys = {
  // Navigation
  home: string;
  sources: string;
  discover: string;
  menu: string;
  settings: string;
  history: string;
  bookmarks: string;
  
  // Settings
  'settings.title': string;
  'settings.language': string;
  'settings.language.description': string;
  'settings.reset': string;
  'settings.reset.title': string;
  'settings.reset.description': string;
  'settings.reset.confirm': string;
  'settings.reset.cancel': string;
  'settings.reset.modal.title': string;
  'settings.reset.modal.message': string;
  
  // Common
  'common.back': string;
  'common.close': string;
  'common.save': string;
  'common.cancel': string;
  'common.confirm': string;
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  
  // Sources
  'sources.title': string;
  'sources.add': string;
  'sources.empty': string;
  'sources.search': string;
  
  // Discover
  'discover.title': string;
  'discover.search': string;
  'discover.categories': string;
  
  // Menu
  'menu.title': string;
  'menu.about': string;
  'menu.support': string;
  
  // History
  'history.title': string;
  'history.empty': string;
  'history.clear': string;
  
  // Bookmarks
  'bookmarks.title': string;
  'bookmarks.empty': string;
  'bookmarks.add': string;
  'bookmarks.remove': string;
  
  // First Time User
  'ftu.welcome': string;
  'ftu.description': string;
  'ftu.getStarted': string;
  
  // RSS Feed
  'rss.lastUpdated': string;
  'rss.noItems': string;
  'rss.refresh': string;
  
  // Errors
  'error.network': string;
  'error.parsing': string;
  'error.unknown': string;
  'error.retry': string;
};

export type Translations = {
  [K in SupportedLanguage]: TranslationKeys;
}; 