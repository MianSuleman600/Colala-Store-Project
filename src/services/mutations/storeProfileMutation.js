// src/services/mutations/storeProfileMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { openDB } from 'idb';
import { userService } from '../index.js';

// --- Queue offline actions in IndexedDB ---
const queueAction = async (item) => {
  const db = await openDB('PWAStoreDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('pendingActions')) {
        db.createObjectStore('pendingActions', { autoIncrement: true });
      }
    },
  });
  const tx = db.transaction('pendingActions', 'readwrite');
  await tx.objectStore('pendingActions').add(item);
  await tx.done;
};

// --- Update Store Profile Mutation ---
export const useUpdateStoreProfileMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, payload }) => {
      if (!userId) throw new Error('User ID is required');
      // Online-first approach: optionally you can queue offline changes
      if (navigator.onLine) {
        const updated = await userService.updateStoreProfile(userId, payload);
        return updated;
      } else {
        await queueAction({
          url: ENDPOINTS.USERS.UPDATE_PROFILE,
          method: 'PATCH',
          data: payload,
        });
        return { offlineQueued: true };
      }
    },
    onSuccess: (data, variables, context) => {
      // Update cached store profile
      if (!data.offlineQueued) {
        queryClient.setQueryData(['storeProfile', variables.userId], data);
      } else {
        window.dispatchEvent(
          new CustomEvent('SHOW_ALERT', {
            detail: { type: 'info', message: 'Profile changes saved offline. Will sync when online.' },
          })
        );
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error('Update Store Profile Error:', error);
      window.dispatchEvent(
        new CustomEvent('SHOW_ALERT', { detail: { type: 'error', message: error.message } })
      );
      options.onError?.(error, variables, context);
    },
  });
};