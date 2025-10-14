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

      console.log('[DEBUG] Raw API Response (Categories):', response);

      // ✅ Correct key: response.data (used for the top-level categories)
      const items = response?.data || [];

      // Function to recursively flatten categories and handle URLs
      const flattenCategories = (categoryList) => {
        const flatList = [];
        for (const item of categoryList) {
          // Use the provided image_url directly, as it's fully qualified.
          // If image_url is missing, you can fall back to local construction (optional, as API provides it)
          const finalImageUrl = item.image_url || '';

          flatList.push({
            ...item,
            image_url: finalImageUrl,
            // IMPORTANT: To make it easy to display in a simple list, 
            // you should only include the category ID that should be selectable.
            // If only leaf nodes or top-level nodes are selectable, you need to adjust here.
            // For now, we keep the object structure clean.
          });

          if (item.children && item.children.length > 0) {
            // Recursively flatten children if you need all sub-categories in a single list
            flatList.push(...flattenCategories(item.children));
          }
        }
        return flatList;
      };

      // Since your `categories` query is used to populate a simple list for selection,
      // you probably want all categories (including children) in a single, flat array.
      const processedItems = flattenCategories(items);

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
     
      const response = await catalogService.getDeliveryLocations();

     
      const items = response?.items || [];
      const locationSet = new Set(
        items.map(item => `${item.state} - ${item.local_government}`)
      );
      const uniqueLocations = Array.from(locationSet);

     
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