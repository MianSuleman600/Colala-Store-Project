//D:\Project\frontend\src\services\mutations\useFeedMutation.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedService } from '../index.js';
import { normalizeFeedPosts } from '../../utils/dataNormalizer.js';

/* ---------------- POSTS ---------------- */

/**
 * Create Post
 */
export const useCreatePostMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedService.createPost,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      const optimisticPost = normalizeFeedPosts([newPost])[0];
      queryClient.setQueryData(['posts'], (old = []) => [optimisticPost, ...old]);
      return { previousPosts };
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) queryClient.setQueryData(['posts'], context.previousPosts);
      options.onError?.(_);
    },
    onSuccess: (data) => {
      const normalized = normalizeFeedPosts([data?.data || data])[0];
      queryClient.setQueryData(['posts'], (old = []) =>
        [normalized, ...old.filter(p => p.id !== normalized.id)]
      );
      options.onSuccess?.(normalized);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
};

/**
 * Update Post
 */
export const useUpdatePostMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, payload }) => feedService.updatePost(postId, payload),
    onMutate: async ({ postId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old = []) =>
        old.map((post) => (post.id === postId ? { ...post, ...payload } : post))
      );
      return { previousPosts };
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) queryClient.setQueryData(['posts'], context.previousPosts);
      options.onError?.(_);
    },
    onSuccess: (data) => {
      const normalized = normalizeFeedPosts([data?.data || data])[0];
      queryClient.setQueryData(['posts'], (old = []) =>
        old.map(p => (p.id === normalized.id ? normalized : p))
      );
      options.onSuccess?.(normalized);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
};

/**
 * Delete Post
 */
export const useDeletePostMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => feedService.deletePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old = []) => old.filter(p => p.id !== postId));
      return { previousPosts };
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) queryClient.setQueryData(['posts'], context.previousPosts);
      options.onError?.(_);
    },
    onSuccess: (data) => options.onSuccess?.(data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
};

/* ---------------- COMMENTS ---------------- */

/**
 * Create Comment
 */
export const useCreateCommentMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, comment }) => feedService.createComment(postId, comment),
    onMutate: async ({ postId, comment }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      const optimisticComment = {
        id: `temp-comment-${Date.now()}`,
        text: comment.text || comment,
        userName: comment.userName || 'Unknown',
        userProfilePic: comment.userProfilePic || '/default-profile.png',
        likes: 0,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(['posts'], (old = []) =>
        old.map(post =>
          post.id === postId
            ? { ...post, commentsList: [...(post.commentsList || []), optimisticComment] }
            : post
        )
      );

      return { previousPosts };
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) queryClient.setQueryData(['posts'], context.previousPosts);
      options.onError?.(_);
    },
    onSuccess: (data, variables) => {
      const normalizedComment = normalizeFeedPosts([{
        ...variables,
        id: data?.data?.id || `comment-${Date.now()}`,
        text: data?.data?.text || variables.comment.text,
      }])[0].commentsList[0];

      queryClient.setQueryData(['posts'], (old = []) =>
        old.map(post =>
          post.id === variables.postId
            ? {
                ...post,
                commentsList: post.commentsList.map(c =>
                  c.id.startsWith('temp-comment-') ? normalizedComment : c
                ),
              }
            : post
        )
      );

      options.onSuccess?.(normalizedComment);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
};

/**
 * Update Comment
 */
export const useUpdateCommentMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId, updatedComment }) =>
      feedService.updateComment(postId, commentId, updatedComment),
    onMutate: async ({ postId, commentId, updatedComment }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      queryClient.setQueryData(['posts'], (old = []) =>
        old.map(post =>
          post.id === postId
            ? {
                ...post,
                commentsList: post.commentsList.map(c =>
                  c.id === commentId ? { ...c, ...updatedComment } : c
                ),
              }
            : post
        )
      );

      return { previousPosts };
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) queryClient.setQueryData(['posts'], context.previousPosts);
      options.onError?.(_);
    },
    onSuccess: (data, variables) => {
      const normalizedComment = normalizeFeedPosts([{
        ...variables,
        id: variables.commentId,
        text: data?.data?.text || variables.updatedComment.text,
      }])[0].commentsList[0];

      queryClient.setQueryData(['posts'], (old = []) =>
        old.map(post =>
          post.id === variables.postId
            ? {
                ...post,
                commentsList: post.commentsList.map(c =>
                  c.id === variables.commentId ? normalizedComment : c
                ),
              }
            : post
        )
      );

      options.onSuccess?.(normalizedComment);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
};

/**
 * Delete Comment
 */
export const useDeleteCommentMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }) => feedService.deleteComment(postId, commentId),
    onMutate: async ({ postId, commentId }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      queryClient.setQueryData(['posts'], (old = []) =>
        old.map(post =>
          post.id === postId
            ? {
                ...post,
                commentsList: post.commentsList.filter(c => c.id !== commentId),
              }
            : post
        )
      );

      return { previousPosts };
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) queryClient.setQueryData(['posts'], context.previousPosts);
      options.onError?.(_);
    },
    onSuccess: (data) => options.onSuccess?.(data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
};
