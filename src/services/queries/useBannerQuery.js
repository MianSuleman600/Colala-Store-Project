import { useQuery } from '@tanstack/react-query';
import { announcementService } from '../settings/announcementService'; // unified path

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
    staleTime: 0, // optional: force fresh
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    ...options,
  });

export const useActiveBannersQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: KEYS.bannersActive(params),
    queryFn: async () => {
      const res = await announcementService.getActiveBanners(params);
      return res.banners || [];
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    ...options,
  });

export const bannerQueryKeys = KEYS;