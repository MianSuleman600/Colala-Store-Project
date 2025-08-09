// src/components/feed/CommentsModal.jsx
import React, { useState } from 'react';
import Modal from '../ui/Modal'; // Assuming your generic Modal component
import Button from '../ui/Button'; // Assuming your reusable Button component

// Heroicons
import { PaperAirplaneIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid'; // Added ChatBubbleOvalLeftIcon

// Dummy images
import userProfilePic from '../../assets/images/profileImage.png'; // User's profile pic
import commentUser1 from '../../assets/images/productImages/3.jpeg'; // Dummy comment user 1
import commentUser2 from '../../assets/images/productImages/2.jpeg'; // Dummy comment user 2

/**
 * CommentsModal Component
 * Displays comments for a post and provides an input for new comments.
 * Designed to match the 'Comments' section in 2.png and 3.png.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {object} props.post - The post object for which comments are displayed.
 * @param {Array<object>} props.post.commentsList - List of comments for the post.
 * @param {string} props.post.commentsList[].id - Unique ID of the comment.
 * @param {string} props.post.commentsList[].userName - Name of the commenter.
 * @param {string} props.post.commentsList[].userProfilePic - Profile picture of the commenter.
 * @param {string} props.post.commentsList[].timeAgo - How long ago the comment was made.
 * @param {string} props.post.commentsList[].text - The comment text.
 * @param {number} props.post.commentsList[].likes - Number of likes on the comment.
 * @param {function} props.onAddComment - Callback function when a new comment is added.
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastColor - The primary brand color for styling.
 */
const CommentsModal = ({ isOpen, onClose, post, onAddComment ,brandColor,contrastColor}) => {
    const [newComment, setNewComment] = useState('');

    if (!isOpen || !post) return null;

    const dummyComments = post.commentsList || [
        {
            id: 'c1',
            userName: 'Adam Chris',
            userProfilePic: commentUser1,
            timeAgo: '1 min',
            text: 'This product looks really nice, do you deliver nationwide?',
            likes: 30,
        },
        {
            id: 'c2',
            userName: 'Adam Chris',
            userProfilePic: commentUser1,
            timeAgo: '1 min',
            text: 'This product looks really nice, do you deliver nationwide?',
            likes: 30,
        },
        {
            id: 'c3',
            userName: 'Adam Chris',
            userProfilePic: commentUser1,
            timeAgo: '1 min',
            text: 'This product looks really nice, do you deliver nationwide?',
            likes: 30,
        },
        {
            id: 'c4',
            userName: 'Sasha Stores',
            userProfilePic: userProfilePic,
            timeAgo: '1 min',
            text: '@Adam Chris We do deliver nationwide.',
            likes: 0,
        },
        // Add more dummy comments to test scrolling
        { id: 'c5', userName: 'Current User', userProfilePic: userProfilePic, timeAgo: 'Just now', text: 'hi', likes: 0 },
        { id: 'c6', userName: 'Current User', userProfilePic: userProfilePic, timeAgo: 'Just now', text: 'hu', likes: 0 },
        { id: 'c7', userName: 'Current User', userProfilePic: userProfilePic, timeAgo: 'Just now', text: 'hu', likes: 0 },
        { id: 'c8', userName: 'Another User', userProfilePic: commentUser2, timeAgo: '5 min', text: 'Looks great!', likes: 5 },
        { id: 'c9', userName: 'Test User', userProfilePic: userProfilePic, timeAgo: '10 min', text: 'Is this still available?', likes: 2 },
        { id: 'c10', userName: 'Third Party', userProfilePic: commentUser1, timeAgo: '15 min', text: 'How much?', likes: 10 },
        { id: 'c11', userName: 'Adam Chris', userProfilePic: commentUser1, timeAgo: '20 min', text: 'Seriously, do you deliver to my village?', likes: 1 },
        { id: 'c12', userName: 'Sasha Stores', userProfilePic: userProfilePic, timeAgo: '21 min', text: '@Adam Chris Yes, we deliver everywhere in Nigeria.', likes: 0 },
        { id: 'c13', userName: 'Current User', userProfilePic: userProfilePic, timeAgo: 'Just now', text: 'Another test comment to ensure scrolling works perfectly.', likes: 0 },
        { id: 'c14', userName: 'Yet Another', userProfilePic: commentUser2, timeAgo: '25 min', text: 'Amazing!', likes: 3 },
    ];

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            // In a real app, you'd send this to a backend
            const commentToAdd = {
                id: `c${Date.now()}`, // Simple unique ID
                userName: 'Current User', // Replace with actual current user name
                userProfilePic: userProfilePic, // Replace with actual current user pic
                timeAgo: 'Just now',
                text: newComment.trim(),
                likes: 0,
            };
            onAddComment(post.id, commentToAdd); // Pass post ID and new comment
            setNewComment('');
        }
    };

    // New function to handle reply clicks
    const handleReplyClick = (userName) => {
        setNewComment(`@${userName} `); // Pre-fill input with @UserName
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Comments"
            // Keeping the original className you provided, which might cause the input not to stick
            className="max-w-xl w-full h-[80vh] flex flex-col overflow-hidden"
        >
            {/* Keeping the original structure from your request */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {dummyComments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3">
                        <img
                            src={comment.userProfilePic || userProfilePic}
                            alt={comment.userName}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col flex-grow">
                            <div className="flex items-baseline space-x-1">
                                <span className="font-semibold text-gray-900 text-sm">{comment.userName}</span>
                                <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                            </div>
                            <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                            {/* NEW: Container for Reply and Likes with Comment Icon */}
                            <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                {comment.likes > 0 && (
                                    <span className="flex items-center space-x-1">
                                        <ChatBubbleOvalLeftIcon className="h-3 w-3" /> {/* Comment Icon */}
                                        <span>{comment.likes}</span>
                                    </span>
                                )}
                                {/* NEW: Reply Button */}
                                <button
                                    onClick={() => handleReplyClick(comment.userName)}
                                    className="hover:underline focus:outline-none" // Basic styling for button
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* This div will remain fixed at the bottom (flex-shrink-0) */}
            <div className="p-4 border-t border-gray-200 flex items-center space-x-3 bg-white flex-shrink-0">
                <input
                    type="text"
                    placeholder="Type a message"
                    className="flex-grow p-3 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleCommentSubmit(); }}
                />
                <Button
                    onClick={handleCommentSubmit}
                    className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
                    aria-label="Send message"
                >
                    <PaperAirplaneIcon className="h-5 w-5 transform -rotate-50" /> {/* Rotated for send icon */}
                </Button>
            </div>
        </Modal>
    );
};

export default CommentsModal;