import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';

export const useCameraOrBarcodeSearchMutation = () => {
  return useMutation({
    // ✅ The mutation function now returns a promise
    mutationFn: (variables) => {
      const { type, image } = variables;

      if (!type) return Promise.reject(new Error('Search type is required'));
      if (!image) return Promise.reject(new Error('Image file is required'));

      const formData = new FormData();
      formData.append('type', type);
      formData.append('image', image);

      return apiRequest({
        url: '/camera-search',
        method: 'POST',
        data: formData,
      });
    },
    // onSuccess and onError are now handled where the mutation is called (in SearchInput.jsx)
  });
};