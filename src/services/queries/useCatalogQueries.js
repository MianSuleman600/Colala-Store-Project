// src/services/queries/useCatalogQueries.js

import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../catalogService';
import { ASSETS_BASE } from '../../api/apiConfig';

/**
 * Fetches and caches the list of all product categories.
 */
export const useCategoriesQuery = (options = {}) =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('[DEBUG] Fetching categories...');
      const response = await catalogService.getCategories();
      
      // --- DEBUGGING LINE ---
      console.log('[DEBUG] Raw API Response (Categories):', response);

      // --- FIX: Access the 'items' key directly from the response ---
      const items = response?.items || [];
      
      const processedItems = items.map(item => ({
        ...item,
        image_url: item.image_url ? `${ASSETS_BASE}${item.image_url.replace(/\\/g, '/')}` : ''
      }));

      // --- DEBUGGING LINE ---
      console.log('[DEBUG] Processed Categories:', processedItems);

      return processedItems;
    },
    staleTime: Infinity,
    ...options,
  });

/**
 * Fetches and caches the list of all brands.
 */
export const useBrandsQuery = (options = {}) =>
  useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
        console.log('[DEBUG] Fetching brands...');
        const response = await catalogService.getBrands();

        // --- DEBUGGING LINE ---
        console.log('[DEBUG] Raw API Response (Brands):', response);

        // --- FIX: Access the 'data' key directly from the response ---
        const brandList = response?.data || [];

        // --- DEBUGGING LINE ---
        console.log('[DEBUG] Processed Brands:', brandList);
        
        return brandList; 
    },
    staleTime: Infinity,
    ...options,
  });

/**
 * Fetches seller's addresses to use as Availability Locations.
 */
export const useLocationsQuery = (userId, options = {}) =>
  useQuery({
    queryKey: ['availabilityLocations', userId],
    queryFn: async () => {
        console.log('[DEBUG] Fetching availability locations (addresses)...');
        const response = await catalogService.getLocations();
        
        // --- DEBUGGING LINE ---
        console.log('[DEBUG] Raw API Response (Availability Locations):', response);

        // --- FIX: Access the 'items' key directly from the response ---
        const items = response?.items || [];
        const locationSet = new Set(
            items.map(item => `${item.state} - ${item.local_government}`)
        );
        const uniqueLocations = Array.from(locationSet);
        
        // --- DEBUGGING LINE ---
        console.log('[DEBUG] Processed Availability Locations:', uniqueLocations);

        return uniqueLocations;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

/**
 * Fetches seller's delivery options to use as Delivery Locations.
 */
export const useDeliveryLocationsQuery = (userId, options = {}) =>
  useQuery({
      queryKey: ['deliveryLocations', userId],
      queryFn: async () => {
          console.log('[DEBUG] Fetching delivery locations...');
          const response = await catalogService.getDeliveryLocations();

          // --- DEBUGGING LINE ---
          console.log('[DEBUG] Raw API Response (Delivery Locations):', response);
          
          // --- FIX: Access the 'items' key directly from the response ---
          const items = response?.items || [];
          const locationSet = new Set(
              items.map(item => `${item.state} - ${item.local_government}`)
          );
          const uniqueLocations = Array.from(locationSet);

          // --- DEBUGGING LINE ---
          console.log('[DEBUG] Processed Delivery Locations:', uniqueLocations);

          return uniqueLocations;
      },
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
      ...options,
  });
  
/**
 * Provides static lists for mobile specifications.
 */
export const useMobileSpecsQuery = (options = {}) =>
    useQuery({
        queryKey: ['mobileSpecs'],
        queryFn: () => {
            const specs = {
                mobileTypes: ['Smartphone', 'Feature Phone', 'Tablet'],
                mobileBrands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Techno', 'Infinix'],
            };
            console.log('[DEBUG] Provided Mobile Specs (Static):', specs);
            return Promise.resolve(specs);
        },
        staleTime: Infinity,
        ...options,
    });