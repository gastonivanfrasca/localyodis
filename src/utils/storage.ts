import { LocallyStoredData } from "../types/storage";
import { Navigations } from "../types/navigation";

// Storage configuration to prevent QuotaExceededError
export const STORAGE_CONFIG = {
  MAX_ITEMS_PER_SOURCE: 50,    // Máximo de items por fuente RSS (solo informativo, no se aplica)
  MAX_TOTAL_ITEMS: 300,        // Máximo total de items en storage
  CLEANUP_KEEP_ITEMS: 30,      // Cuántos items mantener al limpiar por fuente
  CLEANUP_KEEP_TOTAL: 200,     // Cuántos items mantener al limpiar en total
} as const;

const defaultLocallyStoredData = {
  theme: "dark",
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
