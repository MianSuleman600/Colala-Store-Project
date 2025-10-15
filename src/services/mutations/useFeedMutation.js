// src/services/mutations/useFeedMutation.js

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedService } from '../feedService';
import { normalizePost } from '../queries/useFeedQuery';

const invalidatePosts = (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
};

// --- CREATE POST ---
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
          return [newPostNormalized, ...oldPosts];
        });
      }
      options.onSuccess?.(response, variables, context);
    },
    onSettled: () => invalidatePosts(queryClient),
    ...options,
  });
};

// --- UPDATE POST ---
export const useUpdatePostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, payload }) => feedService.updatePost(postId, payload),
    onMutate: async ({ postId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (oldData) => {
        const oldPosts = Array.isArray(oldData) ? oldData : [];
        return oldPosts.map(post => {
          if (post.id === postId) {
            return { ...post, text: payload.get('body') };
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
    onSettled: () => invalidatePosts(queryClient),
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
    onSettled: () => invalidatePosts(queryClient),
    ...options,
  });
};

// --- CREATE COMMENT --- (✅ UPDATED FOR REPLIES)
export const useCreateCommentMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    // ✅ CRITICAL CHANGE: The mutation function now accepts and passes the `parentId`.
    mutationFn: ({ postId, body, parentId }) => feedService.createComment(postId, { body, parentId }),
    
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically increment the comment count on the post card. This is great UX.
      queryClient.setQueryData(['posts'], (oldData) => {
        const oldPosts = Array.isArray(oldData) ? oldData : [];
        return oldPosts.map(post => {
          if (post.id === postId) {
            // Note: Your PostCard needs to use a 'comments' prop for this to show.
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
    onSettled: (data, error, { postId }) => {
      // This correctly refetches the comments for the panel, which is perfect.
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
      // We also refetch the posts list to ensure the comment count is accurate.
      invalidatePosts(queryClient);
    },
    ...options,
  });
};

// --- LIKE POST ---
export const useLikePostMutation = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId) => feedService.likePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
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
    onSettled: () => invalidatePosts(queryClient),
    ...options
  });
};

// --- SHARE POST ---
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