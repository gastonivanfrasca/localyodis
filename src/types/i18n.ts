export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt';

export type LanguageOption = {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
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
  search: string;
  
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
  'common.unknown': string;
  'common.today': string;
  'common.yesterday': string;
  'common.continue': string;
  
  // Sources
  'sources.title': string;
  'sources.add': string;
  'sources.addRss': string;
  'sources.empty': string;
  'sources.search': string;
  'sources.search.placeholder': string;
  'sources.goToSources': string;
  'sources.noSourcesAdded': string;
  'sources.goToAdd': string;
  'sources.notFound': string;
  'sources.profile': string;
  'sources.editColor': string;
  'sources.editName': string;
  'sources.enterName': string;
  'sources.saveChanges': string;
  'sources.unnamed': string;
  'sources.feed': string;
  'sources.videoFeed': string;
  'sources.addedOn': string;
  'sources.removeSource': string;
  'sources.selected': string;
  'sources.alreadyExists': string;
  'sources.addedSuccessfully': string;
  'sources.noSourcesFound': string;
  
  // Discover
  'discover.title': string;
  'discover.search': string;
  'discover.categories': string;
  'discover.description': string;
  'discover.addedIndicator': string;
  'discover.addedCount': string;
  'discover.addCustomSource': string;
  'discover.added': string;
  'discover.language': string;
  'discover.allLanguages': string;
  'discover.filterByLanguage': string;
  
  // Menu
  'menu.title': string;
  'menu.about': string;
  'menu.support': string;
  
  // History
  'history.title': string;
  'history.empty': string;
  'history.clear': string;
  'history.emptyDescription': string;
  'history.startReading': string;
  
  // Bookmarks
  'bookmarks.title': string;
  'bookmarks.empty': string;
  'bookmarks.add': string;
  'bookmarks.remove': string;
  'bookmarks.emptyDescription': string;
  'bookmarks.emptyHint': string;
  'bookmarks.tapIcon': string;
  'bookmarks.toBookmark': string;
  
  // First Time User
  'ftu.welcome': string;
  'ftu.description': string;
  'ftu.getStarted': string;
  'ftu.categories': string;
  'ftu.addOwnSource': string;
  'ftu.language': string;
  'ftu.allLanguages': string;
  'ftu.filterByLanguage': string;
  
  // RSS Feed
  'rss.lastUpdated': string;
  'rss.noItems': string;
  'rss.refresh': string;
  'rss.link': string;
  'rss.example': string;
  
  // YouTube
  'youtube.channelName': string;
  'youtube.example': string;
  'youtube.add': string;
  
  // Search
  'search.placeholder': string;
  'search.noResults': string;
  'search.noResultsDescription': string;
  'search.tips': string;
  'search.tipKeywords': string;
  'search.tipFewerWords': string;
  'search.tipSpelling': string;
  
  // Errors
  'error.network': string;
  'error.parsing': string;
  'error.unknown': string;
  'error.retry': string;
  'error.required': string;
  'error.sourceExists': string;
  'error.invalidTitle': string;
  
  // Notifications
  'notification.close': string;
  'notification.example.error': string;
  'notification.example.warning': string;
  'notification.example.success': string;
  'notification.example.info': string;
  'notification.test.title': string;
  'notification.test.showError': string;
  'notification.test.showWarning': string;
  'notification.test.showSuccess': string;
  'notification.test.showInfo': string;
  
  // Modals
  'modal.close': string;
  'modal.addRss': string;
  'modal.addYoutube': string;
  
  // Date/Time
  'time.today': string;
  'time.yesterday': string;
  'time.unknown': string;
  'time.unknownDate': string;
  'time.daysAgo': string;
  'time.dayAgo': string;
  
  // Google News RSS Builder
  'googleNews.title': string;
  'googleNews.subtitle': string;
  'googleNews.searchTerms': string;
  'googleNews.searchTerms.placeholder': string;
  'googleNews.searchTerms.help': string;
  'googleNews.operators': string;
  'googleNews.operators.and': string;
  'googleNews.operators.or': string;
  'googleNews.operators.exclude': string;
  'googleNews.operators.exact': string;
  'googleNews.operators.site': string;
  'googleNews.operators.intitle': string;
  'googleNews.timeFilter': string;
  'googleNews.timeFilter.all': string;
  'googleNews.timeFilter.1h': string;
  'googleNews.timeFilter.12h': string;
  'googleNews.timeFilter.1d': string;
  'googleNews.timeFilter.7d': string;
  'googleNews.timeFilter.30d': string;
  'googleNews.language': string;
  'googleNews.country': string;
  'googleNews.preview': string;
  'googleNews.generate': string;
  'googleNews.addToSources': string;
  'googleNews.examples': string;
  'googleNews.examples.1': string;
  'googleNews.examples.2': string;
  'googleNews.examples.3': string;
  'googleNews.examples.4': string;
  'googleNews.help': string;

  // Accessibility
  'a11y.closeModal': string;
  'a11y.closeNotification': string;
  'a11y.switchTheme': string;
  'a11y.logo': string;
};

export type Translations = {
  [K in SupportedLanguage]: TranslationKeys;
}; 