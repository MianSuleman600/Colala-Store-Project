import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { toggleLike } from '../../features/feed/pages/likesSlice';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

import HeartIcon from '../../assets/icons/Heart.png';
import ShareIcon from '../../assets/icons/sharee.png';
import CommentIcon from '../../assets/icons/comment.png';
import TrashIcon from '../../assets/icons/delete.png';
import PencilSquareIcon from '../../assets/icons/Pencil.png';

const noop = () => { };
 
const PostCard = ({
  post,
  onCommentClick = noop,
  onEditPost = noop,     // receives full post
  onDelete,              // preferred: (id) => void
  onDeletePost,          // legacy fallback: (id) => void
  initialIsFollowing = false,
  contrastColor = '#FFFFFF',
  brandColor = '#EF4444',
  notify = noop,         // toast push
  isLoggedIn = false,
}) => {
  const dispatch = useDispatch();
  const likeStatus = useSelector((state) => state.likes.likesByPostId[post.id]) || {
    liked: false,
    count: post.likes ?? 0,
  };

  const [showEllipsisMenu, setShowEllipsisMenu] = React.useState(false);
  const [isFollowing, setIsFollowing] = React.useState(initialIsFollowing);

  const likeStyle = useMemo(
    () => ({
      color: likeStatus.liked ? brandColor : '#6B7280',
      filter: likeStatus.liked ? `drop-shadow(0 0 2px ${brandColor})` : 'none',
    }),
    [likeStatus.liked, brandColor]
  );

  const handleLike = () => {
    dispatch(toggleLike({ postId: post.id, currentCount: likeStatus.count }));
  };

  const handleShare = async () => {
    try {
      const postUrl = `${window.location.origin}/post/${post.id}`;
      await navigator.clipboard.writeText(postUrl);
      notify('Post link copied to clipboard!', { type: 'success' });
    } catch {
      notify('Failed to copy link.', { type: 'error' });
    }
  };

  const handleDownload = async () => {
    if (!post.imageUrl) {
      notify('No image available to download.', { type: 'info' });
      return;
    }

    try {
      const response = await fetch(post.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `post-${post.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      notify('Image downloaded!', { type: 'success' });
    } catch {
      notify('Failed to download image.', { type: 'error' });
    }
  };

  const handleEdit = () => {
    onEditPost(post);
    setShowEllipsisMenu(false);
  };

  const handleDelete = () => {
    const fn = onDelete || onDeletePost || noop;
    fn(post.id);
    setShowEllipsisMenu(false);
  };

  const handleFollowToggle = () => setIsFollowing((prev) => !prev);

  return (
    <Card className="relative flex flex-col p-4 rounded-lg shadow-md bg-white w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.userProfilePic || '/default-profile.png'}
            alt={post.userName || 'User'}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => (e.currentTarget.src = '/default-profile.png')}
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{post.userName || 'Unknown User'}</span>
            <span className="text-xs text-gray-500">
              {post.location || '—'} • {post.createdAt ? new Date(post.createdAt).toLocaleString() : post.timeAgo || 'Just now'}
            </span>
          </div>
        </div>

        {/* Ellipsis Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEllipsisMenu((prev) => !prev)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-haspopup="menu"
            aria-expanded={showEllipsisMenu}
          >
            <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
          </button>
          {showEllipsisMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
              <ul className="py-1" role="menu">
                <li>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <img src={PencilSquareIcon} alt="Edit" className="h-4 w-4 mr-2" />
                    Edit Post
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    role="menuitem"
                  >
                    <img src={TrashIcon} alt="Delete" className="h-4 w-4 mr-2" />
                    Delete Post
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full h-64 object-cover"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
      )}

      {/* Post Text */}
      {post.text && <p className="text-gray-800 mb-4 whitespace-pre-line">{post.text}</p>}

      {/* Interaction Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-top border-gray-100 pt-3 gap-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center text-sm"
            style={{ color: likeStyle.color }}
            aria-pressed={likeStatus.liked}
            aria-label="Like"
          >
            <img src={HeartIcon} alt="Likes" className="h-6 w-6 mr-1" style={{ filter: likeStyle.filter }} />
            <span>{likeStatus.count}</span>
          </button>

          <button
            type="button"
            onClick={() => onCommentClick(post.id)}
            className="flex items-center text-gray-600 hover:text-blue-500 text-sm"
            aria-label="Comment"
          >
            <img src={CommentIcon} alt="Comments" className="h-6 w-6 mr-1" />
            <span>{Array.isArray(post.comments) ? post.comments.length : 0}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center text-gray-600 hover:text-green-500 text-sm"
            aria-label="Share"
          >
            <img src={ShareIcon} alt="Shares" className="h-6 w-6 mr-1" />
            <span>{post.shares ?? 0}</span>
          </button>
        </div>

        <div className="flex justify-around  items-center gap-3">
          <Button
            type="button"
            onClick={handleFollowToggle}
            className={`px-3 py-1.5 text-sm  rounded-full ${isFollowing ? 'bg-gray-200 text-gray-800' : ''}`}
            style={!isFollowing ? { backgroundColor: brandColor, color: contrastColor } : {}}
            aria-pressed={isFollowing}
          >
            {isFollowing ? 'Following' : 'Follow Store'}
          </Button>


          {post.imageUrl && (
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center  text-gray-600 hover:text-indigo-500 text-sm"
              title="Download Image"
              aria-label="Download image"
            >
              <img src='/icons/download.png' alt="Download" className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </Card> 
  );
};

export default PostCard;