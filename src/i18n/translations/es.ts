import type { TranslationKeys } from '../../types/i18n';

export const es: TranslationKeys = {
  // Navigation
  home: 'Inicio',
  sources: 'Fuentes',
  discover: 'Descubrir',
  menu: 'Menú',
  settings: 'Configuración',
  history: 'Historial',
  bookmarks: 'Favoritos',
  search: 'Buscar',
  
  // Settings
  'settings.title': 'Configuración',
  'settings.language': 'Idioma',
  'settings.language.description': 'Selecciona tu idioma preferido',
  'settings.reset': 'Restablecer configuración',
  'settings.reset.title': 'Restablecer configuración',
  'settings.reset.description': 'Esto eliminará permanentemente todas tus fuentes, favoritos y configuraciones. Esta acción no se puede deshacer.',
  'settings.reset.confirm': 'Restablecer',
  'settings.reset.cancel': 'Cancelar',
  'settings.reset.modal.title': 'Restablecer configuración',
  'settings.reset.modal.message': '¿Estás seguro de que quieres restablecer toda la configuración? Esto eliminará todas tus fuentes, favoritos y configuraciones.',
  
  // Common
  'common.back': 'Atrás',
  'common.close': 'Cerrar',
  'common.save': 'Guardar',
  'common.cancel': 'Cancelar',
  'common.confirm': 'Confirmar',
  'common.loading': 'Cargando...',
  'common.error': 'Error',
  'common.success': 'Éxito',
  'common.unknown': 'Desconocido',
  'common.today': 'Hoy',
  'common.yesterday': 'Ayer',
  'common.continue': 'Continuar',
  
  // Sources
  'sources.title': 'Fuentes',
  'sources.add': 'Agregar fuente',
  'sources.addRss': 'Agregar fuente RSS',
  'sources.empty': 'No hay fuentes configuradas aún',
  'sources.search': 'Buscar fuentes...',
  'sources.search.placeholder': 'Buscar fuentes...',
  'sources.goToSources': 'Ir a fuentes',
  'sources.noSourcesAdded': 'No hay fuentes RSS agregadas',
  'sources.goToAdd': 'Ve a fuentes para agregar una.',
  'sources.notFound': 'Fuente no encontrada',
  'sources.profile': 'Perfil de fuente',
  'sources.editColor': 'Editar color',
  'sources.editName': 'Editar nombre',
  'sources.enterName': 'Ingresa el nombre de la fuente',
  'sources.saveChanges': 'Guardar cambios',
  'sources.unnamed': 'Fuente sin nombre',
  'sources.feed': 'Feed',
  'sources.videoFeed': 'Feed de video',
  'sources.addedOn': 'Agregado el',
  'sources.removeSource': 'Eliminar fuente',
  'sources.selected': 'fuentes seleccionadas',
  'sources.alreadyExists': '¡La fuente ya existe!',
  'sources.addedSuccessfully': '¡Fuente agregada exitosamente!',
  'sources.noSourcesFound': 'No se encontraron fuentes que coincidan con',
  'sources.addCustom': 'Agregar Fuente Personalizada',
  'sources.addCustomSubtitle': 'Agrega cualquier feed RSS o sitio web ingresando su URL',
  'sources.url': 'URL RSS',
  'sources.customName': 'Nombre Personalizado',
  'sources.optional': 'opcional',
  'sources.customNamePlaceholder': 'Ingresa un nombre personalizado para esta fuente',
  'sources.customNameHelp': 'Si no se proporciona un nombre, usaremos el dominio del sitio web',
  'sources.addCustomSource': 'Agregar Fuente Personalizada',
  'sources.discoverFeeds': 'Buscar feeds',
  'sources.discoveredFeeds': 'Feeds encontrados',
  
  // Discover
  'discover.title': 'Descubrir',
  'discover.search': 'Buscar fuentes...',
  'discover.categories': 'Categorías',
  'discover.description': 'Explora y agrega nuevas fuentes RSS sugeridas por la comunidad para mejorar tu experiencia de lectura. Los indicadores verdes muestran las fuentes que ya agregaste.',
  'discover.addedIndicator': 'Ya agregado',
  'discover.addedCount': 'de',
  'discover.addCustomSource': 'Agregar fuente personalizada',
  'discover.added': 'agregadas',
  'discover.language': 'Idioma',
  'discover.allLanguages': 'Todos los idiomas',
  'discover.filterByLanguage': 'Filtrar por idioma',

  'discover.predefinedSources': 'Fuentes de la Comunidad',
  'discover.predefinedSourcesSubtitle': 'Explora fuentes RSS seleccionadas y sugeridas por la comunidad',
  'discover.selectCategories': 'Selecciona categorías para explorar las fuentes sugeridas por la comunidad',
  

  'discover.tabs.recommended': 'Recomendadas',
  'discover.tabs.custom': 'RSS Personalizado',

  // Menu
  'menu.title': 'Menú',
  'menu.about': 'Acerca de',
  'menu.support': 'Soporte',
  'menu.privacy': 'Política de Privacidad',
  'menu.terms': 'Términos de Uso',
  
  // History
  'history.title': 'Historial',
  'history.empty': 'No hay historial aún',
  'history.clear': 'Limpiar historial',
  'history.emptyDescription': 'Los enlaces que visites aparecerán aquí para que puedas acceder a ellos más tarde.',
  'history.startReading': 'Comienza a leer artículos y tu historial se mostrará aquí',
  
  // Statistics
  'statistics.title': 'Estadísticas de Uso',
  'statistics.empty': 'No hay estadísticas disponibles aún',
  'statistics.emptyDescription': 'Comienza a leer artículos para ver tus estadísticas de uso',
  'statistics.totalVisits': 'Visitas Totales',
  'statistics.uniqueSources': 'Fuentes',
  'statistics.lastSevenDays': 'Últimos 7 Días',
  'statistics.sourceRankings': 'Ranking de Fuentes',
  'statistics.mostActiveSource': 'Fuente Más Activa',
  'statistics.lastVisit': 'Última visita',
  'statistics.visits': 'visitas',
  'statistics.mostBookmarkedSource': 'Fuente con Más Favoritos',
  'statistics.bookmarks': 'favoritos',
  
  // Bookmarks
  'bookmarks.title': 'Favoritos',
  'bookmarks.empty': 'No hay favoritos aún',
  'bookmarks.add': 'Agregar favorito',
  'bookmarks.remove': 'Quitar favorito',
  'bookmarks.emptyDescription': 'Comienza a marcar tus publicaciones favoritas para leerlas más tarde. Aparecerán aquí para fácil acceso.',
  'bookmarks.emptyHint': 'en cualquier publicación para marcarla como favorita',
  'bookmarks.tapIcon': 'Toca el icono',
  'bookmarks.toBookmark': 'para marcarla como favorita',
  
  // First Time User
  'ftu.welcome': 'Bienvenido a LocalYodis',
  'ftu.description': 'Comienza seleccionando de estas fuentes RSS sugeridas por la comunidad para comenzar a leer contenido interesante',
  'ftu.getStarted': 'Comenzar',
  'ftu.categories': 'Categorías',
  'ftu.addOwnSource': 'Agregar tu propia fuente',
  'ftu.language': 'Idioma',
  'ftu.allLanguages': 'Todos los idiomas',
  'ftu.filterByLanguage': 'Filtrar por idioma',

  'ftu.sourcesAdded': 'Intereses Añadidos',
  'ftu.sourceAdded': 'Interés añadido',
  'ftu.sourcesAddedPlural': 'Intereses añadidos',
  'ftu.interestsAdded': 'Intereses Añadidos',
  'ftu.noSourcesYet': 'Añade tus intereses arriba para empezar.',
  'ftu.sourceReady': 'interés listo',
  'ftu.sourcesReady': 'intereses listos',
  'ftu.addInterests': 'Añade tus intereses para empezar',

  // Welcome Screen
  'welcome.subtitle': 'Tu lector de noticias RSS local',
  'welcome.whatIsThis': '¿Qué es LocalYodis?',
  'welcome.description1': 'LocalYodis es un lector de noticias RSS local-first que no requiere registro ni cuenta. Todo funciona directamente en tu dispositivo.',
  'welcome.description2': 'Comienza a leer inmediatamente agregando tus fuentes favoritas. Tu privacidad está garantizada con almacenamiento local.',
  'welcome.features': 'Características principales',
  'welcome.feature1': 'Rápido y responsive - carga instantánea',
  'welcome.feature2': 'Interfaz moderna y fácil de usar',
  'welcome.feature3': 'Estadísticas de uso locales para seguir tu actividad',
  'welcome.developer': 'Información del desarrollador',
  'welcome.developerInfo': 'Aplicación premium disponible en Google Play Store por $10.',
  'welcome.openSource': 'Aplicación comercial con soporte dedicado',
  'welcome.permissions': 'No requiere permisos especiales del sistema',
  'welcome.legal': 'Información legal',
  'welcome.version': 'Versión',
  'welcome.getStarted': 'Comenzar a usar LocalYodis',
  'welcome.agreementText': 'Al continuar, aceptas nuestros términos de uso y política de privacidad',
  'welcome.changeLanguage': 'Cambiar idioma',
  'welcome.selectLanguage': 'Selecciona tu idioma',
  
  // Mobile landing
  'mobile.landing.title': 'LocalYodis en tu móvil',
  'mobile.landing.subtitle': 'Descubre la mejor experiencia LocalYodis en tu dispositivo Android.',
  'mobile.landing.downloadOpen': 'Abrir o descargar en Google Play',
  'mobile.landing.desktopInfo': 'También puedes probar LocalYodis gratis desde tu computadora en cualquier momento.',
  'mobile.landing.openDesktopLink': 'Ir a la versión de escritorio',
  'mobile.landing.highlight1.title': 'Rápida y fluida',
  'mobile.landing.highlight1.desc': 'Optimizada para uso diario y lectura sin interrupciones.',
  'mobile.landing.highlight2.title': 'Privada por diseño',
  'mobile.landing.highlight2.desc': 'Tus datos se almacenan localmente en tu dispositivo.',
  'mobile.landing.highlight3.title': 'Sin cuentas',
  'mobile.landing.highlight3.desc': 'Empieza a leer en segundos, sin registros ni contraseñas.',
  
  // RSS Feed
  'rss.lastUpdated': 'Última actualización',
  'rss.noItems': 'No hay elementos disponibles',
  'rss.refresh': 'Actualizar',
  'rss.link': 'Enlace RSS',
  'rss.example': 'ej. https://ejemplo.com/feed.xml',
  
  // YouTube
  'youtube.channelName': 'Nombre del canal',
  'youtube.example': 'ej. Nombre del Canal de Ejemplo',
  'youtube.add': 'Agregar canal de YouTube',
  
  // Search
  'search.placeholder': 'Buscar',
  'search.noResults': 'No se encontraron resultados',
  'search.noResultsDescription': 'No pudimos encontrar publicaciones que coincidan con tu búsqueda. Intenta ajustar los términos de búsqueda o verificar la ortografía.',
  'search.tips': 'Consejos de búsqueda:',
  'search.tipKeywords': 'Intenta con palabras clave diferentes',
  'search.tipFewerWords': 'Usa menos palabras',
  'search.tipSpelling': 'Verifica la ortografía',
  
  // Errors
  'error.network': 'Error de red',
  'error.parsing': 'Error al procesar el contenido',
  'error.unknown': 'Ocurrió un error desconocido',
  'error.retry': 'Reintentar',
  'error.required': 'La URL del RSS es requerida',
  'error.sourceExists': 'La fuente ya existe',
  'error.invalidTitle': 'Formato de título inválido',
  
  // Notifications
  'notification.close': 'Cerrar notificación',
  'notification.example.error': 'Esto es un mensaje de error de ejemplo',
  'notification.example.warning': 'Esto es una advertencia de ejemplo',
  'notification.example.success': 'Operación completada exitosamente',
  'notification.example.info': 'Esta es información adicional',
  'notification.test.title': 'Prueba de notificaciones',
  'notification.test.showError': 'Mostrar error',
  'notification.test.showWarning': 'Mostrar advertencia',
  'notification.test.showSuccess': 'Mostrar éxito',
  'notification.test.showInfo': 'Mostrar información',
  
  // Modals
  'modal.close': 'Cerrar modal',
  'modal.addRss': 'Agregar fuente RSS',
  'modal.addYoutube': 'Agregar canal de YouTube',
  
  // Date/Time
  'time.today': 'hoy',
  'time.yesterday': 'ayer',
  'time.unknown': 'Desconocido',
  'time.unknownDate': 'fecha desconocida',
  'time.daysAgo': 'días atrás',
  'time.dayAgo': 'día atrás',
  


  // Accessibility
  'a11y.closeModal': 'Cerrar modal',
  'a11y.closeNotification': 'Cerrar notificación',
  'a11y.switchTheme': 'Cambiar tema',
  'a11y.logo': 'logo',
  
  // Legal
  'legal.privacy.title': 'Política de Privacidad',
  'legal.privacy.lastUpdated': 'Última actualización',
  'legal.terms.title': 'Términos de Uso',
  'legal.terms.lastUpdated': 'Última actualización',
}; 