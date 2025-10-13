// src/api/apiClient.js
import axios from 'axios';
import { API_BASE, ENDPOINTS, AUTH_STRATEGY } from './apiConfig.js';

// ---------------------------
// Safe token storage
// ---------------------------
const safeStorage = {
  get: (k) => {
    try { return typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null; } catch { return null; }
  },
  set: (k, v) => {
    try { if (typeof localStorage !== 'undefined') localStorage.setItem(k, v); } catch { }
  },
  remove: (k) => {
    try { if (typeof localStorage !== 'undefined') localStorage.removeItem(k); } catch { }
  },
};

const ACCESS_KEY = 'authToken';
const REFRESH_KEY = 'refresh_token';

export const getAuthTokens = () => ({
  accessToken: safeStorage.get(ACCESS_KEY),
  refreshToken: safeStorage.get(REFRESH_KEY),
});

export const setAuthTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) safeStorage.set(ACCESS_KEY, accessToken);
  if (refreshToken) safeStorage.set(REFRESH_KEY, refreshToken);
};

export const clearAuthTokens = () => {
  safeStorage.remove(ACCESS_KEY);
  safeStorage.remove(REFRESH_KEY);
};

// ---------------------------
// API Error
// ---------------------------
export class ApiError extends Error {
  constructor({ data = null, statusText = '', message = '', statusCode = null, config = null }) {
    super(message || statusText || 'API Error');
    this.name = 'ApiError';
    this.data = data;
    this.statusText = statusText;
    this.statusCode = statusCode;
    this.config = config;
  }
}

// ---------------------------
// Axios client
// ---------------------------
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// ---------------------------
// Request interceptor
// ---------------------------
apiClient.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (AUTH_STRATEGY === 'token') {
    const { accessToken } = getAuthTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
  if (!isFormData && !config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json';
  if (!config.headers.Accept) config.headers.Accept = 'application/json';

  return config;
}, (error) => Promise.reject(error));

// ---------------------------
// Response interceptor
// ---------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;
      const originalConfig = error.config || {};

      if (status === 401) {
        clearAuthTokens();
        throw new ApiError({ data, statusText: 'Unauthorized', message: 'Session expired. Please log in again.', statusCode: 401, config: originalConfig });
      }

      const message = data?.message || 'Something went wrong!';
      throw new ApiError({ data, statusText: error.response.statusText, message, statusCode: status, config: originalConfig });
    }

    throw new ApiError({ message: 'Network or unknown error occurred!' });
  }
);

// ---------------------------
// Unified API request wrapper
// ---------------------------
export const apiRequest = async ({
  url,
  method = 'GET',
  data = undefined,
  params = undefined,
  headers = {},
  timeout = undefined,
  responseType = undefined,
  signal = undefined,
}) => {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  const finalHeaders = { ...headers };
  if (!isFormData && !finalHeaders['Content-Type']) finalHeaders['Content-Type'] = 'application/json';

  const resp = await apiClient.request({
    url,
    method,
    data,
    params,
    headers: finalHeaders,
    timeout,
    responseType,
    signal,
  });
  return resp.data;
};

export { apiClient };
