import { apiRequest } from '../api/apiClient';
import { ENDPOINTS } from '../api/apiConfig';

const apiFeedService = {
  getPosts: () => apiRequest({ url: ENDPOINTS.POSTS.LIST, method: 'GET' }),
  
  getPostById: (postId) => apiRequest({ url: ENDPOINTS.POSTS.DETAIL(postId), method: 'GET' }),
  
  getPostComments: (postId) => apiRequest({ url: ENDPOINTS.POSTS.COMMENTS.LIST(postId), method: 'GET' }),

  createPost: (formData) => apiRequest({ url: ENDPOINTS.POSTS.CREATE, method: 'POST', data: formData }),
  
  updatePost: (postId, formData) => {
    // Backend expects POST for updates with FormData. We use method spoofing to tell
    // the backend framework (like Laravel) to treat this as a PUT request.
    // ✅ FIX: Corrected method spoofing from 'POST' to 'PUT'.
    formData.append('_method', 'PUT'); 
    return apiRequest({ url: ENDPOINTS.POSTS.UPDATE(postId), method: 'POST', data: formData });
  },
  
  deletePost: (postId) => apiRequest({ url: ENDPOINTS.POSTS.DELETE(postId), method: 'DELETE' }),

  likePost: (postId) => apiRequest({ url: ENDPOINTS.POSTS.LIKE(postId), method: 'POST' }),
  
  sharePost: (postId) => apiRequest({ url: ENDPOINTS.POSTS.SHARE(postId), method: 'POST' }),
  
  /**
   * Creates a new comment or a reply.
   * ✅ CRITICAL UPDATE: This function now acts as an adapter between the JS frontend
   * (which uses camelCase `parentId`) and the PHP backend (which expects snake_case `parent_id`).
   * @param {string|number} postId - The ID of the post being commented on.
   * @param {object} payload - The comment data.
   * @param {string} payload.body - The text of the comment.
   * @param {string|number|null} payload.parentId - The ID of the parent comment for a reply.
   */
  createComment: (postId, { body, parentId }) => {
    // Transform the payload to match the backend's expected schema.
    const apiPayload = {
      body,
      parent_id: parentId, // Mapping camelCase to snake_case
    };

    return apiRequest({ 
      url: ENDPOINTS.POSTS.COMMENTS.CREATE(postId), 
      method: 'POST', 
      data: apiPayload 
    });
  },
};

export const feedService = apiFeedService;