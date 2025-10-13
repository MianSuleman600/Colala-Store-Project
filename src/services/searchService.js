// src/services/searchService.js

import { apiRequest } from '../api/apiClient.js';
import { ENDPOINTS, ASSETS_BASE } from '../api/apiConfig.js';

const normalizeProduct = (product) => {
  if (!product) return null;
  const firstImage = product.images?.[0]?.path;
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price),
    discountPrice: product.discount_price ? parseFloat(product.discount_price) : null,
    imageUrl: firstImage ? `${ASSETS_BASE}/storage/${firstImage}` : null,
    category: product.category?.title || 'Uncategorized',
    storeName: product.store?.store_name,
    storeLogo: product.store?.profile_image_url,
    rating: product.average_rating,
    status: product.status,
  };
};

export const searchService = {
  performSearch: async (params) => {
    if (!params.q || !params.type) {
      return { data: [] };
    }
    
    // --- THIS IS THE FIX ---
    // 1. Call the endpoint function to build the complete URL string with query parameters.
    const url = ENDPOINTS.SEARCH(params);
    
    // 2. Pass the generated `url` string to the apiRequest wrapper.
    //    Do not pass `params` again, as they are already part of the URL.
    const response = await apiRequest({
      url: url,
      method: 'GET',
    });
    // --- END OF FIX ---
    
    const rawResults = response.data?.data || [];
    const normalizedResults = rawResults.map(normalizeProduct);

    return {
      data: normalizedResults,
      meta: response.data?.meta,
      links: response.data?.links,
    };
  },
};