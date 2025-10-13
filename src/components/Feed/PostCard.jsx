import React, { useState, useMemo } from 'react';
import { useToast } from '../ui/ToastProvider';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import HeartIcon from '../../assets/icons/Heart.png';
import ShareIcon from '../../assets/icons/sharee.png';
import CommentIcon from '../../assets/icons/comment.png';
import TrashIcon from '../../assets/icons/delete.png';
import PencilSquareIcon from '../../assets/icons/Pencil.png';

const PostCard = ({
  post,
  onCommentClick,
  onEditPost,
  onDelete,
  onLike,
  onShare,
  isOwner,
  brandColor,
}) => {
  // ✅ DEBUGGING STEP 3: Log the props received by the card.
  console.log(`[PostCard] Rendering Post ID: ${post?.id}. Is Owner: ${isOwner}. Image URL: ${post?.imageUrl}`);

  const { push } = useToast();
  const [showEllipsisMenu, setShowEllipsisMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const likeStyle = useMemo(() => ({
    filter: post.isLiked ? `drop-shadow(0 0 4px ${brandColor})` : 'none',
    transform: post.isLiked ? 'scale(1.1)' : 'scale(1)',
  }), [post.isLiked, brandColor]);

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => onShare(post.id))
      .catch(() => push('Failed to copy link.', { type: 'error' }));
  };

  if (!post) {
    console.error("[PostCard] Received null or undefined post prop.");
    return null;
  }

  return (
    <Card className="flex flex-col p-4 rounded-lg shadow-md bg-white w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.userProfilePic || '/default-profile.png'}
            alt={post.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <span className="font-semibold text-gray-900">{post.userName}</span>
            <span className="text-xs text-gray-500 block">{post.location} • {post.timeAgo}</span>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button onClick={() => setShowEllipsisMenu(p => !p)} className="p-1 rounded-full hover:bg-gray-100">
              <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
            </button>
            {showEllipsisMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                <ul className="py-1">
                  <li><button onClick={() => { onEditPost(); setShowEllipsisMenu(false); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><img src={PencilSquareIcon} alt="Edit" className="h-4 w-4 mr-2" />Edit Post</button></li>
                  <li><button onClick={() => { onDelete(post.id); setShowEllipsisMenu(false); }} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"><img src={TrashIcon} alt="Delete" className="h-4 w-4 mr-2" />Delete Post</button></li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {post.text && <p className="text-gray-800 mb-4 whitespace-pre-line">{post.text}</p>}
      
      {post.imageUrl ? (
        <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
          <img src={post.imageUrl} alt="Post content" className="w-full max-h-[400px] object-cover" />
        </div>
      ) : (
        // This block helps us see if the image URL is missing
        <div className="hidden">Image URL is missing: {post.imageUrl}</div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-3 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => onLike(post.id)} className="flex items-center text-sm font-medium text-gray-600 hover:text-red-500">
            <img src={HeartIcon} alt="Likes" className="h-6 w-6 mr-1.5 transition-all" style={likeStyle} />
            <span>{post.likes}</span>
          </button>
          <button onClick={onCommentClick} className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-500">
            <img src={CommentIcon} alt="Comments" className="h-6 w-6 mr-1.5" />
            <span>{post.comments}</span>
          </button>
          <button onClick={handleShare} className="flex items-center text-sm font-medium text-gray-600 hover:text-green-500">
            <img src={ShareIcon} alt="Shares" className="h-6 w-6 mr-1.5" />
            <span>{post.shares}</span>
          </button>
        </div>
        {!isOwner && (
            <Button
                type="button"
                onClick={() => setIsFollowing(p => !p)}
                className={`px-4 py-1.5 text-sm rounded-full ${isFollowing ? 'bg-gray-200 text-gray-800' : ''}`}
                style={!isFollowing ? { backgroundColor: brandColor, color: '#FFFFFF' } : {}}
            >
                {isFollowing ? 'Following' : 'Follow Store'}
            </Button>
        )}
      </div>
    </Card> 
  );
};

export default PostCard;