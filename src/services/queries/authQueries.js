// src/services/queries/authQueries.js
import { useMutation } from '@tanstack/react-query';
import { authService } from '../authService';

// Auth-only mutations (store profile moved to storeProfile hooks)
export const useRegisterUserMutation = (options = {}) => {
  return useMutation({
    mutationFn: (formData) => authService.register(formData),
    ...options,
  });
};

export const useLoginUserMutation = (options = {}) => {
  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    ...options,
  });
};

export const useLogoutMutation = (options = {}) => {
  return useMutation({
    mutationFn: () => authService.logout(),
    ...options,
  });
};