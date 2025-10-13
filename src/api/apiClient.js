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

export const getAuthTokens = () => {
  // Try localStorage first, then sessionStorage as fallback
  let accessToken = safeStorage.get(ACCESS_KEY);
  let refreshToken = safeStorage.get(REFRESH_KEY);
  
  // If not found in localStorage, try sessionStorage
  if (!accessToken) {
    try {
      if (typeof sessionStorage !== 'undefined') {
        accessToken = sessionStorage.getItem(ACCESS_KEY);
      }
    } catch (e) {
      console.warn('Could not access sessionStorage:', e);
    }
  }
  
  if (!refreshToken) {
    try {
      if (typeof sessionStorage !== 'undefined') {
        refreshToken = sessionStorage.getItem(REFRESH_KEY);
      }
    } catch (e) {
      console.warn('Could not access sessionStorage:', e);
    }
  }
  
  console.log('Retrieved auth tokens:', { 
    hasAccessToken: !!accessToken, 
    hasRefreshToken: !!refreshToken,
    accessTokenLength: accessToken?.length || 0
  });
  
  return {
    accessToken,
    refreshToken,
  };
};

export const setAuthTokens = ({ accessToken, refreshToken }) => {
  console.log('Storing auth tokens:', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
  
  if (accessToken) {
    safeStorage.set(ACCESS_KEY, accessToken);
    // Also store in sessionStorage as backup
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(ACCESS_KEY, accessToken);
      }
    } catch (e) {
      console.warn('Could not store token in sessionStorage:', e);
    }
  }
  if (refreshToken) {
    safeStorage.set(REFRESH_KEY, refreshToken);
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(REFRESH_KEY, refreshToken);
      }
    } catch (e) {
      console.warn('Could not store refresh token in sessionStorage:', e);
    }
  }
};

export const clearAuthTokens = () => {
  safeStorage.remove(ACCESS_KEY);
  safeStorage.remove(REFRESH_KEY);
  // Also clear from sessionStorage
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(ACCESS_KEY);
      sessionStorage.removeItem(REFRESH_KEY);
    }
  } catch (e) {
    console.warn('Could not clear tokens from sessionStorage:', e);
  }
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
