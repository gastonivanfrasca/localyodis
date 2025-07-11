import { Calendar, Check, Edit3, Palette, Rss, Trash2, X, Youtube } from "lucide-react";
import { extractItemTitle, filterHiddenItems } from "../../utils/storage";
import { fetchRSS, getRSSItemStrProp } from "../../utils/rss";
import { formatPubDate, generateTextColorForBackground, groupItemsByDateWithSeparators } from "../../utils/format";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { ActionTypes } from "../../context/main";
import { ColorPicker } from "../../components/v2/ColorPicker";
import { DateSeparator } from "../../components/v2/DateSeparator";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { PubListItem } from "../../components/v2/PubListItem";
import { RSSItem } from "../../types/rss";
import { RoundedIdentifier } from "../../components/v2/RoundedIdentifier";
import Snackbar from "../../components/Snackbar";
import { errorMap } from "../../utils/errors";
import { useError } from "../../utils/useError";
import { useMainContext } from "../../context/main";

export const SourceProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useMainContext();
  const { showError } = useError();
  const navigate = useNavigate();
  const [sourceItems, setSourceItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [isEditingColor, setIsEditingColor] = useState(false);
  const [editingColor, setEditingColor] = useState("");

  // Find the source by ID - memoize to prevent re-creation
  const source = useMemo(() => {
    return state.sources.find(s => s.id === id);
  }, [state.sources, id]);

  // Memoize the error handler to prevent re-creation
  const handleError = useCallback(() => {
    showError(errorMap.fetchRSSItems);
  }, [showError]);

  // Memoize the extractLink function to prevent re-creation
  const extractLink = useCallback((item: RSSItem): string => {
    if (Array.isArray(item.link) && item.link.length > 0) {
      if (typeof item.link[0] === "object" && item.link[0]["$"]) {
        return item.link[0]["$"].href;
      }
      if (typeof item.link[0] === "string") return item.link[0];
    }

    if (typeof item.link === "string") return item.link;

    return item.id || "";
  }, []);

  // Memoize bookmark functions to prevent re-creation
  const handleBookmark = useCallback((item: RSSItem) => {
    const newBookmark = {
      title: getRSSItemStrProp(item, "title"),
      link: extractLink(item),
      source: item.source,
      pubDate: getRSSItemStrProp(item, "pubDate"),
    };
    dispatch({
      type: ActionTypes.SET_BOOKMARKS,
      payload: [...state.bookmarks, newBookmark],
    });
  }, [state.bookmarks, dispatch, extractLink]);

  const handleUnbookmark = useCallback((item: RSSItem) => {
    const updatedBookmarks = state.bookmarks.filter(
      (bookmark) => bookmark.link !== extractLink(item)
    );
    dispatch({
      type: ActionTypes.SET_BOOKMARKS,
      payload: updatedBookmarks,
    });
  }, [state.bookmarks, dispatch, extractLink]);

  const isBookmarked = useCallback((item: RSSItem) => {
    const bookmark = state.bookmarks?.find((bookmark) => {
      const bookmarkLink = bookmark.link;
      const itemLink = extractLink(item);
      return bookmarkLink === itemLink;
    });
    return bookmark ? item : undefined;
  }, [state.bookmarks, extractLink]);

  const handleRemoveSource = useCallback(() => {
    if (!source) return;
    
    // Remove source from sources array
    const updatedSources = state.sources.filter(s => s.id !== source.id);
    dispatch({
      type: ActionTypes.SET_SOURCES,
      payload: updatedSources,
    });

    // Remove source from active sources
    const updatedActiveSources = state.activeSources.filter(id => id !== source.id);
    dispatch({
      type: ActionTypes.SET_ACTIVE_SOURCES,
      payload: updatedActiveSources,
    });

    // Navigate back to sources page
    navigate('/sources');
  }, [source, state.sources, state.activeSources, dispatch, navigate]);

  const handleHide = useCallback((item: RSSItem) => {
    dispatch({
      type: ActionTypes.HIDE_ITEM,
      payload: item,
    });
    
    // Remove item from sourceItems immediately
    const itemTitle = extractItemTitle(item);
    const filteredItems = sourceItems.filter(sourceItem => extractItemTitle(sourceItem) !== itemTitle);
    setSourceItems(filteredItems);
  }, [dispatch, sourceItems]);

  // Handle name editing functions
  const handleStartEdit = useCallback(() => {
    if (!source) return;
    setEditingName(source.name || "");
    setIsEditing(true);
  }, [source]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditingName("");
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!source || !editingName.trim()) return;
    
    dispatch({
      type: ActionTypes.UPDATE_SOURCE,
      payload: {
        id: source.id,
        name: editingName.trim(),
        initial: editingName.trim()[0]?.toUpperCase() || source.initial
      }
    });
    
    setIsEditing(false);
    setEditingName("");
  }, [source, editingName, dispatch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  }, [handleSaveEdit, handleCancelEdit]);

  // Handle color editing functions
  const handleStartColorEdit = useCallback(() => {
    if (!source) return;
    setEditingColor(source.color);
    setIsEditingColor(true);
  }, [source]);

  const handleColorSelect = useCallback((color: string) => {
    if (!source) return;
    
    const textColor = generateTextColorForBackground(color);
    
    dispatch({
      type: ActionTypes.UPDATE_SOURCE,
      payload: {
        id: source.id,
        color: color,
        textColor: textColor
      }
    });
  }, [source, dispatch]);

  const handleColorPickerClose = useCallback(() => {
    setIsEditingColor(false);
    setEditingColor("");
  }, []);

  useEffect(() => {
    const fetchSourceItems = async () => {
      if (!source) return;
      
      setLoading(true);
      try {
        const items = await fetchRSS([{ id: source.id, url: source.url }]);
        setSourceItems(items);
      } catch {
        handleError();
      } finally {
        setLoading(false);
      }
    };

    fetchSourceItems();
  }, [source?.id, source?.url]);

  if (!source) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
        <NavigationTitleWithBack label="Source Not Found" />
        <div className="flex-1 flex justify-center items-center pt-16">
          <div className="text-center">
            <p className="text-lg text-gray-900 dark:text-gray-200">Source not found</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">The source you're looking for doesn't exist.</p>
          </div>
        </div>
        <Snackbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label={source.name || "Source Profile"} />
      
      {/* Main Content Container - Centered on Desktop */}
      <div className="flex-1 flex justify-center pt-16">
        <div className="w-full max-w-4xl px-6 flex flex-col gap-6 py-6">
          
          {/* Source Header */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex flex-col items-center gap-2">
                <RoundedIdentifier
                  color={source.color}
                  textColor={source.textColor}
                  initial={source.initial}
                  video={source.type === "video"}
                  small={false}
                />
                {isEditingColor ? (
                  <div className="flex flex-col items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <ColorPicker 
                      selectedColor={editingColor}
                      onColorSelect={handleColorSelect}
                      className="max-w-xs"
                    />
                    <button
                      onClick={handleColorPickerClose}
                      className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStartColorEdit}
                    className="p-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition-colors"
                    title="Edit color"
                  >
                    <Palette className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="text-xl md:text-2xl font-bold bg-transparent border-b-2 border-blue-500 dark:border-blue-400 text-gray-900 dark:text-white focus:outline-none flex-1 min-w-0"
                      placeholder="Enter source name"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="p-1 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 transition-colors"
                      title="Save changes"
                      disabled={!editingName.trim()}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 rounded-lg bg-gray-50 dark:bg-gray-900/20 hover:bg-gray-100 dark:hover:bg-gray-900/40 text-gray-600 dark:text-gray-400 transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate flex-1">
                      {source.name || "Unnamed Source"}
                    </h1>
                    <button
                      onClick={handleStartEdit}
                      className="p-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition-colors"
                      title="Edit name"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {source.type === "video" ? (
                    <Youtube className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <Rss className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="capitalize">{source.type} Feed</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Added on {formatPubDate(source.addedOn)}</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={handleRemoveSource}
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors"
                  title="Remove source"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Source Items */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Items ({sourceItems.length})
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : sourceItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No items found for this source.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groupItemsByDateWithSeparators(filterHiddenItems(sourceItems, state.hiddenItems)).map((groupedItem, index) => {
                  if (groupedItem.type === 'separator') {
                    return (
                      <DateSeparator 
                        key={`separator-${groupedItem.category}-${index}`}
                        category={groupedItem.category || 'unknown'}
                      />
                    );
                  }
                  
                  const item = groupedItem.data!;
                  const sourceData = state.sources.find(s => s.id === item.source);
                  return (
                    <PubListItem
                      key={`${item.link}-${index}`}
                      item={item}
                      index={index}
                      sourceData={sourceData}
                      bookmark={isBookmarked(item)}
                      onBookmark={() => handleBookmark(item)}
                      onUnbookmark={() => handleUnbookmark(item)}
                      onHide={handleHide}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Snackbar />
    </div>
  );
}; 