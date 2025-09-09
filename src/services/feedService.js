// src/services/feedService.js
import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';
import DUMMY_POSTS from '../utils/data/dummyFeed';
import { USE_DUMMY_DATA } from '../utils/config.js'; // global toggle

// --- Dummy Feed Service ---
const dummyFeedService = {
  getPosts: async () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ posts: DUMMY_POSTS, message: 'Dummy posts fetched successfully.' }), 500)
    ),

  createPost: async (formData) => {
    const newPost = {
      id: `post-${Date.now()}`,
      userName: 'Current User',
      userProfilePic: '/src/assets/images/profileImage.png',
      timeAgo: 'Just now',
      location: 'Unknown',
      imageUrl: formData.get('image') || '',
      text: formData.get('text') || '',
      likes: 0,
      comments: 0,
      shares: 0,
      commentsList: [],
    };
    DUMMY_POSTS.unshift(newPost); // add to top
    return { success: true, post: newPost, message: 'Post created successfully (dummy).' };
  },

  updatePost: async (postId, formData) => {
    const index = DUMMY_POSTS.findIndex(p => p.id === postId);
    if (index === -1) return { success: false, message: 'Post not found (dummy).' };
    DUMMY_POSTS[index] = {
      ...DUMMY_POSTS[index],
      text: formData.get('text') || DUMMY_POSTS[index].text,
      imageUrl: formData.get('image') || DUMMY_POSTS[index].imageUrl,
    };
    return { success: true, post: DUMMY_POSTS[index], message: 'Post updated successfully (dummy).' };
  },

  deletePost: async (postId) => {
    const index = DUMMY_POSTS.findIndex(p => p.id === postId);
    if (index === -1) return { success: false, message: 'Post not found (dummy).' };
    DUMMY_POSTS.splice(index, 1);
    return { success: true, message: 'Post deleted successfully (dummy).' };
  },

  createComment: async (postId, payload) => {
    const post = DUMMY_POSTS.find(p => p.id === postId);
    if (!post) return { success: false, message: 'Post not found (dummy).' };
    const newComment = {
      id: `c-${Date.now()}`,
      userName: payload.userName || 'Anonymous',
      userProfilePic: payload.userProfilePic || '/src/assets/images/profileImage.png',
      timeAgo: 'Just now',
      text: payload.text,
      likes: 0,
    };
    post.commentsList.push(newComment);
    post.comments += 1;
    return { success: true, comment: newComment, message: 'Comment added successfully (dummy).' };
  },
};

// --- Real API Feed Service ---
const apiFeedService = {
  getPosts: async () =>
    apiRequest({ url: ENDPOINTS.FEED.GET_ALL, method: 'GET' }),

  createPost: async (formData) =>
    apiRequest({
      url: ENDPOINTS.FEED.CREATE,
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updatePost: async (postId, formData) =>
    apiRequest({
      url: ENDPOINTS.FEED.UPDATE(postId),
      method: 'PUT',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deletePost: async (postId) =>
    apiRequest({
      url: ENDPOINTS.FEED.DELETE(postId),
      method: 'DELETE',
    }),

  createComment: async (postId, payload) =>
    apiRequest({
      url: ENDPOINTS.FEED.CREATE_COMMENT(postId),
      method: 'POST',
      data: payload,
    }),
};

// --- Export based on global dummy flag ---
export const feedService = USE_DUMMY_DATA ? dummyFeedService : apiFeedService;
