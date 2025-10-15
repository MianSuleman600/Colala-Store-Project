// src/components/Feed/CommentsPanel.js

import React, { useState, useRef, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useGetPostCommentsQuery } from '../../services/queries/useFeedQuery';
import ChatCircle from "/icons/ChatCircle.png";

dayjs.extend(relativeTime);

// Converts relative URLs to absolute
const toAbsolute = (url) => (!url || url.startsWith('http') ? url : `/assets/${url}`);

const CommentsPanel = ({ post, onAddComment, isCommenting, brandColor, isAuthenticated }) => {
  const [newComment, setNewComment] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const commentsEndRef = useRef(null);

  // Fetch comments
  const { data: flatComments = [], isLoading } = useGetPostCommentsQuery(post?.id, {
    enabled: !!post?.id,
  });

  // Transform flat to nested with replies count
  const processedComments = useMemo(() => {
    if (!flatComments.length) return [];

    const map = {};
    const nested = [];

    flatComments.forEach(c => {
      c.replies = [];
      map[c.id] = c;
    });

    flatComments.forEach(c => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies.push(c);
      } else {
        nested.push(c);
      }
    });

    nested.forEach(c => c.repliesCount = c.replies.length);

    return nested;
  }, [flatComments]);

  // Scroll to bottom on new comments
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [processedComments.length]);

  // =================
  // Handlers
  // =================
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !post?.id || !isAuthenticated) return;
    onAddComment(post.id, newComment.trim(), null);
    setNewComment('');
  };

  const handleReplySubmit = (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim() || !parentId || !post?.id || !isAuthenticated) return;
    onAddComment(post.id, replyText.trim(), parentId);
    setReplyText('');
    setActiveReplyId(null);
  };

  const handleToggleReply = (comment) => {
    const newId = activeReplyId === comment.id ? null : comment.id;
    setActiveReplyId(newId);
    setReplyText(newId ? `@${comment.userName} ` : '');
  };

  // =================
  // Icons & Spinner
  // =================
  const SubmitSpinner = () => (
    <div
      className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mx-auto"
      style={{ borderColor: brandColor, borderTopColor: 'transparent' }}
    />
  );

  const SendIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${className} -rotate-30 cursor-pointer -mt-1 -mr-1`}>
      <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.542 60.542 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.542 60.542 0 0 0 3.478 2.405Z" />
    </svg>
  );

  // =================
  // Recursive render
  // =================
  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} className={`space-y-1 ${isReply ? 'ml-12' : ''}`}>
      <div className="flex items-start space-x-3">
        <img
          src={toAbsolute(comment.userProfilePic) || '/default-profile.png'}
          alt={comment.userName}
          className={`rounded-full object-cover ${isReply ? 'w-9 h-9' : 'w-10 h-10'}`}
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">{comment.userName || 'Anonymous'}</span>
            <span className="text-xs text-gray-400">{comment.createdAt ? dayjs(comment.createdAt).fromNow() : 'just now'}</span>
          </div>
          <p className="text-gray-800 text-sm mt-1 break-words">{comment.text}</p>
          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
            <button onClick={() => handleToggleReply(comment)} className="hover:text-gray-700 font-medium">Reply</button>
            <div className="flex items-center space-x-1">
              <img src={ChatCircle} alt="Replies" className='w-4 h-4' />
              <span>{comment.repliesCount ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {comment.replies?.length > 0 && (
        <div className="ml-12 space-y-2 pt-2">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}

      {activeReplyId === comment.id && isAuthenticated && (
        <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="ml-12 mt-3 flex items-center bg-gray-100 rounded-full pr-1 shadow-inner">
          <input
            type="text"
            placeholder={`Replying to ${comment.userName}...`}
            className="flex-1 p-3 bg-transparent border-none focus:outline-none text-sm"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={!replyText.trim() || isCommenting} className="p-2 cursor-pointer rounded-full transition-colors disabled:opacity-50" style={{ color: brandColor }}>
            {isCommenting ? <SubmitSpinner /> : <SendIcon />}
          </button>
        </form>
      )}
    </div>
  );

  // =================
  // Main render
  // =================
  return (
    <div className="bg-white rounded-2xl shadow-xl flex flex-col border border-gray-100 h-[calc(100vh-6rem)] max-h-[850px]">
      <div className="px-5 py-4  flex-shrink-0"><h2 className=" text-xl">Comments</h2></div>
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="p-4 space-y-4">Loading comments...</div>
        ) : processedComments.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No comments yet.</div>
        ) : (
          processedComments.map(comment => renderComment(comment))
        )}
        <div ref={commentsEndRef} />
      </div>
      <div className="px-4 py-3  bg-gray-50 flex-shrink-0">
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="flex items-center bg-gray-200 rounded-xl pr-1 shadow-inner border border-gray-300">
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 p-3 bg-transparent border-none focus:outline-none placeholder-gray-500 text-sm"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" disabled={!newComment.trim() || isCommenting} className="p-2 rounded-full cursor-pointer transition-colors disabled:opacity-50 hover:opacity-80" style={{ color: brandColor }}>
              {isCommenting ? <SubmitSpinner /> : <SendIcon className="w-6 h-6" />}
            </button>
          </form>
        ) : (
          <div className="w-full text-center text-gray-500 p-3 rounded-full bg-gray-100 border border-gray-200 text-sm">
            Sign in to leave a comment.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsPanel;
