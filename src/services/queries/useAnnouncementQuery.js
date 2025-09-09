// src/hooks/useAnnouncementQuery.js
import { useQuery } from '@tanstack/react-query';
import { announcementService } from '../settings/announcementService';

const KEYS = {
  announcements: ['announcements'],
  announcementsActive: ['announcements', 'active'],
};

export const useAnnouncementsQuery = (options = {}) =>
  useQuery({
    queryKey: KEYS.announcements,
    queryFn: async () => {
      const res = await announcementService.getAnnouncements();
      return res.announcements || [];
    },
    staleTime: 60_000,
    ...options,
  });

export const useActiveAnnouncementsQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...KEYS.announcementsActive, params],
    queryFn: async () => {
      const res = await announcementService.getActiveAnnouncements(params);
      return res.announcements || [];
    },
    staleTime: 30_000,
    ...options,
  });

export const announcementQueryKeys = KEYS;