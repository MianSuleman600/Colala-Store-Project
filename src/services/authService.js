// src/services/authService.js

import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

export const authService = {
  login: (credentials) => apiRequest({
    url: ENDPOINTS.AUTH.LOGIN,
    method: 'POST',
    data: credentials,
  }),
  
  sendResetCode: (data) => apiRequest({
    url: ENDPOINTS.AUTH.PASSWORD.RESET_REQUEST,
    method: 'POST',
    data,
  }),
  
  verifyResetCode: (data) => apiRequest({
    url: ENDPOINTS.AUTH.PASSWORD.RESET_VERIFY,
    method: 'POST',
    data,
  }),
  
  resetPassword: (data) => apiRequest({
    url: ENDPOINTS.AUTH.PASSWORD.RESET_CONFIRM,
    method: 'POST',
    data,
  }),
  
  logout: () => apiRequest({
    url: ENDPOINTS.AUTH.LOGOUT,
    method: 'POST',
  }),

  deleteAccount: () => apiRequest({
    url: ENDPOINTS.AUTH.DELETE_ACCOUNT,
    method: 'POST', // Assuming POST based on your previous backend code. Change to 'DELETE' if needed.
  }),
};