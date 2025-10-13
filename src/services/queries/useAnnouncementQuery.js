// src/services/queries/useAnnouncementQuery.js
import { useQuery } from '@tanstack/react-query';
import { announcementService } from '../settings/announcementService.js';

export const announcementQueryKeys = {
  announcements: ['announcements'],
  announcementsActive: ['announcements', 'active'],
};

export const useAnnouncementsQuery = (options = {}) =>
  useQuery({
    queryKey: announcementQueryKeys.announcements,
    queryFn: () => announcementService.getAnnouncements(),
    staleTime: 60_000,
    ...options,
  });

// This hook now filters client-side, as the backend doesn't have a dedicated endpoint for it.
export const useActiveAnnouncementsQuery = (options = {}) =>
  useQuery({
    queryKey: announcementQueryKeys.announcementsActive,
    queryFn: async () => {
      const allAnnouncements = await announcementService.getAnnouncements();
      return allAnnouncements.filter(a => a.active);
    },
    staleTime: 30_000,
    ...options,
  });