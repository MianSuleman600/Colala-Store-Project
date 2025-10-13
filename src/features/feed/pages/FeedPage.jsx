import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import PostCard from '../../../components/Feed/PostCard';
import CommentsModal from '../../../components/Feed/CommentsModal';
import CreatePostModal from '../../../components/Feed/CreatePostModal';
import EditPostModal from '../../../components/Feed/EditPostModal';
import { useGetPostsQuery } from '../../../services/queries/useFeedQuery';
import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreateCommentMutation,
  useLikePostMutation,
  useSharePostMutation,
} from '../../../services/mutations/useFeedMutation';
import { useToast } from '../../../components/ui/ToastProvider';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { openModal } from '../../../redux/modalSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ASSETS_BASE } from '../../../api/apiConfig';

const toAbsolute = (url) => {
    if (!url || url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${ASSETS_BASE}${url}`;
};

const FeedPage = () => {
  const { push } = useToast();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const storeIdFilter = searchParams.get('storeId') || '';

  const { data: posts = [], isLoading: postsLoading, error: postsError } = useGetPostsQuery();
  
  const { data: filterStoreProfile } = useStoreProfile(storeIdFilter, { enabled: !!storeIdFilter });

  const userProfilePic = toAbsolute(user?.store?.profile_image) || '/default-profile.png';
  const brandColor = user?.store?.theme_color || '#EF4444';
  const contrastColor = getContrastTextColor(brandColor);

  const createPostMutation = useCreatePostMutation({ onSuccess: () => { push('Post created!'); setShowCreateModal(false); }, onError: (e) => push(e.data?.message || 'Failed to create post.', { type: 'error' }) });
  const updatePostMutation = useUpdatePostMutation({ onSuccess: () => { push('Post updated!'); setShowEditModal(false); }, onError: (e) => push(e.data?.message || 'Failed to update post.', { type: 'error' }) });
  const deletePostMutation = useDeletePostMutation({ onSuccess: () => push('Post deleted.'), onError: (e) => push(e.data?.message || 'Failed to delete post.', { type: 'error' }) });
  const createCommentMutation = useCreateCommentMutation({ onError: (e) => push(e.data?.message || 'Failed to add comment.', { type: 'error' }) });
  const likePostMutation = useLikePostMutation();
  const sharePostMutation = useSharePostMutation({ onSuccess: () => push('Post link copied to clipboard!') });

  const [activeTab, setActiveTab] = useState('allPosts');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);

  useEffect(() => {
    if (postsError) {
      console.error("[FeedPage] Error fetching posts:", postsError);
      push(postsError.message || 'Failed to load posts.', { type: 'error' });
    }
  }, [postsError, push]);

  const visiblePosts = useMemo(() => {
    let filtered = posts;
    if (storeIdFilter) {
      filtered = posts.filter(p => String(p.userId) === String(storeIdFilter));
    }
    if (activeTab === 'myPosts' && isAuthenticated) {
      // ✅ DEBUGGING STEP 2: Log the IDs being compared.
      console.log(`[FeedPage] Filtering for "My Posts". Current Logged-in User ID:`, user?.id, `(Type: ${typeof user?.id})`);
      
      return filtered.filter(p => {
        const isMatch = String(p.userId) === String(user.id);
        // This will print the comparison for every single post when the "My Posts" tab is active.
        if (!isMatch) { // Log only mismatches to reduce noise
          console.warn(`[FeedPage] MISMATCH: Post ID: ${p.id}, Post UserID: ${p.userId} (Type: ${typeof p.userId}) !== Logged-in UserID: ${user.id} (Type: ${typeof user.id})`);
        }
        return isMatch;
      });
    }
    return filtered;
  }, [posts, activeTab, user, isAuthenticated, storeIdFilter]);

  const handleCreatePost = (payload) => createPostMutation.mutate(payload);
  const handleEditPost = (postId, payload) => updatePostMutation.mutate({ postId, payload });
  const handleDeletePost = (postId) => { if (window.confirm('Are you sure you want to delete this post?')) deletePostMutation.mutate(postId); };
  const handleAddComment = (postId, commentText) => createCommentMutation.mutate({ postId, body: commentText });
  const handleLikePost = (postId) => { if (isAuthenticated) { likePostMutation.mutate(postId); } else { dispatch(openModal('login')); }};
  const handleSharePost = (postId) => sharePostMutation.mutate(postId);
  
  const handleCommentClick = (post) => { setSelectedPostForComments(post); setShowCommentsModal(true); };
  const handleEditClick = (post) => { setPostToEdit(post); setShowEditModal(true); };
  
  const clearStoreFilter = () => {
    searchParams.delete('storeId');
    setSearchParams(searchParams, { replace: true });
  };

  if (postsLoading) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="lg:w-1/2 sm:w-full mx-auto space-y-6">
                <Skeleton height={50} />
                <Skeleton height={60} />
                <Skeleton height={350} />
                <Skeleton height={350} />
            </div>
        </div>
    );
  }

  const filterBanner = storeIdFilter ? (
    <div className="mb-4 flex items-center justify-between rounded-md bg-yellow-50 p-3 text-sm">
      <div className="text-gray-700">
        Viewing posts from: <span className="font-semibold">{filterStoreProfile?.storeName || '...'}</span>
      </div>
      <button type="button" onClick={clearStoreFilter} className="rounded px-3 py-1 text-xs font-semibold bg-yellow-200 hover:bg-yellow-300">
        Clear Filter
      </button>
    </div>
  ) : null;

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto flex flex-col justify-center p-4 md:p-8">
        <div className="lg:w-1/2 sm:w-full mx-auto flex flex-col justify-center">
          {filterBanner}

          <div className="flex w-full mb-6 rounded-lg overflow-hidden shadow-sm">
            <button type="button" onClick={() => setActiveTab('myPosts')} className={`flex-1 py-3 text-center font-semibold transition-colors`} style={activeTab === 'myPosts' ? { backgroundColor: brandColor, color: contrastColor } : { backgroundColor: 'white', color: '#374151' }} aria-pressed={activeTab === 'myPosts'}>
              My Posts
            </button>
            <button type="button" onClick={() => setActiveTab('allPosts')} className={`flex-1 py-3 text-center font-semibold transition-colors`} style={activeTab === 'allPosts' ? { backgroundColor: brandColor, color: contrastColor } : { backgroundColor: 'white', color: '#374151' }} aria-pressed={activeTab === 'allPosts'}>
              {storeIdFilter ? 'Store Posts' : 'All Posts'}
            </button>
          </div>

          <Button
            type="button"
            className={`px-4 py-2 rounded-lg w-full shadow-sm hover:shadow-md transition-shadow mb-3 ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: brandColor, color: contrastColor }}
            onClick={() => isAuthenticated ? setShowCreateModal(true) : dispatch(openModal('login'))}
            disabled={!isAuthenticated}
          >
            {isAuthenticated ? '+ Add New Post' : 'Sign in to post'}
          </Button>

          <div className="grid grid-cols-1 gap-6">
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onCommentClick={() => handleCommentClick(post)}
                  onEditPost={() => handleEditClick(post)}
                  onDelete={handleDeletePost}
                  onLike={handleLikePost}
                  onShare={handleSharePost}
                  isOwner={isAuthenticated && String(user?.id) === String(post.userId)}
                  brandColor={brandColor}
                />
              ))
            ) : (
              <div className="text-gray-600 col-span-full text-center p-8 bg-white rounded-lg shadow-sm">
                No posts to display in this view.
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && <CreatePostModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onCreatePost={handleCreatePost} isSubmitting={createPostMutation.isLoading} brandColor={brandColor} contrastColor={contrastColor} userProfilePic={userProfilePic} />}
      {showEditModal && postToEdit && <EditPostModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setPostToEdit(null); }} onEditPost={handleEditPost} isSubmitting={updatePostMutation.isLoading} post={postToEdit} brandColor={brandColor} contrastColor={contrastColor} userProfilePic={userProfilePic} />}
      {showCommentsModal && selectedPostForComments && <CommentsModal isOpen={showCommentsModal} onClose={() => setShowCommentsModal(false)} post={selectedPostForComments} onAddComment={handleAddComment} isCommenting={createCommentMutation.isLoading} brandColor={brandColor} contrastColor={contrastColor} currentUserProfilePic={userProfilePic} isAuthenticated={isAuthenticated} />}
    </div>
  );
};

export default FeedPage;