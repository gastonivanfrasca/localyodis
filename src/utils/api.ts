export const API_BASE_URL = import.meta.env.VITE_SERVER_BASEPATH;

export const getApiUrl = (path: string) => {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
