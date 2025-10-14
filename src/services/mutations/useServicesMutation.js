import { useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../index.js'; // Assuming this is your service API functions


const getToken = () => (typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : '') || '';

export const useCreateService = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => serviceService.createService(payload, getToken()),
    onSuccess: (data) => {
      // ✅ Return the RAW data from the API. The component will handle it.
      queryClient.invalidateQueries({ queryKey: ['services'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => options?.onError?.(error),
  });
};

export const useUpdateService = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, payload }) => serviceService.updateService(serviceId, payload, getToken()),
    onSuccess: (data, variables) => {
      // ✅ Return the RAW, updated data from the API.
      if (variables?.serviceId) {
        // Optimistically update the cache for the single service
        queryClient.setQueryData(['service', variables.serviceId], data.data || data);
      }
      queryClient.invalidateQueries({ queryKey: ['services'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => options?.onError?.(error),
  });
};

export const useDeleteService = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId }) => serviceService.deleteService(serviceId, getToken()),
    onSuccess: (_, variables) => {
      if (variables?.serviceId) {
        queryClient.removeQueries({ queryKey: ['service', variables.serviceId] });
      }
      queryClient.invalidateQueries({ queryKey: ['services'] });
      options?.onSuccess?.();
    },
    onError: (error) => options?.onError?.(error),
  });
};

// ✅ ADD: New mutation for updating just the status of a service.
export const useUpdateServiceStatus = (options = {}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ serviceId, status }) => serviceService.updateStatus(serviceId, { status }, getToken()),
        onSuccess: (data, variables) => {
            const updatedService = data.data || data;
            if (variables?.serviceId) {
                queryClient.setQueryData(['service', variables.serviceId], updatedService);
            }
            queryClient.invalidateQueries({ queryKey: ['services'] });
            options?.onSuccess?.(updatedService);
        },
        onError: (error) => options?.onError?.(error),
    });
};