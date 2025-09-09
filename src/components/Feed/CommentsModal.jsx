import React, { useState, useEffect, useRef, useMemo } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ChatBubbleOvalLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

const CommentsModal = ({
  isOpen,
  onClose,
  post,
  onAddComment, // (postId, text)
  brandColor = '#EF4444',
  contrastColor = '#FFFFFF',
  currentUserProfilePic,
  currentUserName = 'You',
  isLoggedIn,
}) => {
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef(null);

  const commentsToDisplay = useMemo(() => post?.comments || [], [post]);

  const handleCommentSubmit = () => {
    if (!newComment.trim() || !post?.id || !isLoggedIn) return;
    onAddComment(post.id, newComment.trim());
    setNewComment('');
  };

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commentsToDisplay.length]);

  if (!isOpen || !post) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Comments"
      className="max-w-xl w-full h-[80vh] flex flex-col overflow-hidden"
      bodyClassName="flex flex-col min-h-0"
    >
      {/* Scrollable list */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 min-h-0">
        {commentsToDisplay.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-3">
            <img
              src={comment.userProfilePic || '/default-profile.png'}
              alt={comment.userName || 'User'}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              onError={(e) => (e.currentTarget.src = '/default-profile.png')}
            />
            <div className="flex flex-col flex-grow">
              <div className="flex items-baseline space-x-1">
                <span className="font-semibold text-gray-900 text-sm">{comment.userName || currentUserName}</span>
                <span className="text-xs text-gray-500">{comment.timeAgo || ''}</span>
              </div>
              <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                {comment.likes > 0 && (
                  <span className="flex items-center space-x-1">
                    <ChatBubbleOvalLeftIcon className="h-3 w-3" />
                    <span>{comment.likes}</span>
                  </span>
                )}
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => setNewComment((v) => `${v ? v + ' ' : ''}@${comment.userName} `)}
                    className="hover:underline focus:outline-none"
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={commentsEndRef} />
      </div>

      {/* Fixed bottom input bar */}
      <div className="p-4 border-t border-gray-200 flex items-center space-x-3 bg-white flex-shrink-0">
        {isLoggedIn ? (
          <>
            <input
              type="text"
              placeholder="Type a message"
              className="flex-grow p-3 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2"
              style={{ caretColor: brandColor }}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCommentSubmit();
              }}
            />
            <Button
              type="button"
              onClick={handleCommentSubmit}
              className="p-3 rounded-full hover:shadow-md transition-shadow"
              aria-label="Send message"
              style={{ backgroundColor: brandColor, color: contrastColor, cursor: 'pointer' }}
              disabled={!newComment.trim()}
            >
              <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
            </Button>
          </>
        ) : (
          <div className="w-full text-center text-gray-500 p-3 rounded-full bg-gray-100 border border-gray-200">
            Sign in to leave a comment.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CommentsModal;