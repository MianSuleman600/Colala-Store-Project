// src/services/mutations/storeProfileMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '../../api/apiConfig.js';
import { openDB } from 'idb';
import { userService } from '../index.js';
import { onboardingQueryKeys } from '../queries/useOnboardingQuery';

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
    mutationFn: ({ userId, payload }) => {
      if (!userId) throw new Error('User ID is required');
      return userService.updateStoreProfile(userId, payload);
    },

    onSuccess: (data, variables) => {
      // On success, invalidate both the main store profile and the specific progress query
      queryClient.invalidateQueries({ queryKey: ['storeProfile', variables.userId] });
      queryClient.invalidateQueries({ queryKey: onboardingQueryKeys.progress });

      options.onSuccess?.(data);
    },

    onError: async (error, variables) => {
      console.error('Update Store Profile Error:', error);

      // If offline, queue the update for later retry
      if (!navigator.onLine) {
        await queueAction({
          type: 'UPDATE_STORE_PROFILE',
          userId: variables.userId,
          payload: variables.payload,
          timestamp: Date.now(),
        });
        console.log('⚡ Action queued offline for later sync');
      } else {
        // Otherwise, show a normal error message
        window.alert(error.message || 'Update failed');
      }

      options.onError?.(error);
    },
  });
};
