import { ActionTypes } from '../context/main';
import { ErrorState } from '../types/storage';
import { useMainContext } from '../context/main';

export const useError = () => {
  const { dispatch } = useMainContext();

  const showError = (message: string, type: 'error' | 'warning' | 'success' | 'info' = 'error') => {
    const error: ErrorState = {
      message,
      type
    };
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR, payload: null });
  };

  return { showError, clearError };
}; 