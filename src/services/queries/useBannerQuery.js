// src/hooks/useBannerQuery.js
import { useQuery } from '@tanstack/react-query';
import { announcementService } from '../settings/announcementService';

const KEYS = {
  banners: (params = {}) => ['banners', params],
  bannersActive: (params = {}) => ['banners', 'active', params],
};

export const useBannersQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: KEYS.banners(params),
    queryFn: async () => {
      const res = await announcementService.getBanners(params);
      return res.banners || [];
    },
    staleTime: 60_000,
    ...options,
  });

export const useActiveBannersQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: KEYS.bannersActive(params),
    queryFn: async () => {
      const res = await announcementService.getActiveBanners(params);
      return res.banners || [];
    },
    staleTime: 30_000,
    ...options,
  });

export const bannerQueryKeys = KEYS;