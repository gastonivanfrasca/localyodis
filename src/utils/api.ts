export const API_BASE_URL = import.meta.env.SERVER_BASEPATH || 'http://localhost:4000';

export const getApiUrl = (path: string) => {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};