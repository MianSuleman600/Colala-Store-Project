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
    storeLogo: product.store?.profile_image,
    rating: product.average_rating,
    status: product.status,
  };
};

export const searchService = {
  performSearch: async (params) => {
    if (!params.type) {
      params.type = params.image ? 'camera' : params.code ? 'barcode' : 'product';
    }

    if (params.type === 'product') {
      if (!params.q) return { data: [] };
      const url = ENDPOINTS.SEARCH.TEXT(params);
      const response = await apiRequest({ url, method: 'GET' });
      const rawResults = response.data?.data || [];
      return { data: rawResults.map(normalizeProduct) };
    }

    if (params.type === 'camera') {
      if (!params.image) return { data: [] };
      const formData = new FormData();
      formData.append('image', params.image);
      formData.append('type', 'camera'); // Ensure type is sent
      const response = await apiRequest({
        url: ENDPOINTS.SEARCH.CAMERA,
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const rawResults = response.data?.data || [];
      return { data: rawResults.map(normalizeProduct) };
    }

    if (params.type === 'barcode') {
      if (!params.code) return { data: [] };
      const formData = new FormData();
      formData.append('barcode', params.code);
      formData.append('type', 'barcode'); // Ensure type is sent
      const response = await apiRequest({
        url: ENDPOINTS.SEARCH.BARCODE,
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const rawResults = response.data?.data || [];
      return { data: rawResults.map(normalizeProduct) };
    }

    return { data: [] };
  },
};
