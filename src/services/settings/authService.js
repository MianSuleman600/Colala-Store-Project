// D:\Project\frontend\src\services\settings\authService.js
import { apiRequest, clearAuthTokens } from '../api/apiClient.js';
import { ENDPOINTS } from '../../api/apiConfig.js';

const emitToast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

export const authService = {
  logout: async () => {
    try {
      await apiRequest({ url: ENDPOINTS.AUTH.LOGOUT, method: 'POST' });
      emitToast('success', 'Logged out successfully');
    } catch (err) {
      // If server fails, still clear tokens client-side
      emitToast('error', err?.message || 'Logout failed. Clearing session.');
    } finally {
      clearAuthTokens();
    }
    return { success: true };
  },

  deleteAccount: async () => {
    try {
      await apiRequest({ url: ENDPOINTS.USERS.DELETE_ACCOUNT, method: 'DELETE' });
      emitToast('success', 'Account deleted');
      clearAuthTokens();
      return { success: true };
    } catch (err) {
      emitToast('error', err?.message || 'Failed to delete account');
      throw err;
    }
  },
};

export default authService;