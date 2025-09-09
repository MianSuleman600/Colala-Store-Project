import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import PostCard from '../../../components/Feed/PostCard';
import CommentsModal from '../../../components/Feed/CommentsModal';
import CreatePostModal from '../../../components/Feed/CreatePostModal';
import EditPostModal from '../../../components/Feed/EditPostModal';
import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useGetPostsQuery } from '../../../services/queries/useFeedQuery';
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreateCommentMutation,
} from '../../../services/mutations/useFeedMutation';
import { useToast } from '../../../components/ui/ToastProvider';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { hydrateImage } from '../../../utils/dataNormalizer';

const FeedPage = () => {
  const { push } = useToast();
  const { isLoggedIn, userName, userId } = useSelector((s) => s.user);

  // Queries
  const { data: postsData, isLoading: postsLoading, error: postsError } = useGetPostsQuery();
  const { data: storeProfileData, isLoading: profileLoading, error: profileError } = useStoreProfile(userId, {
    enabled: Boolean(userId),
  });

  // Extract user/store info and hydrate profile image
  const storeProfile = storeProfileData || null;
  const userProfilePic = hydrateImage(storeProfile?.profilePictureUrl) || '/default-profile.png';
  const defaultUserName = storeProfile?.storeName || userName || 'You';

  // Brand colors (always computed before any return)
  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  // Mutations
  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation();
  const deletePostMutation = useDeletePostMutation();
  const createCommentMutation = useCreateCommentMutation();

  // Local state
  const [localPosts, setLocalPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('allPosts');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);

  // Sync posts with server and ensure comments are arrays
  useEffect(() => {
    if (!postsData) return;
    const incoming = Array.isArray(postsData) ? postsData : postsData.posts || [];
    const hydrated = incoming.map((p) => ({
      ...p,
      comments: Array.isArray(p.comments) ? p.comments : [],
      userProfilePic: hydrateImage(p.userProfilePic) || '/default-profile.png',
      imageUrl: hydrateImage(p.imageUrl),
    }));
    setLocalPosts(hydrated);
  }, [postsData]);

  // Sync user profile data with posts once it's loaded
  useEffect(() => {
    if (!storeProfileData) return;
    setLocalPosts((prev) =>
      prev.map((post) =>
        post.userId === userId &&
        (post.userName !== defaultUserName || post.userProfilePic !== userProfilePic)
          ? { ...post, userName: defaultUserName, userProfilePic }
          : post
      )
    );
  }, [storeProfileData, userId, defaultUserName, userProfilePic]);

  // IMPORTANT: compute hooks BEFORE any conditional returns
  const filteredPosts = useMemo(
    () => (activeTab === 'myPosts' ? localPosts.filter((p) => p.userId === userId) : localPosts),
    [activeTab, localPosts, userId]
  );

  // ---- CREATE POST ----
  const handleCreatePost = async (payload) => {
    const tempId = `temp-${Date.now()}`;
    const postText = payload?.get ? payload.get('text') : payload?.text || '';
    const postImage =
      payload?.get && payload.get('image')
        ? URL.createObjectURL(payload.get('image'))
        : hydrateImage(payload?.imageUrl);

    const optimisticPost = {
      id: tempId,
      text: postText,
      imageUrl: postImage,
      userName: defaultUserName,
      userProfilePic,
      userId,
      comments: [],
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setLocalPosts((prev) => [optimisticPost, ...prev]);

    try {
      const serverResponse = await createPostMutation.mutateAsync(payload);
      const finalPayload = serverResponse?.data || serverResponse;
      const finalPost = {
        ...optimisticPost,
        ...finalPayload,
        userName: defaultUserName,
        userProfilePic,
        comments: Array.isArray(finalPayload?.comments) ? finalPayload.comments : [],
        isOptimistic: false,
      };
      setLocalPosts((prev) => prev.map((p) => (p.id === tempId ? finalPost : p)));
      push('Post created successfully!', { type: 'success' });
    } catch {
      setLocalPosts((prev) => prev.filter((x) => x.id !== tempId));
      push('Failed to create post', { type: 'error' });
    }
  };

  // ---- EDIT POST ----
  const handleEditPost = async (postId, payload) => {
    const oldPost = localPosts.find((p) => p.id === postId);
    if (!oldPost) return;

    const optimisticPost = {
      ...oldPost,
      text: payload?.get ? payload.get('text') : payload?.text || oldPost.text,
      imageUrl: payload?.get && payload.get('image') ? URL.createObjectURL(payload.get('image')) : oldPost.imageUrl,
    };

    setLocalPosts((prev) => prev.map((p) => (p.id === postId ? optimisticPost : p)));

    try {
      const serverResponse = await updatePostMutation.mutateAsync({ postId, payload });
      const srv = serverResponse?.data || serverResponse;
      const finalPost = {
        ...optimisticPost,
        ...srv,
        comments: Array.isArray(srv?.comments) ? srv.comments : optimisticPost.comments,
      };
      setLocalPosts((prev) => prev.map((p) => (p.id === postId ? finalPost : p)));
      push('Post updated successfully!', { type: 'success' });
    } catch {
      setLocalPosts((prev) => prev.map((p) => (p.id === postId ? oldPost : p)));
      push('Failed to update post', { type: 'error' });
    }
  };

  // ---- DELETE POST ----
  const handleDeletePost = async (postId) => {
    const oldPosts = [...localPosts];
    setLocalPosts((prev) => prev.filter((p) => p.id !== postId));

    try {
      await deletePostMutation.mutateAsync(postId);
      push('Post deleted', { type: 'success' });
    } catch {
      setLocalPosts(oldPosts);
      push('Failed to delete post', { type: 'error' });
    }
  };

  // ---- COMMENTS ----
  const handleCommentClick = (postId) => {
    const post = localPosts.find((p) => p.id === postId);
    if (post) {
      setSelectedPostForComments(post);
      setShowCommentsModal(true);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    const tempComment = {
      id: `temp-${Date.now()}`,
      text: commentText,
      userName: defaultUserName,
      userProfilePic,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setLocalPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: Array.isArray(p.comments) ? [...p.comments, tempComment] : [tempComment] }
          : p
      )
    );

    try {
      const serverComment = await createCommentMutation.mutateAsync({ postId, comment: commentText });
      setLocalPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: (p.comments || []).map((c) =>
                  c.id.startsWith('temp-') ? serverComment.data || serverComment : c
                ),
              }
            : p
        )
      );
    } catch {
      push('Failed to add comment', { type: 'error' });
    }
  };

  // Guards AFTER all hooks are declared
  if (postsLoading || (isLoggedIn && profileLoading)) {
    return <div className="p-8 text-center text-gray-600">Loading...</div>;
  }
  if (postsError || (isLoggedIn && profileError)) {
    return (
      <div className="p-8 text-center text-red-600">
        {postsError?.message || profileError?.message}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto flex flex-col justify-center p-4 md:p-8">
        <div className="lg:w-1/2 sm:w-full mx-auto flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex w-full mb-6 rounded-lg overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('myPosts')}
              className={`flex-1 py-3 text-center font-semibold ${
                activeTab === 'myPosts' ? '' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === 'myPosts' ? { backgroundColor: brandColor, color: contrastColor } : {}}
              aria-pressed={activeTab === 'myPosts'}
            >
              My Posts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('allPosts')}
              className={`flex-1 py-3 text-center font-semibold ${
                activeTab === 'allPosts' ? '' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === 'allPosts' ? { backgroundColor: brandColor, color: contrastColor } : {}}
              aria-pressed={activeTab === 'allPosts'}
            >
              All Posts
            </button>
          </div>

          {/* Create Post Button */}
          <Button
            type="button"
            className={`px-4 py-2 rounded-lg w-full shadow-sm hover:shadow-md transition-shadow mb-3 ${
              !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: brandColor, color: contrastColor }}
            onClick={() => isLoggedIn && setShowCreateModal(true)}
            disabled={!isLoggedIn}
            aria-disabled={!isLoggedIn}
          >
            {isLoggedIn ? '+ Add New Post' : 'Sign in to post'}
          </Button>

          {/* Post List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    ...post,
                    comments: Array.isArray(post.comments) ? post.comments : [],
                  }}
                  onCommentClick={handleCommentClick}
                  onEditPost={(p) => {
                    setPostToEdit(p);
                    setShowEditModal(true);
                  }}
                  onDelete={(id) => handleDeletePost(id)}
                  brandColor={brandColor}
                  contrastColor={contrastColor}
                  notify={push}
                  isLoggedIn={isLoggedIn}
                  currentUserId={userId}
                />
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center">
                {activeTab === 'myPosts' ? 'You have no posts yet.' : 'No posts to display.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreatePost={handleCreatePost}
          brandColor={brandColor}
          contrastColor={contrastColor}
          userProfilePic={userProfilePic}
          defaultUserName={defaultUserName}
        />
      )}

      {showEditModal && postToEdit && (
        <EditPostModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setPostToEdit(null);
          }}
          onEditPost={handleEditPost}
          post={postToEdit}
          brandColor={brandColor}
          contrastColor={contrastColor}
          userProfilePic={userProfilePic}
        />
      )}

      {showCommentsModal && selectedPostForComments && (
        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          post={{
            ...selectedPostForComments,
            comments: Array.isArray(selectedPostForComments.comments)
              ? selectedPostForComments.comments
              : [],
          }}
          onAddComment={handleAddComment}
          brandColor={brandColor}
          contrastColor={contrastColor}
          currentUserProfilePic={userProfilePic}
          currentUserName={defaultUserName}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
};

export default FeedPage;