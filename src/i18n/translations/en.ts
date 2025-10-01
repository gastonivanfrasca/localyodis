import type { TranslationKeys } from '../../types/i18n';

export const en: TranslationKeys = {
  // Navigation
  home: 'Home',
  sources: 'Sources',
  discover: 'Discover',
  menu: 'Menu',
  settings: 'Settings',
  history: 'History',
  bookmarks: 'Bookmarks',
  search: 'Search',
  
  // Settings
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.language.description': 'Select your preferred language',
  'settings.reset': 'Reset Configuration',
  'settings.reset.title': 'Reset Configuration',
  'settings.reset.description': 'This will permanently delete all your sources, bookmarks, and settings. This action cannot be undone.',
  'settings.reset.confirm': 'Reset',
  'settings.reset.cancel': 'Cancel',
  'settings.reset.modal.title': 'Reset Configuration',
  'settings.reset.modal.message': 'Are you sure you want to reset all configuration? This will delete all your sources, bookmarks, and settings.',
  
  // Common
  'common.back': 'Back',
  'common.close': 'Close',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.unknown': 'Unknown',
  'common.today': 'Today',
  'common.yesterday': 'Yesterday',
  'common.continue': 'Continue',
  
  // Sources
  'sources.title': 'Sources',
  'sources.add': 'Add Source',
  'sources.addRss': 'Add RSS source',
  'sources.empty': 'No sources configured yet',
  'sources.search': 'Search sources...',
  'sources.search.placeholder': 'Search sources...',
  'sources.goToSources': 'Go to sources',
  'sources.noSourcesAdded': 'No RSS sources added',
  'sources.goToAdd': 'Go to sources to add one.',
  'sources.notFound': 'Source Not Found',
  'sources.profile': 'Source Profile',
  'sources.editColor': 'Edit color',
  'sources.editName': 'Edit name',
  'sources.enterName': 'Enter source name',
  'sources.saveChanges': 'Save changes',
  'sources.unnamed': 'Unnamed Source',
  'sources.feed': 'Feed',
  'sources.videoFeed': 'Video Feed',
  'sources.addedOn': 'Added on',
  'sources.removeSource': 'Remove source',
  'sources.selected': 'sources selected',
  'sources.alreadyExists': 'Source already exists!',
  'sources.addedSuccessfully': 'Source added successfully!',
  'sources.removedSuccessfully': 'Source removed successfully!',
  'sources.noSourcesFound': 'No sources found matching',
  'sources.addCustom': 'Add Custom Source',
  'sources.addCustomSubtitle': 'Add any RSS feed or website by entering its URL',
  'sources.url': 'RSS URL',
  'sources.customName': 'Custom Name',
  'sources.optional': 'optional',
  'sources.customNamePlaceholder': 'Enter a custom name for this source',
  'sources.customNameHelp': 'If no name is provided, we\'ll use the website domain',
  'sources.addCustomSource': 'Add Custom Source',
  
  // Discover
  'discover.title': 'Discover',
  'discover.search': 'Search for sources...',
  'discover.categories': 'Categories',
  'discover.description': 'Explore and add new community-suggested RSS sources to enhance your reading experience. Green indicators show sources you\'ve already added.',
  'discover.addedIndicator': 'Already added',
  'discover.addedCount': 'of',
  'discover.addCustomSource': 'Add custom source',
  'discover.added': 'added',
  'discover.language': 'Language',
  'discover.allLanguages': 'All languages',
  'discover.filterByLanguage': 'Filter by language',

  'discover.predefinedSources': 'Community Sources',
  'discover.predefinedSourcesSubtitle': 'Explore curated RSS sources suggested by the community',
  'discover.selectCategories': 'Select categories above to browse community-suggested sources',
  

  'discover.tabs.recommended': 'Recommended',
  'discover.tabs.custom': 'Custom RSS',

  // Menu
  'menu.title': 'Menu',
  'menu.about': 'About',
  'menu.support': 'Support',
  
  // History
  'history.title': 'History',
  'history.empty': 'No history yet',
  'history.clear': 'Clear History',
  'history.emptyDescription': 'Links you visit will appear here so you can access them later.',
  'history.startReading': 'Start reading articles and your history will be shown here',
  
  // Statistics
  'statistics.title': 'Usage Statistics',
  'statistics.empty': 'No statistics available yet',
  'statistics.emptyDescription': 'Start reading articles to see your usage statistics',
  'statistics.totalVisits': 'Total Visits',
  'statistics.uniqueSources': 'Sources',
  'statistics.lastSevenDays': 'Last 7 Days',
  'statistics.sourceRankings': 'Source Rankings',
  'statistics.mostActiveSource': 'Most Active Source',
  'statistics.lastVisit': 'Last visit',
  'statistics.visits': 'visits',
  'statistics.mostBookmarkedSource': 'Most Bookmarked Source',
  'statistics.bookmarks': 'bookmarks',
  
  // Bookmarks
  'bookmarks.title': 'Bookmarks',
  'bookmarks.empty': 'No bookmarks yet',
  'bookmarks.add': 'Add Bookmark',
  'bookmarks.remove': 'Remove Bookmark',
  'bookmarks.emptyDescription': 'Start bookmarking your favorite publications to read them later. They\'ll appear here for easy access.',
  'bookmarks.emptyHint': 'icon on any publication to bookmark it',
  'bookmarks.tapIcon': 'Tap the',
  'bookmarks.toBookmark': 'to bookmark it',
  
  // First Time User
  'ftu.welcome': 'Welcome to LocalYodis',
  'ftu.description': 'Get started by selecting from these community-suggested RSS sources to begin reading interesting content',
  'ftu.getStarted': 'Get Started',
  'ftu.categories': 'Categories',
  'ftu.addOwnSource': 'Add your own source',
  'ftu.language': 'Language',
  'ftu.allLanguages': 'All languages',
  'ftu.filterByLanguage': 'Filter by language',

  'ftu.sourcesAdded': 'Interests Added',
  'ftu.sourceAdded': 'Interest added',
  'ftu.sourcesAddedPlural': 'Interests added',
  'ftu.interestsAdded': 'Interests Added',
  'ftu.noSourcesYet': 'Add your interests above to get started.',
  'ftu.sourceReady': 'interest ready',
  'ftu.sourcesReady': 'interests ready',
  'ftu.addInterests': 'Add your interests to get started',
  
  // RSS Feed
  'rss.lastUpdated': 'Last updated',
  'rss.noItems': 'No items available',
  'rss.refresh': 'Refresh',
  'rss.link': 'RSS link',
  'rss.example': 'e.g. https://example.com/feed.xml',
  'feed.newItems': '+{count} new items',
  'feed.upToDate': 'Up to date',
  
  // YouTube
  'youtube.channelName': 'Channel name',
  'youtube.example': 'e.g. Example Channel Name',
  'youtube.add': 'Add YouTube Channel',
  
  // Search
  'search.placeholder': 'Search',
  'search.noResults': 'No results found',
  'search.noResultsDescription': 'We couldn\'t find any publications matching your search. Try adjusting your search terms or checking the spelling.',
  'search.tips': 'Search tips:',
  'search.tipKeywords': 'Try different keywords',
  'search.tipFewerWords': 'Use fewer words',
  'search.tipSpelling': 'Check your spelling',
  
  // Errors
  'error.network': 'Network error occurred',
  'error.parsing': 'Error parsing content',
  'error.unknown': 'An unknown error occurred',
  'error.retry': 'Retry',
  'error.required': 'RSS URL is required',
  'error.sourceExists': 'Source already exists',
  'error.invalidTitle': 'Invalid title format',
  
  // Notifications
  'notification.close': 'Close notification',
  'notification.example.error': 'This is an example error message',
  'notification.example.warning': 'This is an example warning',
  'notification.example.success': 'Operation completed successfully',
  'notification.example.info': 'This is additional information',
  'notification.test.title': 'Notification Test',
  'notification.test.showError': 'Show Error',
  'notification.test.showWarning': 'Show Warning',
  'notification.test.showSuccess': 'Show Success',
  'notification.test.showInfo': 'Show Info',
  
  // Modals
  'modal.close': 'Close modal',
  'modal.addRss': 'Add RSS Source',
  'modal.addYoutube': 'Add YouTube Channel',
  
  // Date/Time
  'time.today': 'today',
  'time.yesterday': 'yesterday',
  'time.unknown': 'Unknown',
  'time.unknownDate': 'unknown date',
  'time.daysAgo': 'days ago',
  'time.dayAgo': 'day ago',
  


  // Accessibility
  'a11y.closeModal': 'Close modal',
  'a11y.closeNotification': 'Close notification',
  'a11y.switchTheme': 'Switch theme',
  'a11y.logo': 'logo',
}; 