import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { storeBuilderService } from '../storeBuilderService';

// --- Query to fetch initial data for the builder ---
export const useStoreBuilderQuery = (options = {}) => {
  return useQuery({
    queryKey: ['storeBuilderData'],
    queryFn: storeBuilderService.getStoreBuilderData,
    ...options,
    // Return the raw data as the component handles the transformation
    select: (data) => data,
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