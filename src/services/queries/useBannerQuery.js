// src/services/queries/useBannerQuery.js

import { useQuery } from '@tanstack/react-query';
import { announcementService } from '../settings/announcementService.js';

export const bannerQueryKeys = {
  banners: (params = {}) => ['banners', params],
};

// This is the only hook needed. It fetches all banners.
// The component will be responsible for deciding which one to display.
export const useBannersQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: bannerQueryKeys.banners(params),
    queryFn: () => announcementService.getBanners(params),
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });