import type { TranslationKeys } from '../../types/i18n';

export const fr: TranslationKeys = {
  // Navigation
  home: 'Accueil',
  sources: 'Sources',
  discover: 'Découvrir',
  menu: 'Menu',
  settings: 'Paramètres',
  history: 'Historique',
  bookmarks: 'Favoris',
  search: 'Rechercher',
  
  // Settings
  'settings.title': 'Paramètres',
  'settings.language': 'Langue',
  'settings.language.description': 'Sélectionnez votre langue préférée',
  'settings.reset': 'Réinitialiser la configuration',
  'settings.reset.title': 'Réinitialiser la configuration',
  'settings.reset.description': 'Ceci supprimera définitivement toutes vos sources, favoris et paramètres. Cette action ne peut pas être annulée.',
  'settings.reset.confirm': 'Réinitialiser',
  'settings.reset.cancel': 'Annuler',
  'settings.reset.modal.title': 'Réinitialiser la configuration',
  'settings.reset.modal.message': 'Êtes-vous sûr de vouloir réinitialiser toute la configuration ? Ceci supprimera toutes vos sources, favoris et paramètres.',
  
  // Common
  'common.back': 'Retour',
  'common.close': 'Fermer',
  'common.save': 'Sauvegarder',
  'common.cancel': 'Annuler',
  'common.confirm': 'Confirmer',
  'common.loading': 'Chargement...',
  'common.error': 'Erreur',
  'common.success': 'Succès',
  'common.unknown': 'Inconnu',
  'common.today': 'Aujourd\'hui',
  'common.yesterday': 'Hier',
  'common.continue': 'Continuer',
  
  // Sources
  'sources.title': 'Sources',
  'sources.add': 'Ajouter une source',
  'sources.addRss': 'Ajouter une source RSS',
  'sources.empty': 'Aucune source configurée pour le moment',
  'sources.search': 'Rechercher des sources...',
  'sources.search.placeholder': 'Rechercher des sources...',
  'sources.goToSources': 'Aller aux sources',
  'sources.noSourcesAdded': 'Aucune source RSS ajoutée',
  'sources.goToAdd': 'Allez aux sources pour en ajouter une.',
  'sources.notFound': 'Source non trouvée',
  'sources.profile': 'Profil de source',
  'sources.editColor': 'Modifier la couleur',
  'sources.editName': 'Modifier le nom',
  'sources.enterName': 'Entrez le nom de la source',
  'sources.saveChanges': 'Sauvegarder les modifications',
  'sources.unnamed': 'Source sans nom',
  'sources.feed': 'Flux',
  'sources.videoFeed': 'Flux vidéo',
  'sources.addedOn': 'Ajouté le',
  'sources.removeSource': 'Supprimer la source',
  'sources.selected': 'sources sélectionnées',
  'sources.alreadyExists': 'La source existe déjà !',
  'sources.addedSuccessfully': 'Source ajoutée avec succès !',
  'sources.noSourcesFound': 'Aucune source trouvée correspondant à',
  
  // Discover
  'discover.title': 'Découvrir',
  'discover.search': 'Rechercher des sources...',
  'discover.categories': 'Catégories',
  'discover.description': 'Explorez et ajoutez de nouvelles sources RSS suggérées par la communauté pour améliorer votre expérience de lecture. Les indicateurs verts montrent les sources que vous avez déjà ajoutées.',
  'discover.addedIndicator': 'Déjà ajouté',
  'discover.addedCount': 'de',
  'discover.addCustomSource': 'Ajouter une source personnalisée',
  'discover.added': 'ajoutées',
  'discover.language': 'Langue',
  'discover.allLanguages': 'Toutes les langues',
  'discover.filterByLanguage': 'Filtrer par langue',
  
  // Menu
  'menu.title': 'Menu',
  'menu.about': 'À propos',
  'menu.support': 'Support',
  
  // History
  'history.title': 'Historique',
  'history.empty': 'Aucun historique pour le moment',
  'history.clear': 'Effacer l\'historique',
  'history.emptyDescription': 'Les liens que vous visitez apparaîtront ici pour que vous puissiez y accéder plus tard.',
  'history.startReading': 'Commencez à lire des articles et votre historique s\'affichera ici',
  
  // Bookmarks
  'bookmarks.title': 'Favoris',
  'bookmarks.empty': 'Aucun favori pour le moment',
  'bookmarks.add': 'Ajouter aux favoris',
  'bookmarks.remove': 'Supprimer des favoris',
  'bookmarks.emptyDescription': 'Commencez à marquer vos publications préférées pour les lire plus tard. Elles apparaîtront ici pour un accès facile.',
  'bookmarks.emptyHint': 'sur n\'importe quelle publication pour la marquer comme favorite',
  'bookmarks.tapIcon': 'Appuyez sur l\'icône',
  'bookmarks.toBookmark': 'pour la marquer comme favorite',
  
  // First Time User
  'ftu.welcome': 'Bienvenue sur LocalYodis',
  'ftu.description': 'Commencez par sélectionner parmi ces sources RSS suggérées par la communauté pour commencer à lire du contenu intéressant',
  'ftu.getStarted': 'Commencer',
  'ftu.categories': 'Catégories',
  'ftu.addOwnSource': 'Ajouter votre propre source',
  'ftu.language': 'Langue',
  'ftu.allLanguages': 'Toutes les langues',
  'ftu.filterByLanguage': 'Filtrer par langue',
  
  // RSS Feed
  'rss.lastUpdated': 'Dernière mise à jour',
  'rss.noItems': 'Aucun élément disponible',
  'rss.refresh': 'Actualiser',
  'rss.link': 'Lien RSS',
  'rss.example': 'ex. https://exemple.com/feed.xml',
  
  // YouTube
  'youtube.channelName': 'Nom de la chaîne',
  'youtube.example': 'ex. Nom de la Chaîne Exemple',
  'youtube.add': 'Ajouter une chaîne YouTube',
  
  // Search
  'search.placeholder': 'Rechercher',
  'search.noResults': 'Aucun résultat trouvé',
  'search.noResultsDescription': 'Nous n\'avons trouvé aucune publication correspondant à votre recherche. Essayez d\'ajuster vos termes de recherche ou de vérifier l\'orthographe.',
  'search.tips': 'Conseils de recherche :',
  'search.tipKeywords': 'Essayez des mots-clés différents',
  'search.tipFewerWords': 'Utilisez moins de mots',
  'search.tipSpelling': 'Vérifiez l\'orthographe',
  
  // Errors
  'error.network': 'Erreur réseau',
  'error.parsing': 'Erreur lors du traitement du contenu',
  'error.unknown': 'Une erreur inconnue s\'est produite',
  'error.retry': 'Réessayer',
  'error.required': 'L\'URL RSS est requise',
  'error.sourceExists': 'La source existe déjà',
  'error.invalidTitle': 'Format de titre invalide',
  
  // Notifications
  'notification.close': 'Fermer la notification',
  'notification.example.error': 'Ceci est un message d\'erreur d\'exemple',
  'notification.example.warning': 'Ceci est un avertissement d\'exemple',
  'notification.example.success': 'Opération terminée avec succès',
  'notification.example.info': 'Ceci est une information supplémentaire',
  'notification.test.title': 'Test de notifications',
  'notification.test.showError': 'Afficher l\'erreur',
  'notification.test.showWarning': 'Afficher l\'avertissement',
  'notification.test.showSuccess': 'Afficher le succès',
  'notification.test.showInfo': 'Afficher l\'information',
  
  // Modals
  'modal.close': 'Fermer le modal',
  'modal.addRss': 'Ajouter une source RSS',
  'modal.addYoutube': 'Ajouter une chaîne YouTube',
  
  // Date/Time
  'time.today': 'aujourd\'hui',
  'time.yesterday': 'hier',
  'time.unknown': 'Inconnu',
  'time.unknownDate': 'date inconnue',
  'time.daysAgo': 'jours passés',
  'time.dayAgo': 'jour passé',
  
  // Accessibility
  'a11y.closeModal': 'Fermer le modal',
  'a11y.closeNotification': 'Fermer la notification',
  'a11y.switchTheme': 'Changer le thème',
  'a11y.logo': 'logo',
}; 