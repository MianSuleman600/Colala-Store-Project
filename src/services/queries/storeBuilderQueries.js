import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { storeBuilderService } from '../storeBuilderService';

// --- Query to fetch initial data for the builder ---
export const useStoreBuilderQuery = (options = {}) => {
  return useQuery({
    queryKey: ['storeBuilderData'],
    queryFn: storeBuilderService.getStoreBuilderData,
    ...options,
    // Transforms snake_case from API to camelCase for the form
    select: (data) => {
      if (!data) return null;
      return {
        storeName: data.store_name || '',
        email: data.store_email || '',
        phoneNumber: data.store_phone || '',
        showPhoneOnProfile: !!data.show_phone_on_profile,
        location: data.store_location || 'Lagos',
        // Ensure categories is an array of IDs from the nested objects
        categories: Array.isArray(data.categories) ? data.categories.map(c => c.id) : [],
        profilePictureUrl: data.profile_image || null,
        bannerImageUrl: data.banner_image || null,
        promotionalBannerImageUrl: data.promotional_banner_url || null, // Adjust if backend key is different
        brandColor: data.theme_color || '#EF4444',
      };
    },
  });
};

// --- Mutation to update the store data ---
export const useUpdateStoreBuilderMutation = (options = {}) => {
  // ✅ 1. Get the query client instance from TanStack Query.
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => storeBuilderService.updateStoreBuilderData(formData),
    onSuccess: (data, variables, context) => {
      // ✅ 2. Invalidate queries after a successful mutation.
      // This tells TanStack Query that the data for these keys is stale
      // and needs to be refetched automatically.
      
      // This refetches the data for the Store Builder itself.
      queryClient.invalidateQueries({ queryKey: ['storeBuilderData'] });
      
      // This is the CRUCIAL line that forces the HomePage to update.
      queryClient.invalidateQueries({ queryKey: ['storeProfile'] });

      // Call the original onSuccess from the component if it exists.
      options.onSuccess?.(data, variables, context);
    },
    ...options, // Pass through any other options like onError.
  });
};