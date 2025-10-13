import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedService } from '../feedService';
import { normalizePost } from '../queries/useFeedQuery'; // Ensure this path is correct

/**
 * Helper to invalidate the main posts list.
 * We'll use this in `onSettled` to ensure eventual consistency.
 */
const invalidatePosts = (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
};

// --- CREATE POST ---
// This uses a "manual update on success" pattern, which is nearly instant and safer
// than a full optimistic update because it uses the real ID from the server.
export const useCreatePostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => feedService.createPost(formData),
    onSuccess: (response, variables, context) => {
      const newPostRaw = response.data;

      if (newPostRaw) {
        queryClient.setQueryData(['posts'], (oldData) => {
          const oldPosts = Array.isArray(oldData) ? oldData : [];
          const newPostNormalized = normalizePost(newPostRaw);
          return [newPostNormalized, ...oldPosts]; // Add the new post to the top
        });
      }
      options.onSuccess?.(response, variables, context);
    },
    // Always refetch in the background to sync any minor server-side changes.
    onSettled: () => {
      invalidatePosts(queryClient);
    },
    ...options,
  });
};

// --- UPDATE POST ---
export const useUpdatePostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, payload }) => feedService.updatePost(postId, payload),
    
    // Optimistically update the UI before the API call
    onMutate: async ({ postId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      queryClient.setQueryData(['posts'], (oldData) => {
        const oldPosts = Array.isArray(oldData) ? oldData : [];
        return oldPosts.map(post => {
          if (post.id === postId) {
            // Optimistically update the text. The image will update on success.
            return { ...post, text: payload.get('body') };
          }
          return post;
        });
      });

      return { previousPosts };
    },

    // If the mutation fails, roll back to the previous state
    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      options.onError?.(err, variables, context);
    },

    // Always refetch after success or failure to ensure consistency
    onSettled: () => {
      invalidatePosts(queryClient);
    },
    ...options,
  });
};

// --- DELETE POST ---
export const useDeletePostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => feedService.deletePost(postId),
    
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically remove the post from the UI
      queryClient.setQueryData(['posts'], (oldData) => {
        const oldPosts = Array.isArray(oldData) ? oldData : [];
        return oldPosts.filter(post => post.id !== postId);
      });

      return { previousPosts };
    },

    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      options.onError?.(err, variables, context);
    },

    onSettled: () => {
      invalidatePosts(queryClient);
    },
    ...options,
  });
};

// --- CREATE COMMENT ---
export const useCreateCommentMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, body }) => feedService.createComment(postId, { body }),
    
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically increment the comment count on the post
      queryClient.setQueryData(['posts'], (oldData) => {
        const oldPosts = Array.isArray(oldData) ? oldData : [];
        return oldPosts.map(post => {
          if (post.id === postId) {
            return { ...post, comments: (post.comments || 0) + 1 };
          }
          return post;
        });
      });

      return { previousPosts };
    },

    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      options.onError?.(err, variables, context);
    },

    // When settled, refetch both the posts list (for counts) and the specific comments for the modal
    onSettled: (data, error, { postId }) => {
      invalidatePosts(queryClient);
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
    },
    ...options,
  });
};

// --- LIKE POST (with Optimistic Update) ---
export const useLikePostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => feedService.likePost(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically toggle the like status and count
      queryClient.setQueryData(['posts'], (oldData) => {
          const oldPosts = Array.isArray(oldData) ? oldData : [];
          return oldPosts.map(post => {
              if (post.id === postId) {
                  return {
                      ...post,
                      isLiked: !post.isLiked,
                      likes: post.isLiked ? (post.likes - 1) : (post.likes + 1),
                  };
              }
              return post;
          });
      });

      return { previousPosts };
    },

    onError: (err, variables, context) => {
        if (context?.previousPosts) {
            queryClient.setQueryData(['posts'], context.previousPosts);
        }
        options.onError?.(err, variables, context);
    },

    onSettled: () => {
      invalidatePosts(queryClient);
    },
    ...options
  });
};

// --- SHARE POST ---
// Share is a simple action that doesn't need a complex optimistic update.
// Simple invalidation to update the share count is sufficient.
export const useSharePostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => feedService.sharePost(postId),
     onSuccess: (data, postId, context) => {
      invalidatePosts(queryClient);
      options.onSuccess?.(data, postId, context);
    },
    ...options
  });
};