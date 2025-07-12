import { HistoryItem, LocallyStoredData } from "../types/storage";

import { Navigations } from "../types/navigation";
import { RSSItem } from "../types/rss";
import { getBrowserLanguage } from "../i18n";

// Storage configuration to prevent QuotaExceededError
export const STORAGE_CONFIG = {
  MAX_ITEMS_PER_SOURCE: 50,    // Máximo de items por fuente RSS (solo informativo, no se aplica)
  MAX_TOTAL_ITEMS: 300,        // Máximo total de items en storage
  CLEANUP_KEEP_ITEMS: 30,      // Cuántos items mantener al limpiar por fuente
  CLEANUP_KEEP_TOTAL: 200,     // Cuántos items mantener al limpiar en total
} as const;

const defaultLocallyStoredData = {
  theme: "dark",
  language: getBrowserLanguage(),
  sources: [],
  bookmarks: [],
  activeSources: [],
  scrollPosition: 0,
  loading: false,
  navigation: Navigations.HOME,
  items: [],
  lastUpdated: new Date().toISOString(),
  searchQuery: null,
  activeItems: [],
  error: null,
  hiddenItems: [], // Initialize empty array for hidden items
  history: [], // Initialize empty array for history
} as LocallyStoredData;

export const storeDataLocally = (data: LocallyStoredData) => {
  try {
    const optimizedData = cleanupStorageData(data);
    localStorage.setItem("localyodis", JSON.stringify(optimizedData));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      handleQuotaExceededError(data);
    } else {
      console.error('Error storing data locally:', error);
      throw error;
    }
  }
};

// Función para limpiar datos antiguos y mantener solo los más recientes
export const cleanupStorageData = (data: LocallyStoredData): LocallyStoredData => {
  const { items, ...restData } = data;
  
  // Si no hay items, devolver data sin cambios
  if (!items || items.length === 0) {
    return data;
  }
  
  // Ordenar items por fecha de publicación (más recientes primero)
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.pubDate || '').getTime();
    const dateB = new Date(b.pubDate || '').getTime();
    return dateB - dateA; // Más recientes primero
  });
  
  // Si tenemos menos items que el límite total, mantener todos ordenados cronológicamente
  if (sortedItems.length <= STORAGE_CONFIG.MAX_TOTAL_ITEMS) {
    return {
      ...restData,
      items: sortedItems,
      activeItems: sortedItems,
    };
  }
  
  // Aplicar límite total manteniendo orden cronológico
  const finalItems = sortedItems.slice(0, STORAGE_CONFIG.MAX_TOTAL_ITEMS);
  
  return {
    ...restData,
    items: finalItems,
    activeItems: finalItems, // Actualizar también activeItems
  };
};

// Función para manejar errores de cuota excedida
export const handleQuotaExceededError = (data: LocallyStoredData) => {
  console.warn('localStorage quota exceeded, cleaning up old data...');
  
  try {
    // Limpiar datos más agresivamente
    const cleanedData = {
      ...data,
      items: data.items.slice(0, STORAGE_CONFIG.CLEANUP_KEEP_TOTAL),
      activeItems: data.activeItems.slice(0, STORAGE_CONFIG.CLEANUP_KEEP_TOTAL),
      history: (data.history || []).slice(0, 50), // Keep only last 50 history items
    };
    
    // Intentar guardar datos limpios
    localStorage.setItem("localyodis", JSON.stringify(cleanedData));
    console.log('Data cleaned and stored successfully');
  } catch (retryError) {
    // Si aún falla, limpiar más datos
    console.error('Failed to store even after cleanup, removing more data...', retryError);
    const minimalData = {
      ...data,
      items: data.items.slice(0, 50), // Mantener solo 50 items
      activeItems: data.activeItems.slice(0, 50),
      history: (data.history || []).slice(0, 20), // Keep only last 20 history items
    };
    
    try {
      localStorage.setItem("localyodis", JSON.stringify(minimalData));
      console.log('Minimal data stored successfully');
    } catch (finalError) {
      console.error('Could not store data even with minimal dataset:', finalError);
      // Como último recurso, mostrar error al usuario
      alert('Error: No se pueden guardar los datos. El almacenamiento está lleno. Considera resetear la configuración desde Settings.');
    }
  }
};

export const getLocallyStoredData = (): LocallyStoredData => {
  const storedData = localStorage.getItem("localyodis");
  const parsedStoredData = storedData
    ? (JSON.parse(storedData) as LocallyStoredData)
    : (defaultLocallyStoredData as LocallyStoredData);

  // Ensure history exists (for backward compatibility)
  if (!parsedStoredData.history) {
    parsedStoredData.history = [];
  }

  // Ensure language exists (for backward compatibility)
  if (!parsedStoredData.language) {
    parsedStoredData.language = getBrowserLanguage();
  }

  parsedStoredData.sources.forEach((source) => {
    if (typeof source.name === "object" && source.name !== null) {
      source.name = source.name["_"] ? source.name["_"] : source.name;
      source.initial = source.name[0];
      storeDataLocally(parsedStoredData);
    }
  });

  return parsedStoredData;
};

export const removeSourceFromLocalData = (sourceId: string) => {
  const localData = getLocallyStoredData();
  const sources = localData.sources || [];
  const updatedSources = sources.filter((source) => source.id !== sourceId);
  storeDataLocally({ ...localData, sources: updatedSources });
};

export const getSourceByID = (sourceID: string | null | undefined) => {
  if (!sourceID) return null;
  const source = getLocallyStoredData().sources.find(
    (source) => source.id === sourceID
  );
  return source;
};

// Función de utilidad para obtener información del uso de storage
export const getStorageInfo = () => {
  try {
    const data = getLocallyStoredData();
    const dataString = JSON.stringify(data);
    const sizeInBytes = new Blob([dataString]).size;
    const sizeInKB = Math.round(sizeInBytes / 1024);
    const sizeInMB = Math.round(sizeInKB / 1024 * 100) / 100;
    
    return {
      totalItems: data.items.length,
      totalBookmarks: data.bookmarks.length,
      totalSources: data.sources.length,
      sizeInBytes,
      sizeInKB,
      sizeInMB,
      withinLimits: {
        totalItems: data.items.length <= STORAGE_CONFIG.MAX_TOTAL_ITEMS,
        itemsPerSource: checkItemsPerSourceLimit(data.items),
      }
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
};

// Función auxiliar para verificar límites por fuente
const checkItemsPerSourceLimit = (items: typeof defaultLocallyStoredData.items) => {
  const itemsBySource = new Map<string, number>();
  items.forEach(item => {
    const source = item.source || 'unknown';
    itemsBySource.set(source, (itemsBySource.get(source) || 0) + 1);
  });
  
  return Array.from(itemsBySource.values()).every(count => count <= STORAGE_CONFIG.MAX_ITEMS_PER_SOURCE);
};

// Utility functions for managing hidden items

// Extract title from RSS item (simplified approach)
export const extractItemTitle = (item: RSSItem): string => {
  if (!item.title) return "";
  
  // Handle array format
  if (Array.isArray(item.title)) {
    return item.title[0] || "";
  }
  
  // Handle object format (like { "_": "actual title" })
  if (typeof item.title === "object" && item.title !== null) {
    const titleObj = item.title as { _?: string; [key: string]: unknown };
    return titleObj["_"] || "";
  }
  
  // Handle string format
  return item.title;
};

// Hide an item by adding its title to hiddenItems
export const hideItem = (itemTitle: string) => {
  const localData = getLocallyStoredData();
  const hiddenItems = localData.hiddenItems || [];
  
  if (!hiddenItems.includes(itemTitle)) {
    const updatedHiddenItems = [...hiddenItems, itemTitle];
    storeDataLocally({ ...localData, hiddenItems: updatedHiddenItems });
  }
};

// Unhide an item by removing its title from hiddenItems
export const unhideItem = (itemTitle: string) => {
  const localData = getLocallyStoredData();
  const hiddenItems = localData.hiddenItems || [];
  const updatedHiddenItems = hiddenItems.filter(title => title !== itemTitle);
  storeDataLocally({ ...localData, hiddenItems: updatedHiddenItems });
};

// Clean up hidden items that no longer exist in the current items feed
export const cleanupHiddenItems = (currentItems: RSSItem[]) => {
  const localData = getLocallyStoredData();
  const hiddenItems = localData.hiddenItems || [];
  
  if (hiddenItems.length === 0) return;
  
  // Extract titles from current items
  const currentItemTitles = new Set(currentItems.map(item => extractItemTitle(item)));
  
  // Filter hidden items to keep only those that still exist in the feed
  const validHiddenItems = hiddenItems.filter(hiddenTitle => currentItemTitles.has(hiddenTitle));
  
  // Update storage only if there are changes
  if (validHiddenItems.length !== hiddenItems.length) {
    storeDataLocally({ ...localData, hiddenItems: validHiddenItems });
    console.log(`Cleaned up ${hiddenItems.length - validHiddenItems.length} hidden items that no longer exist`);
  }
};

// Filter out hidden items from a list of items
export const filterHiddenItems = (items: RSSItem[], hiddenItems: string[] = []) => {
  if (hiddenItems.length === 0) return items;
  
  const hiddenItemsSet = new Set(hiddenItems);
  return items.filter(item => {
    const itemTitle = extractItemTitle(item);
    return !hiddenItemsSet.has(itemTitle);
  });
};

// History management functions

// Add a visited link to history
export const addToHistory = (historyItem: HistoryItem) => {
  const localData = getLocallyStoredData();
  const history = localData.history || [];
  
  // Avoid duplicates by checking if the link already exists
  const existingIndex = history.findIndex(item => item.link === historyItem.link);
  
  if (existingIndex !== -1) {
    // Update existing item with new visited time
    history[existingIndex] = { ...historyItem, visitedAt: new Date().toISOString() };
  } else {
    // Add new item to the beginning of the array (most recent first)
    history.unshift({ ...historyItem, visitedAt: new Date().toISOString() });
  }
  
  // Keep only the last 100 history items to prevent storage overflow
  const trimmedHistory = history.slice(0, 100);
  
  storeDataLocally({ ...localData, history: trimmedHistory });
};

// Clear all history
export const clearHistory = () => {
  const localData = getLocallyStoredData();
  storeDataLocally({ ...localData, history: [] });
};

// Remove a specific item from history
export const removeFromHistory = (linkToRemove: string) => {
  const localData = getLocallyStoredData();
  const history = localData.history || [];
  const updatedHistory = history.filter(item => item.link !== linkToRemove);
  storeDataLocally({ ...localData, history: updatedHistory });
};
