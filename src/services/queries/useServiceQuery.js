// src/services/queries/useServiceQuery.js

import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../serviceService.js';
import { normalizeServices } from '../../utils/dataNormalizer.js';

/**
 * Fetch all services for the logged-in user
 */
export const useServices = (userId, options = {}) =>
  useQuery({
    queryKey: ['myServices', userId],
    queryFn: async () => {
      const response = await serviceService.getServices();
      const servicesArray = response?.data || [];
      return normalizeServices(servicesArray);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

/**
 * Fetch a single service by its ID
 */
export const useService = (serviceId, options = {}) =>
  useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      if (!serviceId) return null;
      const response = await serviceService.getServiceById(serviceId);
      const serviceData = response?.data;
      const [normalized] = normalizeServices(serviceData ? [serviceData] : []);
      return normalized || null;
    },
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

/**
 * Fetch all available service categories
 */
export const useServiceCategories = (options = {}) =>
  useQuery({
    queryKey: ['serviceCategories'],
    queryFn: async () => {
      const response = await serviceService.getServiceCategories();
      return response?.data || [];
    },
    staleTime: Infinity,
    ...options,
  });

/**
 * --- REFACTORED: Service Stats Hook ---
 * Fetches details, chart data, and total counts for a service concurrently.
 */
export const useServiceStats = (serviceId, options = {}) =>
  useQuery({
    queryKey: ['serviceStats', serviceId],
    queryFn: async () => {
      if (!serviceId) return null;

      // Fetch details, daily chart data, and total counts in parallel
      const [detailsRes, chartRes, totalsRes] = await Promise.all([
        serviceService.getServiceById(serviceId),
        serviceService.getServiceStats(serviceId),
        serviceService.getServiceStatTotals(serviceId),
      ]);

      // Transform backend chart data for the component
      const chartData = (chartRes?.data || []).map(d => ({
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        impressions: d.impression || 0,
        visitors: d.view || 0, // Backend 'view' maps to frontend 'visitors'
        chats: d.chat || 0,
      }));
      
      const details = detailsRes?.data || {};

      // Return a single, structured object for the modal
      return {
        name: details.name || 'Service',
        imageUrl: details.imageUrl,
        minPrice: details.minPrice,
        maxPrice: details.maxPrice,
        dateCreated: details.createdAt ? new Date(details.createdAt).toLocaleDateString() : 'N/A',
        chartData: chartData,
        totals: totalsRes?.data || {},
      };
    },
    enabled: !!serviceId,
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });