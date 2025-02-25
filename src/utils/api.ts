export const API_BASE_URL = import.meta.env.SERVER_BASEPATH || 'https://localyodisserver.vercel.app';

export const getApiUrl = (path: string) => {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};