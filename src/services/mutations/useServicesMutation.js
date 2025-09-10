import { useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../index.js';
import { normalizeServices } from '../../utils/dataNormalizer.js';

const getToken = () => (typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : '') || '';

/**
 * Create a new service (supports FormData or JSON payload)
 */
export const useCreateService = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      // payload can be FormData (preferred for images/video) or JSON
      return serviceService.createService(payload, getToken());
    },
    onSuccess: (data) => {
      const normalized = normalizeServices([data?.service || data])[0] || null;
      // Invalidate list; optionally set cache for detail
      queryClient.invalidateQueries({ queryKey: ['services'] });
      if (normalized?.id) {
        queryClient.setQueryData(['service', normalized.id], normalized);
      }
      options?.onSuccess?.(normalized);
    },
    onError: (error) => {
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
    mutationFn: async ({ serviceId, payload }) => serviceService.updateService(serviceId, payload, getToken()),
    onSuccess: (data, variables) => {
      const normalized = normalizeServices([data?.service || data])[0] || null;
      if (variables?.serviceId) {
        queryClient.setQueryData(['service', variables.serviceId], normalized);
      }
      queryClient.invalidateQueries({ queryKey: ['services'] });
      options?.onSuccess?.(normalized);
    },
    onError: (error) => {
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
      if (variables?.serviceId) {
        queryClient.removeQueries({ queryKey: ['service', variables.serviceId] });
      }
      queryClient.invalidateQueries({ queryKey: ['services'] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};