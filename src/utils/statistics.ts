import type { HistoryItem, Source } from "../types/storage";

export type SourceStatistics = {
  sourceId: string;
  sourceName: string;
  totalVisits: number;
  lastVisit: string;
  firstVisit: string;
  color?: string;
  textColor?: string;
  initial?: string;
};

export type StatisticsSummary = {
  totalVisits: number;
  uniqueSources: number;
  mostActiveSource: SourceStatistics | null;
  leastActiveSource: SourceStatistics | null;
  sourceStats: SourceStatistics[];
  lastSevenDays: {
    date: string;
    visits: number;
  }[];
};

/**
 * Calculates source statistics from history data
 */
export const calculateSourceStatistics = (
  history: HistoryItem[],
  sources: Source[]
): StatisticsSummary => {
  if (!history || history.length === 0) {
    return {
      totalVisits: 0,
      uniqueSources: 0,
      mostActiveSource: null,
      leastActiveSource: null,
      sourceStats: [],
      lastSevenDays: generateLastSevenDays([]),
    };
  }

  // Group history by source
  const sourceGroups = new Map<string, HistoryItem[]>();
  
  history.forEach(item => {
    const sourceId = item.source;
    if (!sourceGroups.has(sourceId)) {
      sourceGroups.set(sourceId, []);
    }
    sourceGroups.get(sourceId)!.push(item);
  });

  // Calculate statistics for each source
  const sourceStats: SourceStatistics[] = [];
  
  sourceGroups.forEach((items, sourceId) => {
    const source = sources.find(s => s.id === sourceId);
    const sortedItems = items.sort((a, b) => 
      new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime()
    );

    const stat: SourceStatistics = {
      sourceId,
      sourceName: source?.name || items[0]?.sourceName || 'Unknown Source',
      totalVisits: items.length,
      firstVisit: sortedItems[0].visitedAt,
      lastVisit: sortedItems[sortedItems.length - 1].visitedAt,
      color: source?.color,
      textColor: source?.textColor,
      initial: source?.initial,
    };

    sourceStats.push(stat);
  });

  // Sort by total visits (descending)
  sourceStats.sort((a, b) => b.totalVisits - a.totalVisits);

  // Find most and least active sources
  const mostActiveSource = sourceStats[0] || null;
  const leastActiveSource = sourceStats.length > 1 ? sourceStats[sourceStats.length - 1] : null;

  // Calculate last 7 days activity
  const lastSevenDays = generateLastSevenDays(history);

  return {
    totalVisits: history.length,
    uniqueSources: sourceStats.length,
    mostActiveSource,
    leastActiveSource,
    sourceStats,
    lastSevenDays,
  };
};

/**
 * Generates daily visit counts for the last 7 days
 */
function generateLastSevenDays(history: HistoryItem[]) {
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const visitsOnDay = history.filter(item => {
      const visitDate = new Date(item.visitedAt);
      return visitDate >= date && visitDate < nextDay;
    }).length;

    days.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      visits: visitsOnDay,
    });
  }

  return days;
}

/**
 * Formats a date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }
};

/**
 * Formats day of week for display
 */
export const formatDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) return 'Today';
  if (daysDiff === 1) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};
