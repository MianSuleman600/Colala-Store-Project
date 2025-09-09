import { useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../index.js';
import { normalizeServices } from '../../utils/dataNormalizer.js';

const getToken = () => localStorage.getItem('access_token') || '';

/**
 * Create a new service with normalized response
 */
export const useCreateService = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => serviceService.createService(payload, getToken()),
    onSuccess: (data) => {
      const normalized = normalizeServices([data])[0];
      queryClient.invalidateQueries(['services']);
      options?.onSuccess?.(normalized);
    },
    onError: (error) => {
      console.error('Create Service Error:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Update a service and refresh caches
 */
export const useUpdateService = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, payload }) =>
      serviceService.updateService(serviceId, payload, getToken()),
    onSuccess: (data, variables) => {
      const normalized = normalizeServices([data])[0];
      queryClient.setQueryData(['service', variables.serviceId], normalized);
      queryClient.invalidateQueries(['services']);
      options?.onSuccess?.(normalized);
    },
    onError: (error) => {
      console.error('Update Service Error:', error);
      options?.onError?.(error);
    },
  });
};

/**
 * Delete a service and invalidate cache
 */
export const useDeleteService = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId }) => serviceService.deleteService(serviceId, getToken()),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['services']);
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error('Delete Service Error:', error);
      options?.onError?.(error);
    },
  });
};
