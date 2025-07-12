import { ActionTypes, useMainContext } from "../../context/main";
import { Clock, ExternalLink, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { HistoryItem } from "../../types/storage";
import { NavigationTitleWithBack } from "../../components/v2/NavigationTitleWithBack";
import { Navigations } from "../../types/navigation";
import { RoundedIdentifier } from "../../components/v2/RoundedIdentifier";
import Snackbar from "../../components/Snackbar";
import { formatOlderDateTime } from "../../utils/format";

export const History = () => {
  const { state, dispatch } = useMainContext();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Set navigation state when component mounts
  useEffect(() => {
    dispatch({
      type: ActionTypes.SET_NAVIGATION,
      payload: Navigations.HISTORY,
    });
  }, [dispatch]);

  const history = state.history || [];

  const handleLinkClick = (historyItem: HistoryItem) => {
    // Update visit time and open link
    dispatch({
      type: ActionTypes.ADD_TO_HISTORY,
      payload: historyItem,
    });
    window.open(historyItem.link, "_blank");
  };

  const handleRemoveItem = (linkToRemove: string) => {
    dispatch({
      type: ActionTypes.REMOVE_FROM_HISTORY,
      payload: linkToRemove,
    });
  };

  const handleClearHistory = () => {
    dispatch({
      type: ActionTypes.CLEAR_HISTORY,
      payload: null,
    });
    setShowClearConfirm(false);
  };

  const getSourceData = (sourceId: string) => {
    return state.sources.find(source => source.id === sourceId);
  };

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
        <NavigationTitleWithBack label="Historial" />
        
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center px-6">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              No hay historial
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Los enlaces que visites aparecerán aquí
            </p>
          </div>
        </div>
        <Snackbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-black dark:text-white font-sans flex flex-col">
      <NavigationTitleWithBack label="Historial" />
      
      {/* Main Content Container */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-4xl px-6 py-6">
          {/* Clear History Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar historial
            </button>
          </div>

          {/* History Items */}
          <div className="space-y-4">
            {history.map((item, index) => {
              const sourceData = getSourceData(item.source);
              
              return (
                <div
                  key={`${item.link}-${index}`}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {/* Source identifier */}
                    <div className="flex-shrink-0 mt-1">
                      <RoundedIdentifier
                        color={sourceData?.color || "#6b7280"}
                        textColor={sourceData?.textColor || "#ffffff"}
                        initial={sourceData?.initial || "?"}
                        video={sourceData?.type === "video"}
                        extraSmall
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => handleLinkClick(item)}
                        className="group w-full text-left"
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{item.sourceName}</span>
                          <span>•</span>
                          <span>{formatOlderDateTime(item.visitedAt)}</span>
                          <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    </div>
                    
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveItem(item.link)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mx-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Limpiar historial</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ¿Estás seguro de que quieres eliminar todo el historial? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Snackbar />
    </div>
  );
}; 