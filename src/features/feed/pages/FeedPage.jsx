import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import PostCard from '../../../components/Feed/PostCard';
import CommentsModal from '../../../components/Feed/CommentsModal';
import CreatePostModal from '../../../components/Feed/CreatePostModal';
import { useGetStoreProfileQuery } from '../../../services/storeProfileApi';
// Dummy images for demonstration
import userProfilePic from '../../../assets/images/profileImage.png';
import postImage1 from '../../../assets/images/productImages/2.jpeg';
import postImage2 from '../../../assets/images/productImages/3.jpeg';
import postImage3 from '../../../assets/images/feed/2.png';
import userProfilePic2 from '../../../assets/images/feed/2.png';
import userProfilePic3 from '../../../assets/images/feed/3.png';

/**
 * FeedPage Component
 * The main page for displaying a social media feed.
 * Manages posts, and the visibility of Comments and Create Post modals.
 */
const FeedPage = () => {
  // All hooks must be called unconditionally at the top level of the component
  const userId = 'default_user_id';
  const { data: storeProfile, error, isLoading } = useGetStoreProfileQuery(userId);

  // State for managing posts
  const [posts, setPosts] = useState([
    {
      id: 'post-1',
      userName: 'Sasha Stores',
      userProfilePic: userProfilePic,
      timeAgo: '20 min ago',
      location: 'Lagos, Nigeria',
      imageUrl: postImage1,
      text: 'Get this phone at a cheap price for a limited period',
      likes: 500,
      comments: 26,
      shares: 25,
      commentsList: [
        { id: 'c1', userName: 'Adam Chris', userProfilePic: userProfilePic, timeAgo: '1 min', text: 'This product looks really nice, do you deliver nationwide?', likes: 30 },
        { id: 'c2', userName: 'Adam Chris', userProfilePic: userProfilePic, timeAgo: '1 min', text: 'This product looks really nice, do you deliver nationwide?', likes: 30 },
        { id: 'c3', userName: 'Adam Chris', userProfilePic: userProfilePic, timeAgo: '1 min', text: 'This product looks really nice, do you deliver nationwide?', likes: 30 },
        { id: 'c4', userName: 'Sasha Stores', userProfilePic: userProfilePic, timeAgo: '1 min', text: '@Adam Chris We do deliver nationwide.', likes: 0 },
      ],
    },
    {
      id: 'post-2',
      userName: 'Dee Stores',
      userProfilePic: userProfilePic2,
      timeAgo: '1 hr ago',
      location: 'Abuja, Nigeria',
      imageUrl: postImage2,
      text: 'New arrivals just dropped! Check out our latest collection.',
      likes: 120,
      comments: 10,
      shares: 5,
      commentsList: [
        { id: 'c5', userName: 'Jane Doe', userProfilePic: userProfilePic, timeAgo: '5 min', text: 'Love these!', likes: 5 },
      ],
    },
    {
      id: 'post-3',
      userName: 'Sam Stores',
      userProfilePic: userProfilePic3,
      timeAgo: '1 hr ago',
      location: 'Abuja, Nigeria',
      imageUrl: postImage3,
      text: 'New arrivals just dropped! Check out our latest collection.',
      likes: 120,
      comments: 10,
      shares: 5,
      commentsList: [
        { id: 'c5', userName: 'Jane Doe', userProfilePic: userProfilePic, timeAgo: '5 min', text: 'Love these!', likes: 5 },
      ],
    },
  ]);

  // State for active tab: 'myPosts' or 'allPosts'
  const [activeTab, setActiveTab] = useState('myPosts');

  // State for Comments Modal
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);

  // State for Create Post Modal
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // Use fetched colors or fallbacks
  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastColor = useMemo(() => storeProfile?.contrastColor || '#FFFFFF', [storeProfile]);

  const handleCommentClick = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPostForComments(post);
      setShowCommentsModal(true);
    }
  };

  const handleAddComment = (postId, newComment) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, commentsList: [...post.commentsList, newComment], comments: post.comments + 1 }
          : post
      )
    );
    setSelectedPostForComments(prev =>
      prev && prev.id === postId
        ? { ...prev, commentsList: [...prev.commentsList, newComment], comments: prev.comments + 1 }
        : prev
    );
  };

  const handleCreatePost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setShowCreatePostModal(false);
  };

  const handleEditPost = (postId) => {
    alert(`Editing post: ${postId}`);
  };

  const handleDeletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  // Filter posts based on the active tab
  const filteredPosts = useMemo(() => {
    if (activeTab === 'myPosts') {
      return posts.filter(post => post.userName === 'Sasha Stores');
    }
    return posts;
  }, [posts, activeTab]);

  // Conditional Rendering for Loading and Error states
  if (isLoading) {
    return <div className="p-8 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Main content area */}
      <div className="container mx-auto flex flex-col justify-center p-4 md:p-8">
        <div className="lg:w-1/2 sm:w-full mx-auto flex flex-col justify-center">
          {/* My Posts / All Posts Tabs */}
          <div className="flex w-full mb-6 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => setActiveTab('myPosts')}
              className={`flex-1 py-3 text-center font-semibold transition-colors duration-200
              ${activeTab === 'myPosts'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              style={activeTab === 'myPosts' ? { backgroundColor: brandColor } : {}}
            >
              My Posts
            </button>
            <button
              onClick={() => setActiveTab('allPosts')}
              className={`flex-1 py-3 text-center font-semibold transition-colors duration-200
              ${activeTab === 'allPosts'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              style={activeTab === 'allPosts' ? { backgroundColor: brandColor } : {}}
            >
              All Posts
            </button>
          </div>
          <div className="flex space-x-2 ">
            {/* Button to open CreatePostModal */}
            <Button
              className="px-4 py-2 rounded-lg w-full shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: brandColor, color: 'white' }}
              onClick={() => setShowCreatePostModal(true)}
            >
              + Add New Posts
            </Button>
          </div>

          {/* Main Feed Content - Grid of PostCards */}
          <div className="grid grid-cols-1 mt-3 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onCommentClick={handleCommentClick}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                  brandColor={brandColor}
                  contrastColor={contrastColor}
                />
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center">
                {activeTab === 'myPosts' ? 'You have no posts yet. Click "Add New Posts" to create one!' : 'No posts to display.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Comments Modal - Rendered as an overlay/side-panel */}
      {showCommentsModal && selectedPostForComments && (
        <CommentsModal
          isOpen={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          post={selectedPostForComments}
          onAddComment={handleAddComment}
          brandColor={brandColor}
          contrastColor={contrastColor}
        />
      )}

      {/* Create Post Modal - Conditionally rendered based on showCreatePostModal state */}
      {showCreatePostModal && (
        <CreatePostModal
          isOpen={showCreatePostModal}
          onClose={() => setShowCreatePostModal(false)}
          onCreatePost={handleCreatePost}
          brandColor={brandColor}
          contrastColor={contrastColor}
        />
      )}
    </div>
  );
};

export default FeedPage;