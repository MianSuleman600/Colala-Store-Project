import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';

export const useCameraOrBarcodeSearchMutation = () => {
  return useMutation({
    mutationFn: async ({ type, image }) => {
      if (!type) throw new Error('Search type is required');
      if (!image) throw new Error('Image file is required');

      const formData = new FormData();
      formData.append('type', type);      // required by backend
      formData.append('image', image);    // file input

      const response = await apiRequest({
        url: '/camera-search', // or /camera-search/barcode depending on backend
        method: 'POST',
        data: formData,
      });

      return response; // backend returns { search_results, extracted_text, ... }
    },
  });
};
