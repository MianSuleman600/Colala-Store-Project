import React, { useState, useRef, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useGetPostCommentsQuery } from '../../services/queries/useFeedQuery';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CommentsModal = ({
  isOpen,
  onClose,
  post,
  onAddComment,
  isCommenting,
  brandColor,
  contrastColor,
  currentUserProfilePic,
  isAuthenticated,
}) => {
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef(null);

  const { data: comments = [], isLoading: commentsLoading } = useGetPostCommentsQuery(post?.id, {
    enabled: isOpen && !!post?.id,
  });

  const handleCommentSubmit = () => {
    if (!newComment.trim() || !post?.id || !isAuthenticated || isCommenting) return;
    // ✅ CORRECTED: The parent handler expects only the comment text.
    onAddComment(post.id, newComment.trim());
    setNewComment('');
  };

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments.length]);

  if (!isOpen || !post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Comments on ${post.userName}'s post`} className="max-w-xl w-full h-[80vh] flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {commentsLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton count={3} height={60} />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-500 p-8">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <img src={comment.userProfilePic || '/default-profile.png'} alt={comment.userName} className="w-8 h-8 rounded-full object-cover" />
              <div className="flex-grow p-3 bg-gray-100 rounded-xl">
                <div className="flex items-baseline space-x-2">
                    <span className="font-semibold text-gray-900 text-sm">{comment.userName}</span>
                    <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                </div>
                <p className="text-gray-800 text-sm mt-1 whitespace-pre-line">{comment.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={commentsEndRef} />
      </div>
      <div className="p-4 border-t flex items-center space-x-3 bg-white">
        {isAuthenticated ? (
          <>
            <img src={currentUserProfilePic} alt="You" className="w-8 h-8 rounded-full object-cover" />
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-grow p-3 rounded-full bg-gray-100 border focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': brandColor }}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(); }}
            />
            <Button
              type="button"
              onClick={handleCommentSubmit}
              className="p-3 rounded-full"
              style={{ backgroundColor: brandColor, color: contrastColor }}
              disabled={!newComment.trim() || isCommenting}
            >
              {isCommenting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <PaperAirplaneIcon className="h-5 w-5" />}
            </Button>
          </>
        ) : (
          <div className="w-full text-center text-gray-500 p-3 rounded-full bg-gray-100 border">
            Sign in to leave a comment.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CommentsModal;