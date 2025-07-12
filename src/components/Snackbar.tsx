import React, { useEffect, useState } from 'react';

import { ActionTypes } from '../context/main';
import { useMainContext } from '../context/main';
import { useI18n } from '../context/i18n';

const Snackbar: React.FC = () => {
  const { state, dispatch } = useMainContext();
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (state.error) {
      setIsVisible(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [state.error]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch({ type: ActionTypes.CLEAR_ERROR, payload: null });
    }, 300); // Wait for animation to complete
  };

  if (!state.error) return null;

  const getTypeStyles = () => {
    if (!state.error) return 'bg-red-500 text-white';
    switch (state.error.type) {
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'success':
        return 'bg-green-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-red-500 text-white';
    }
  };

  const getIcon = () => {
    if (!state.error) return '❌';
    switch (state.error.type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        ${getTypeStyles()} 
        rounded-lg shadow-lg p-4 flex items-center justify-between`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg">{getIcon()}</span>
        <p className="text-sm font-medium">{state.error.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        aria-label={t('a11y.closeNotification')}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Snackbar; 