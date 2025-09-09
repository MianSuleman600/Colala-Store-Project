// src/hooks/useBannerMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '../settings/announcementService.js';
import { bannerQueryKeys } from '../queries/useBannerQuery.js';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

export const useCreateBannerMutation = (paramsForInvalidate = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => announcementService.createBanner(payload),
    onSuccess: () => {
      toast('success', 'Banner created');
      qc.invalidateQueries({ queryKey: bannerQueryKeys.banners({}) });
      qc.invalidateQueries({ queryKey: bannerQueryKeys.banners(paramsForInvalidate) });
      qc.invalidateQueries({ queryKey: bannerQueryKeys.bannersActive({}) });
      qc.invalidateQueries({ queryKey: bannerQueryKeys.bannersActive(paramsForInvalidate) });
    },
    onError: (err) => toast('error', err?.message || 'Failed to create banner'),
  });
};

export const useUpdateBannerMutation = (paramsForInvalidate = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => announcementService.updateBanner(id, payload),
    onSuccess: () => {
      toast('success', 'Banner updated');
      qc.invalidateQueries({ queryKey: bannerQueryKeys.banners({}) });
      qc.invalidateQueries({ queryKey: bannerQueryKeys.banners(paramsForInvalidate) });
      qc.invalidateQueries({ queryKey: bannerQueryKeys.bannersActive({}) });
      qc.invalidateQueries({ queryKey: bannerQueryKeys.bannersActive(paramsForInvalidate) });
    },
    onError: (err) => toast('error', err?.message || 'Failed to update banner'),
  });
};

export const useDeleteBannerMutation = (paramsForInvalidate = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => announcementService.deleteBanner(id),
    onSuccess: () => {
      toast('success', 'Banner deleted');
      qc.invalidateQueries({ queryKey: bannerQueryKeys.banners({}) });
      qc.invalidateQueries({ queryKey: bannerQueryKeys.banners(paramsForInvalidate) });
      qc.invalidateQueries({ queryKey: bannerQueryKeys.bannersActive({}) });
      qc.invalidateQueries({ queryKey: bannerQueryKeys.bannersActive(paramsForInvalidate) });
    },
    onError: (err) => toast('error', err?.message || 'Failed to delete banner'),
  });
};