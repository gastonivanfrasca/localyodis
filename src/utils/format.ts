import { RSSItem } from "../types/rss";

export const formatPubDate = (pubDate: string): string => {
  const date = new Date(pubDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return "Unknown";
  }

  // Format the date for comparison (ignore time)
  const dateStr = date.toDateString();
  const todayStr = today.toDateString();
  const yesterdayStr = yesterday.toDateString();

  if (dateStr === todayStr) {
    return "Today";
  } else if (dateStr === yesterdayStr) {
    return "Yesterday";
  } else {
    // Calculate difference in days
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      // Return formatted date for older items
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }
};

// New function to format time only
export const formatTime = (pubDate: string): string => {
  const date = new Date(pubDate);
  
  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// New function to get date category for grouping
export const getDateCategory = (pubDate: string): string => {
  const date = new Date(pubDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return "unknown";
  }

  // Format the date for comparison (ignore time)
  const dateStr = date.toDateString();
  const todayStr = today.toDateString();
  const yesterdayStr = yesterday.toDateString();

  if (dateStr === todayStr) {
    return "today";
  } else if (dateStr === yesterdayStr) {
    return "yesterday";
  } else {
    // Return formatted date for older items
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== today.getFullYear() ? '2-digit' : undefined
    });
  }
};

// New function to format date separator labels
export const formatDateSeparator = (category: string): string => {
  if (category === "today") {
    return "today";
  } else if (category === "yesterday") {
    return "yesterday";
  } else if (category === "unknown") {
    return "unknown date";
  } else {
    return category;
  }
};

// New type for grouped items with separators
export type ItemWithSeparator = {
  type: 'item' | 'separator';
  data?: RSSItem; // The RSSItem for type 'item'
  category?: string; // Date category for separators
};

// New function to group items by date with separators
export const groupItemsByDateWithSeparators = (items: RSSItem[]): ItemWithSeparator[] => {
  if (!items || items.length === 0) return [];

  const grouped: ItemWithSeparator[] = [];
  let currentCategory: string | null = null;

  // Sort items by date (newest first)
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.pubDate || '').getTime();
    const dateB = new Date(b.pubDate || '').getTime();
    return dateB - dateA;
  });

  sortedItems.forEach((item) => {
    const category = getDateCategory(item.pubDate || '');
    
    // Add separator if this is a new category
    if (category !== currentCategory) {
      grouped.push({
        type: 'separator',
        category: category
      });
      currentCategory = category;
    }
    
    // Add the item
    grouped.push({
      type: 'item',
      data: item
    });
  });

  return grouped;
};

// Función para calcular el color del texto basado en el brillo del color de fondo
export const generateTextColorForBackground = (bgColor: string): string => {
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness >= 128 ? "#000000" : "#ffffff";
};
  
