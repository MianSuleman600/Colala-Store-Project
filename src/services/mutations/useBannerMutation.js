// src/services/mutations/useBannerMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '../settings/announcementService.js';
import { bannerQueryKeys } from '../queries/useBannerQuery.js';
import { useToast } from '../../components/ui/ToastProvider';

const buildBannerFormData = (payload) => {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
        if (key !== 'imageFile' && payload[key] != null) {
            const value = typeof payload[key] === 'boolean' ? (payload[key] ? '1' : '0') : payload[key];
            formData.append(key, value);
        }
    });
    if (payload.imageFile instanceof File) {
        formData.append('image', payload.imageFile, payload.imageFile.name);
    }
    return formData;
};

export const useCreateBannerMutation = (options = {}) => {
  const qc = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: (payload) => {
        const formData = buildBannerFormData(payload);
        return announcementService.createBanner(formData);
    },
    onSuccess: () => {
      push('Banner created successfully', { type: 'success' });
      // This call now works correctly.
      qc.invalidateQueries({ queryKey: bannerQueryKeys.banners({}) });
    },
    onError: (err) => push(err?.message || 'Failed to create banner', { type: 'error' }),
    ...options,
  });
};

export const useUpdateBannerMutation = (options = {}) => {
  const qc = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: ({ id, payload }) => {
        const formData = buildBannerFormData(payload);
        return announcementService.updateBanner(id, formData);
    },
    onSuccess: () => {
      push('Banner updated successfully', { type: 'success' });
      qc.invalidateQueries({ queryKey: bannerQueryKeys.banners({}) });
    },
    onError: (err) => push(err?.message || 'Failed to update banner', { type: 'error' }),
    ...options,
  });
};

export const useDeleteBannerMutation = (options = {}) => {
  const qc = useQueryClient();
  const { push } = useToast();
  return useMutation({
    mutationFn: (id) => announcementService.deleteBanner(id),
    onSuccess: () => {
      push('Banner deleted', { type: 'success' });
      qc.invalidateQueries({ queryKey: bannerQueryKeys.banners({}) });
    },
    onError: (err) => push(err?.message || 'Failed to delete banner', { type: 'error' }),
    ...options,
  });
};