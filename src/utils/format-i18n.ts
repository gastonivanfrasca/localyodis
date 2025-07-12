import type { SupportedLanguage } from '../types/i18n';
import { getTranslation } from '../i18n';

// Internationalized date formatting utilities
export const formatPubDateI18n = (pubDate: string, language: SupportedLanguage): string => {
  const date = new Date(pubDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return getTranslation(language, 'time.unknown');
  }

  // Format the date for comparison (ignore time)
  const dateStr = date.toDateString();
  const todayStr = today.toDateString();
  const yesterdayStr = yesterday.toDateString();

  if (dateStr === todayStr) {
    return getTranslation(language, 'common.today');
  } else if (dateStr === yesterdayStr) {
    return getTranslation(language, 'common.yesterday');
  } else {
    // Calculate difference in days
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      if (diffDays === 1) {
        return `1 ${getTranslation(language, 'time.dayAgo')}`;
      } else {
        return `${diffDays} ${getTranslation(language, 'time.daysAgo')}`;
      }
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

// Internationalized time formatting
export const formatTimeI18n = (pubDate: string, language: SupportedLanguage): string => {
  const date = new Date(pubDate);
  
  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return getTranslation(language, 'time.unknown');
  }

  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// Internationalized date category for grouping
export const getDateCategoryI18n = (pubDate: string): string => {
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

// Internationalized date separator formatting
export const formatDateSeparatorI18n = (category: string, language: SupportedLanguage): string => {
  if (category === "today") {
    return getTranslation(language, 'time.today');
  } else if (category === "yesterday") {
    return getTranslation(language, 'time.yesterday');
  } else if (category === "unknown") {
    return getTranslation(language, 'time.unknownDate');
  } else {
    return category;
  }
}; 