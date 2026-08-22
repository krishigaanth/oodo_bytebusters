/**
 * API Utility Helpers
 * 
 * In a production environment connected to a real backend, these functions would be replaced
 * by an Axios instance or Fetch wrapper configured with baseURL, interceptors, and JWT bearer tokens.
 * 
 * Example Axios setup for real backend:
 * ```ts
 * import axios from 'axios';
 * export const apiClient = axios.create({
 *   baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.dayflow.io/v1',
 *   headers: { 'Content-Type': 'application/json' }
 * });
 * apiClient.interceptors.request.use(config => {
 *   const token = localStorage.getItem('dayflow_token');
 *   if (token) config.headers.Authorization = `Bearer ${token}`;
 *   return config;
 * });
 * ```
 */

export const delay = (ms: number = 300): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getStoredItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
};

export const setStoredItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing key "${key}" to localStorage:`, error);
  }
};

export const removeStoredItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
  }
};
