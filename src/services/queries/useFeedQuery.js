import { useQuery } from '@tanstack/react-query';
import { feedService } from '../feedService';
import { ASSETS_BASE } from '../../api/apiConfig';

export const toAbsolute = (url) => {
    if (!url || url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${ASSETS_BASE}${url}`;
};

export const timeAgo = (dateString) => {
    if (!dateString) return 'just now';
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

export const normalizePost = (post) => {
  const firstImage = Array.isArray(post.media_urls)
    ? post.media_urls.find(media => media.type === 'image')
    : null;

  return {
    id: post.id,
    text: post.body,
    imageUrl: firstImage ? toAbsolute(firstImage.url) : null,
    likes: post.likes_count || 0,
    isLiked: !!post.is_liked,
    comments: post.comments_count || 0,
    shares: post.shares_count || 0,
    createdAt: post.created_at,
    timeAgo: timeAgo(post.created_at),
    userId: post.user_id,
    userName: post.user?.full_name || 'Unknown User',
    userProfilePic: toAbsolute(post.user?.profile_picture),
    location: post.user?.store?.store_location || 'Unknown Location',
  };
};

export const useGetPostsQuery = (options = {}) => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await feedService.getPosts();
      const publicPosts = response?.data?.posts?.data;
      const userOwnedPosts = response?.data?.myPosts?.data;
      const combinedPosts = [
        ...(Array.isArray(userOwnedPosts) ? userOwnedPosts : []),
        ...(Array.isArray(publicPosts) ? publicPosts : []),
      ];
      const uniquePostsMap = new Map();
      combinedPosts.forEach(post => {
        if (post && post.id && !uniquePostsMap.has(post.id)) {
          uniquePostsMap.set(post.id, post);
        }
      });
      const uniquePosts = Array.from(uniquePostsMap.values());
      uniquePosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return uniquePosts.map(normalizePost);
    },
    staleTime: 60 * 1000,
    ...options,
  });
};

export const useStoreFeedQuery = (storeId, options = {}) => {
  return useQuery({
    queryKey: ['posts', { storeId }],
    queryFn: async () => {
      const response = await feedService.getPosts({ storeId });
      const postsData = response?.data?.posts?.data || response?.data;
      const posts = Array.isArray(postsData) ? postsData : [];
      return posts.map(normalizePost);
    },
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useGetPostCommentsQuery = (postId, options = {}) => {
  return useQuery({
    queryKey: ['postComments', postId],
    queryFn: async () => {
      if (!postId) return [];

      const response = await feedService.getPostComments(postId);

      // Correct path to comments array
      const commentsData = response?.data?.data || [];

      return commentsData.map(comment => ({
        id: comment.id,
        text: comment.body,
        createdAt: comment.created_at,
        timeAgo: timeAgo(comment.created_at),
        userName: comment.user?.full_name || 'Anonymous',
        userProfilePic: toAbsolute(comment.user?.profile_picture),
        parent_id: comment.parent_id,
      }));
    },
    enabled: !!postId,
    staleTime: 30 * 1000,
    ...options,
  });
};
