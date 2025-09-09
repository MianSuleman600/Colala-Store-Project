// src/api/apiClient.js
import axios from 'axios';
import { API_BASE, SITE_BASE, ENDPOINTS, AUTH_STRATEGY } from './apiConfig.js';

// Safe storage for SSR compatibility
const safeStorage = {
  get: (k) => {
    try {
      if (typeof localStorage !== 'undefined') return localStorage.getItem(k);
    } catch {}
    return null;
  },
  set: (k, v) => {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(k, v);
    } catch {}
  },
  remove: (k) => {
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(k);
    } catch {}
  },
};

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const getAuthTokens = () => ({
  accessToken: safeStorage.get(ACCESS_KEY),
  refreshToken: safeStorage.get(REFRESH_KEY),
});

export const setAuthTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) safeStorage.set(ACCESS_KEY, accessToken);
  if (refreshToken) safeStorage.set(REFRESH_KEY, refreshToken);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('AUTH_TOKENS_UPDATED', { detail: { accessToken, refreshToken } })
    );
  }
};

export const clearAuthTokens = () => {
  safeStorage.remove(ACCESS_KEY);
  safeStorage.remove(REFRESH_KEY);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('AUTH_LOGOUT'));
  }
};

const emitAlert = (message, type = 'error') => {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
    }
  } catch {}
};

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

// Base clients
const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 30000,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

const refreshClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 15000,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Sanctum: ensure CSRF cookie before mutating requests
let csrfReady = false;
let lastCsrfAt = 0;
const CSRF_TTL = 1000 * 60 * 10; // 10 minutes

const ensureCsrfCookie = async () => {
  if (AUTH_STRATEGY !== 'sanctum') return;
  if (typeof window === 'undefined') return; // only in browser
  const now = Date.now();
  if (csrfReady && now - lastCsrfAt < CSRF_TTL) return;
  await axios.get(ENDPOINTS.AUTH.CSRF_COOKIE, {
    withCredentials: true,
  });
  csrfReady = true;
  lastCsrfAt = now;
};

// Attach auth headers + content type
apiClient.interceptors.request.use(
  async (config) => {
    config.headers = config.headers || {};

    // Attach Authorization header only for token strategy
    if (AUTH_STRATEGY === 'token') {
      const { accessToken } = getAuthTokens();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    // For Sanctum, ensure CSRF cookie exists for state-changing requests
    const method = (config.method || 'get').toUpperCase();
    if (AUTH_STRATEGY === 'sanctum' && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      await ensureCsrfCookie();
    }

    // Set JSON header when not FormData
    const isFormData =
      typeof FormData !== 'undefined' && config.data && config.data instanceof FormData;
    if (!isFormData && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    if (!config.headers.Accept) config.headers.Accept = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh handling (token strategy)
let isRefreshing = false;
let refreshWaitQueue = [];

const notifyRefreshed = () => {
  refreshWaitQueue.forEach((cb) => {
    try {
      cb(null);
    } catch {}
  });
  refreshWaitQueue = [];
};
const notifyRefreshFailed = (err) => {
  refreshWaitQueue.forEach((cb) => {
    try {
      cb(err);
    } catch {}
  });
  refreshWaitQueue = [];
};

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const aggregateValidationErrors = (data) => {
  if (!data) return null;
  if (data.errors && typeof data.errors === 'object') {
    const msgs = [];
    Object.entries(data.errors).forEach(([field, arr]) => {
      if (Array.isArray(arr)) arr.forEach((m) => msgs.push(`${field}: ${m}`));
      else if (arr) msgs.push(`${field}: ${String(arr)}`);
    });
    if (msgs.length) return msgs.join('\n');
  }
  return data.message || null;
};

const getErrorMessage = (data, status) => {
  const valMsg = aggregateValidationErrors(data);
  if (valMsg) return valMsg;

  if (typeof data === 'string') return data;

  if (status === 401) return 'Unauthenticated. Please log in again.';
  if (status === 403) return 'Forbidden. You do not have access.';
  if (status === 404) return 'Resource not found.';
  if (status === 419) return 'Page expired. Refreshing security token...';
  if (status === 422) return 'Validation failed.';
  if (status === 429) return 'Too many requests. Please slow down.';
  if (status >= 500) return 'Server error. Please try again later.';
  return 'Something went wrong!';
};

const extractAccessToken = (respData) =>
  respData?.access_token ||
  respData?.accessToken ||
  respData?.token ||
  (respData?.data && (respData.data.access_token || respData.data.token)) ||
  null;

const extractRefreshToken = (respData) =>
  respData?.refresh_token ||
  respData?.refreshToken ||
  (respData?.data && (respData.data.refresh_token || respData.data.refreshToken)) ||
  null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Axios error with response
    if (axios.isAxiosError(error) && error.response) {
      const { data, status, statusText } = error.response;
      const originalConfig = error.config || {};

      // 419 (CSRF mismatch) handling for Sanctum
      if (AUTH_STRATEGY === 'sanctum' && status === 419 && !originalConfig._csrfRetry) {
        try {
          await ensureCsrfCookie();
          originalConfig._csrfRetry = true;
          return apiClient.request(originalConfig);
        } catch (e) {
          const msg = 'Failed to refresh security token.';
          emitAlert(msg, 'error');
          throw new ApiError({
            data,
            statusText,
            message: msg,
            statusCode: status,
            config: originalConfig,
          });
        }
      }

      // 401 handling
      const isAuthRoute =
        originalConfig?.url?.includes('/auth/login') ||
        originalConfig?.url?.includes('/auth/refresh') ||
        originalConfig?.url?.includes('/login') ||
        originalConfig?.url?.includes('/logout');

      if (status === 401 && !isAuthRoute) {
        if (AUTH_STRATEGY === 'token') {
          // Token strategy: attempt refresh token
          if (originalConfig._retry) {
            // Already retried, fail out
            clearAuthTokens();
            const msg = 'Session expired. Please log in again.';
            emitAlert(msg, 'error');
            throw new ApiError({
              data,
              statusText,
              message: msg,
              statusCode: status,
              config: originalConfig,
            });
          }

          const { accessToken, refreshToken } = getAuthTokens();
          if (!refreshToken && !accessToken) {
            clearAuthTokens();
            const msg = getErrorMessage(data, status);
            emitAlert(msg, 'error');
            throw new ApiError({
              data,
              statusText,
              message: msg,
              statusCode: status,
              config: originalConfig,
            });
          }

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              refreshWaitQueue.push((err) => {
                if (err) return reject(err);
                const { accessToken: latest } = getAuthTokens() || {};
                originalConfig.headers = originalConfig.headers || {};
                originalConfig.headers.Authorization = latest ? `Bearer ${latest}` : undefined;
                originalConfig._retry = true;
                resolve(apiClient.request(originalConfig));
              });
            });
          }

          isRefreshing = true;
          try {
            // Some Laravel JWT implementations expect Authorization Bearer on refresh;
            // others expect refresh token in body. We support both.
            const headers = {};
            if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
            const resp = await refreshClient.post(
              ENDPOINTS.AUTH.REFRESH,
              refreshToken ? { refresh_token: refreshToken } : {},
              { headers }
            );
            const newAccess = extractAccessToken(resp?.data);
            const newRefresh = extractRefreshToken(resp?.data);

            if (!newAccess) throw new Error('No access token in refresh response');

            setAuthTokens({ accessToken: newAccess, refreshToken: newRefresh || refreshToken });
            isRefreshing = false;
            notifyRefreshed();

            originalConfig.headers = originalConfig.headers || {};
            originalConfig.headers.Authorization = `Bearer ${newAccess}`;
            originalConfig._retry = true;
            return apiClient.request(originalConfig);
          } catch (refreshErr) {
            isRefreshing = false;
            notifyRefreshFailed(refreshErr);
            clearAuthTokens();
            const msg = 'Session expired. Please log in again.';
            emitAlert(msg, 'error');
            throw new ApiError({
              data,
              statusText: 'Unauthorized',
              message: msg,
              statusCode: 401,
              config: originalConfig,
            });
          }
        } else {
          // Sanctum strategy: 401 means session expired
          const msg = 'Unauthenticated. Please log in again.';
          emitAlert(msg, 'error');
          throw new ApiError({
            data,
            statusText,
            message: msg,
            statusCode: status,
            config: originalConfig,
          });
        }
      }

      // 429 backoff (simple retry once or twice)
      if (status === 429) {
        const retryCount = originalConfig._retryCount || 0;
        const retryAfterHeader = error.response.headers?.['retry-after'];
        const delayMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : 1000 + retryCount * 500;
        if (retryCount < 2) {
          await wait(delayMs);
          originalConfig._retryCount = retryCount + 1;
          return apiClient.request(originalConfig);
        }
      }

      const message = getErrorMessage(data, status);
      emitAlert(message, 'error');
      throw new ApiError({
        data,
        statusText,
        message,
        statusCode: status,
        config: originalConfig,
      });
    }

    // Network/unknown error
    const msg = 'Network or unknown error occurred!';
    emitAlert(msg, 'error');
    throw new ApiError({ data: null, statusText: 'Network Error', message: msg, statusCode: null });
  }
);

// Unified request wrapper (uses apiClient so interceptors apply)
export const apiRequest = async ({
  url,
  method = 'GET',
  data = undefined,
  params = undefined,
  headers = {},
  timeout = undefined,
  withCredentials = undefined,
  responseType = undefined,
  signal = undefined,
}) => {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  const finalHeaders = { ...headers };
  if (!isFormData && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  const resp = await apiClient.request({
    url,
    method,
    data,
    params,
    headers: finalHeaders,
    timeout,
    withCredentials,
    responseType,
    signal,
  });
  return resp.data;
};

export { apiClient };