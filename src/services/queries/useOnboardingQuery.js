// src/services/queries/useOnboardingQuery.js

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/apiConfig';

export const onboardingQueryKeys = {
  progress: ['onboarding', 'progress'],
  level: (levelNum) => ['onboarding', 'level', levelNum],
};

// ---------------------------
// Progress Query
// ---------------------------
export const useOnboardingProgressQuery = (options = {}) => {
  return useQuery({
    queryKey: onboardingQueryKeys.progress,
    queryFn: async () => {
      console.log('%c[Hook] useOnboardingProgressQuery: Fetching...', 'color: #9c27b0; font-weight: bold;');
      const response = await apiRequest({
        url: ENDPOINTS.SELLER_ONBOARDING.PROGRESS,
        method: 'GET',
      });
      // response itself contains status, profile_image, etc.
      console.log('%c[Hook] useOnboardingProgressQuery: Received data:', 'color: #9c27b0;', response);
      return response;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// ---------------------------
// Level Data Query
// ---------------------------
export const useOnboardingLevelDataQuery = (levelNum, options = {}) => {
  return useQuery({
    queryKey: onboardingQueryKeys.level(levelNum),
    queryFn: async () => {
      console.log(`%c[Hook] useOnboardingLevelDataQuery: Fetching Level ${levelNum}...`, 'color: #9c27b0; font-weight: bold;');
      const endpoint = ENDPOINTS.SELLER_ONBOARDING.LEVEL_STATUS(levelNum);
      const response = await apiRequest({
        url: endpoint,
        method: 'GET',
      });
      // response contains the keys: status, profile_image, banner_image, etc.
      console.log(`%c[Hook] useOnboardingLevelDataQuery: Received Level ${levelNum} data:`, 'color: #9c27b0;', response);
      return response;
    },
    enabled: !!levelNum,
    staleTime: Infinity,
    ...options,
  });
};
