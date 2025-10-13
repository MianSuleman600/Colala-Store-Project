import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

// --- Real API Feed Service ---
// All dummy data and the USE_DUMMY_DATA flag have been removed.
const apiFeedService = {
  getPosts: () => apiRequest({ url: ENDPOINTS.POSTS.LIST, method: 'GET' }),
  
  getPostById: (postId) => apiRequest({ url: ENDPOINTS.POSTS.DETAIL(postId), method: 'GET' }),
  
  getPostComments: (postId) => apiRequest({ url: ENDPOINTS.POSTS.COMMENTS.LIST(postId), method: 'GET' }),

  createPost: (formData) => apiRequest({ url: ENDPOINTS.POSTS.CREATE, method: 'POST', data: formData }),
  
  updatePost: (postId, formData) => {
    // Backend expects POST for updates and needs FormData for potential file uploads.
    // We also add method spoofing in case the framework requires it for file updates.
    formData.append('_method', 'POST'); 
    return apiRequest({ url: ENDPOINTS.POSTS.UPDATE(postId), method: 'POST', data: formData });
  },
  
  deletePost: (postId) => apiRequest({ url: ENDPOINTS.POSTS.DELETE(postId), method: 'DELETE' }),

  likePost: (postId) => apiRequest({ url: ENDPOINTS.POSTS.LIKE(postId), method: 'POST' }),
  
  sharePost: (postId) => apiRequest({ url: ENDPOINTS.POSTS.SHARE(postId), method: 'POST' }),
  
  createComment: (postId, payload) => apiRequest({ url: ENDPOINTS.POSTS.COMMENTS.CREATE(postId), method: 'POST', data: payload }),
};

export const feedService = apiFeedService;