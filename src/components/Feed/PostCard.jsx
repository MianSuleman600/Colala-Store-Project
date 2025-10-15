import React, { useState, useMemo } from 'react';
import { useToast } from '../ui/ToastProvider';
import Card from '../ui/Card';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import HeartIcon from '../../assets/icons/Heart.png';
import ShareIcon from '../../assets/icons/sharee.png';
import CommentIcon from '../../assets/icons/comment.png';
import TrashIcon from '../../assets/icons/delete.png';
import PencilSquareIcon from '../../assets/icons/Pencil.png';
import DownloadIcon from '../../../public/icons/download.png'; // download icon

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

  const { push } = useToast();
  const [showEllipsisMenu, setShowEllipsisMenu] = useState(false);

  const likeStyle = useMemo(() => ({
    filter: post.isLiked ? `drop-shadow(0 0 4px ${brandColor})` : 'none',
    transform: post.isLiked ? 'scale(1.1)' : 'scale(1)',
  }), [post.isLiked, brandColor]);

  // ✅ Share logic (used in both button and menu)
  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        onShare(post.id);
        push('Post link copied to clipboard!', { type: 'success' });
      })
      .catch(() => push('Failed to copy link.', { type: 'error' }));
  };

  const handleDownload = () => {
    if (!post.imageUrl) {
      push('No image available to download.', { type: 'error' });
      return;
    }

    const link = document.createElement('a');
    link.href = post.imageUrl;
    link.download = `post_${post.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    push('Image downloaded successfully!', { type: 'success' });
  };

  if (!post) return null;

  return (
    <Card className="flex flex-col p-4 rounded-lg  bg-white w-full mx-auto">
      {/* Header */}
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
            <button
              onClick={() => setShowEllipsisMenu(p => !p)}
              className="p-1 rounded-full cursor-pointer hover:bg-gray-100"
            >
              <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
            </button>

            {/* Ellipsis Menu */}
            {showEllipsisMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white border rounded-md shadow-lg z-10">
                <ul className="py-1">
                  {/* ✅ Share This Post */}
                  <li>
                    <button
                      onClick={() => { handleShare(); setShowEllipsisMenu(false); }}
                      className="flex items-center w-full px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100"
                    >
                      <img src={ShareIcon} alt="Share" className="h-4 w-4 mr-2" />
                      Share This Post
                    </button>
                  </li>

                  {/* Edit Post */}
                  <li>
                    <button
                      onClick={() => { onEditPost(); setShowEllipsisMenu(false); }}
                      className="flex items-center w-full cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <img src={PencilSquareIcon} alt="Edit" className="h-4 w-4 mr-2" />
                      Edit Post
                    </button>
                  </li>

                  {/* Delete Post (Red) */}
                  <li>
                    <button
                      onClick={() => { onDelete(post.id); setShowEllipsisMenu(false); }}
                      className="flex items-center w-full px-4  cursor-pointer py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <img src={TrashIcon} alt="Delete" className="h-4 w-4 mr-2" />
                      Delete Post
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Post Text */}
      {post.text && (
        <span className="bg-gray-100 p-4 flex items-center rounded-xl text-start">
          <p className="text-gray-800 whitespace-pre-line">{post.text}</p>
        </span>
      )}

      {/* Post Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-3 gap-4">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center cursor-pointer text-sm font-medium text-gray-600 hover:text-red-500"
          >
            <img src={HeartIcon} alt="Likes" className="h-6 w-6 mr-1.5 transition-all" style={likeStyle} />
            <span>{post.likes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={onCommentClick}
            className="flex cursor-pointer items-center text-sm font-medium text-gray-600 hover:text-blue-500"
          >
            <img src={CommentIcon} alt="Comments" className="h-6 w-6 mr-1.5" />
            <span>{post.comments}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex cursor-pointer items-center text-sm font-medium text-gray-600 hover:text-green-500"
          >
            <img src={ShareIcon} alt="Shares" className="h-6 w-6 mr-1.5" />
            <span>{post.shares}</span>
          </button>
        </div>

        {/* Download */}
        {post.imageUrl && (
          <button
            onClick={handleDownload}
            className="flex cursor-pointer items-center px-4 py-1.5 text-sm hover:bg-gray-300"
          >
            <img src={DownloadIcon} alt="Download" className="h-6 w-6 mr-2" />
            
          </button>
        )}
      </div>
    </Card>
  );
};

export default PostCard;
