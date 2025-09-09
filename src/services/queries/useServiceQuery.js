import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../index.js';
import { normalizeServices } from '../../utils/dataNormalizer.js';

/**
 * Fetch all services and normalize them
 */
export const useServices = (options = {}) =>
  useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await serviceService.getServices();
      const services = Array.isArray(response?.services) ? response.services : [];
      return normalizeServices(services);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });

/**
 * Fetch a single service by ID and normalize
 * @param {string} serviceId
 */
export const useService = (serviceId, options = {}) =>
  useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      if (!serviceId) return null;
      const response = await serviceService.getServiceById(serviceId);
      return normalizeServices([response?.service || {}])[0] || null;
    },
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
