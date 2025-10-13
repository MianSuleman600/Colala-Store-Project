import { useMutation } from '@tanstack/react-query';
import { authService } from '../authService';

export const useLoginUserMutation = (options = {}) => {
  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    ...options,
  });
};

export const useSendResetCodeMutation = (options = {}) => {
  return useMutation({
    mutationFn: (data) => authService.sendResetCode(data),
    ...options,
  });
};

export const useVerifyResetCodeMutation = (options = {}) => {
  return useMutation({
    mutationFn: (data) => authService.verifyResetCode(data),
    ...options,
  });
};

export const useResetPasswordMutation = (options = {}) => {
  return useMutation({
    mutationFn: (data) => authService.resetPassword(data),
    ...options,
  });
};

export const useLogoutMutation = (options = {}) => {
  return useMutation({
    mutationFn: () => authService.logout(),
    ...options,
  });
};