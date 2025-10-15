import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import PostCard from '../../../components/Feed/PostCard';
import CommentsPanel from '../../../components/Feed/CommentsModal';
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

// Utility to convert relative URLs to absolute
const toAbsolute = (url) => (!url || url.startsWith('http') || url.startsWith('blob:') ? url : `${ASSETS_BASE}${url}`);

const FeedPage = () => {
  const dispatch = useDispatch();
  const { push } = useToast();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const storeIdFilter = searchParams.get('storeId') || '';

  // --- DATA FETCHING ---
  const { data: posts = [], isLoading: postsLoading, error: postsError } = useGetPostsQuery();
  const { data: filterStoreProfile } = useStoreProfile(storeIdFilter, { enabled: !!storeIdFilter });

  // --- UI & THEME VALUES ---
  const userProfilePic = toAbsolute(user?.store?.profile_image) || '/default-profile.png';
  const brandColor = user?.store?.theme_color || '#EF4444';
  const contrastColor = getContrastTextColor(brandColor);

  // --- MUTATIONS ---
  const createPostMutation = useCreatePostMutation({
    onSuccess: () => { push('Post created!'); setShowCreateModal(false); },
    onError: (e) => push(e.data?.message || 'Failed to create post.', { type: 'error' }),
  });

  const updatePostMutation = useUpdatePostMutation({
    onSuccess: () => { push('Post updated!'); setShowEditModal(false); },
    onError: (e) => push(e.data?.message || 'Failed to update post.', { type: 'error' }),
  });

  const deletePostMutation = useDeletePostMutation({
    onSuccess: () => push('Post deleted.'),
    onError: (e) => push(e.data?.message || 'Failed to delete post.', { type: 'error' }),
  });

  // This mutation is now correctly configured to accept `parentId` for replies.
  const createCommentMutation = useCreateCommentMutation({
    onSuccess: () => push('Comment added!'),
    onError: (e) => push(e.data?.message || 'Failed to add comment.', { type: 'error' }),
  });

  const likePostMutation = useLikePostMutation();
  const sharePostMutation = useSharePostMutation({ onSuccess: () => push('Post link copied to clipboard!') });

  // --- LOCAL STATE ---
  const [activeTab, setActiveTab] = useState('allPosts');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);

  // --- EFFECTS & DATA PROCESSING ---
  useEffect(() => {
    if (postsError) {
      console.error('[FeedPage] Error fetching posts:', postsError);
      push(postsError.message || 'Failed to load posts.', { type: 'error' });
    }
  }, [postsError, push]);

  // Memoized calculation to filter posts based on the active tab and URL search params.
  const visiblePosts = useMemo(() => {
    let filtered = posts;
    if (storeIdFilter) {
      filtered = posts.filter((p) => String(p.userId) === String(storeIdFilter));
    }
    if (activeTab === 'myPosts' && isAuthenticated) {
      filtered = filtered.filter((p) => String(p.userId) === String(user.id));
    }
    return filtered;
  }, [posts, activeTab, user, isAuthenticated, storeIdFilter]);

  // --- EVENT HANDLERS ---
  const handleCreatePost = (payload) => createPostMutation.mutate(payload);
  const handleEditPost = (postId, payload) => updatePostMutation.mutate({ postId, payload });
  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId);
    }
  };

  // This handler is passed to the CommentsPanel. It captures the parentId for replies.
  const handleAddComment = (postId, commentText, parentId = null) => {
    createCommentMutation.mutate({ postId, body: commentText, parentId });
  };

  const handleLikePost = (postId) => {
    if (isAuthenticated) {
      likePostMutation.mutate(postId);
    } else {
      dispatch(openModal('login'));
    }
  };

  const handleSharePost = (postId) => sharePostMutation.mutate(postId);

  const handleCommentClick = (post) => {
    console.log("Clicked post:", post);
    setSelectedPostForComments(post);
  };

  const handleEditClick = (post) => {
    setPostToEdit(post);
    setShowEditModal(true);
  };

  const clearStoreFilter = () => {
    searchParams.delete('storeId');
    setSearchParams(searchParams, { replace: true });
  };

  // --- RENDER LOGIC ---

  // Loading Skeleton
  if (postsLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          <main className="lg:col-span-7 space-y-6">
            <Skeleton height={50} />
            <Skeleton height={60} />
            <Skeleton height={350} />
            <Skeleton height={350} />
          </main>
          <aside className="hidden lg:block lg:col-span-5 sticky top-4">
            <Skeleton height={800} className="rounded-xl" />
          </aside>
        </div>
      </div>
    );
  }

  // Filter Banner
  const filterBanner = storeIdFilter && (
    <div className="mb-4 flex items-center justify-between rounded-md bg-yellow-50 p-3 text-sm">
      <div className="text-gray-700">
        Viewing posts from: <span className="font-semibold">{filterStoreProfile?.storeName || '...'}</span>
      </div>
      <button
        type="button"
        onClick={clearStoreFilter}
        className="rounded px-3 py-1 text-xs font-semibold bg-yellow-200 hover:bg-yellow-300"
      >
        Clear Filter
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Two-column grid setup */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">

          {/* Left Column: Feed Content (7/12) */}
          <main className="lg:col-span-7">
            {filterBanner}

            {/* Tabs */}
            <div className="flex w-full mb-6 gap-2">
              {['myPosts', 'allPosts'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 cursor-pointer text-center rounded-xl font-semibold transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-700'
                    }`}
                  style={{
                    backgroundColor: activeTab === tab ? brandColor : 'white',
                    border: '1px solid #e5e7eb',
                  }}
                  aria-pressed={activeTab === tab}
                >
                  {tab === 'myPosts' ? 'My Posts' : storeIdFilter ? 'Store Posts' : 'All Posts'}
                </button>
              ))}
            </div>


            {/* Create Post Button */}
            <Button
              type="button"
              className={`px-4 py-2 rounded-xl w-full shadow-sm hover:shadow-md transition-shadow mb-3 ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: brandColor, color: contrastColor }}
              onClick={() => (isAuthenticated ? setShowCreateModal(true) : dispatch(openModal('login')))}
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? '+ Add New Post' : 'Sign in to post'}
            </Button>

            {/* Posts */}
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
          </main>

          {/* Right Column: Comments Panel (5/12) - Sticky */}
          <aside className="hidden lg:block lg:col-span-5 sticky top-4">
            {selectedPostForComments ? (
              <CommentsPanel
                post={selectedPostForComments}
                onAddComment={handleAddComment}
                isCommenting={createCommentMutation.isLoading}
                isAuthenticated={isAuthenticated}
                brandColor={brandColor}
              />
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-6rem)] max-h-[850px] bg-white border border-gray-200 shadow-xl rounded-xl text-center p-4">
                <p className="text-gray-500">Click the comment icon on a post to view comments here.</p>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Modals (remain outside the grid) */}
      {showCreateModal && (
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreatePost={handleCreatePost}
          isSubmitting={createPostMutation.isLoading}
          brandColor={brandColor}
          contrastColor={contrastColor}
          userProfilePic={userProfilePic}
        />
      )}
      {showEditModal && postToEdit && (
        <EditPostModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setPostToEdit(null); }}
          onEditPost={handleEditPost}
          isSubmitting={updatePostMutation.isLoading}
          post={postToEdit}
          brandColor={brandColor}
          contrastColor={contrastColor}
          userProfilePic={userProfilePic}
        />
      )}
    </div>
  );
};

export default FeedPage;