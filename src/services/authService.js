// src/services/authService.js
import { apiRequest, clearAuthTokens } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

const emitToast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

const service = {
  register: (formData) =>
    apiRequest({ url: ENDPOINTS.AUTH.SIGNUP, method: 'POST', data: formData }),

  login: ({ email, password }) =>
    apiRequest({ url: ENDPOINTS.AUTH.LOGIN, method: 'POST', data: { email, password } }),

  refresh: () =>
    apiRequest({ url: ENDPOINTS.AUTH.REFRESH, method: 'POST' }),

  logout: async ({ withToast = true } = {}) => {
    try {
      await apiRequest({ url: ENDPOINTS.AUTH.LOGOUT, method: 'POST' });
      if (withToast) emitToast('success', 'Logged out successfully');
    } catch (err) {
      if (withToast) emitToast('error', err?.message || 'Logout failed. Clearing session.');
    } finally {
      clearAuthTokens();
    }
    return { success: true };
  },

  // NEW: password reset flow
  requestPasswordReset: async (email) => {
    if (!email) throw new Error('Email is required');
    return apiRequest({
      url: ENDPOINTS.AUTH.PASSWORD.RESET_REQUEST,
      method: 'POST',
      data: { email },
    });
  },

  verifyPasswordResetOtp: async ({ email, otp }) => {
    if (!email || !otp) throw new Error('Email and code are required');
    return apiRequest({
      url: ENDPOINTS.AUTH.PASSWORD.RESET_VERIFY,
      method: 'POST',
      data: { email, otp },
    });
  },

  resetPasswordWithOtp: async ({ email, otp, newPassword }) => {
    if (!email || !otp || !newPassword) throw new Error('Missing credentials');
    return apiRequest({
      url: ENDPOINTS.AUTH.PASSWORD.RESET_CONFIRM,
      method: 'POST',
      data: { email, otp, newPassword },
    });
  },
};

// Backward-compatible aliases
service.registerUser = service.register;
service.loginUser = service.login;
service.refreshToken = service.refresh;
service.logoutUser = service.logout;

export const authService = service;