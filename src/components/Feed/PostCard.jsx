// src/components/feed/PostCard.jsx
import React, { useState } from 'react';
import Card from '../ui/Card'; // Assuming you have a reusable Card component
import Button from '../ui/Button'; // Assuming you have a reusable Button component

// Heroicons for various actions (these are actual React components)
import {
    EllipsisVerticalIcon
} from '@heroicons/react/24/outline'; // Using outline for consistency

// Import your local image assets. These imports give you the image *paths*.
import HeartIcon from '../../assets/icons/Heart.png';
import ShareIcon from '../../assets/icons/sharee.png';
import DownloadIcon from '../../assets/icons/Download.png';
import CommentIcon from '../../assets/icons/comment.png';
import TrashIcon from '../../assets/icons/delete.png';
import PencilSquareIcon from '../../assets/icons/Pencil.png';
import LinkIcon from '../../assets/icons/Shareee.png'; // Assuming this is for the 'Share this post' icon

// Dummy images for demonstration
import userProfilePic from '../../assets/images/profileImage.png'; // User's profile pic
import postImage from '../../assets/images/productImages/2.jpeg'; // Example post image

/**
 * PostCard Component
 * Displays a single social media post with user information, content, and interaction buttons.
 * Includes an ellipsis menu for post actions (Share, Edit, Delete).
 *
 * @param {object} props
 * @param {object} props.post - The post object to display.
 * @param {string} props.post.id - Unique ID of the post.
 * @param {string} props.post.userName - Name of the user who posted.
 * @param {string} props.post.userProfilePic - URL of the user's profile picture.
 * @param {string} props.post.timeAgo - How long ago the post was made (e.g., "20 min ago").
 * @param {string} props.post.location - User's location (e.g., "Lagos, Nigeria").
 * @param {string} props.post.imageUrl - URL of the post's main image.
 * @param {string} props.post.text - The text content of the post.
 * @param {number} props.post.likes - Number of likes.
 * @param {number} props.post.comments - Number of comments.
 * @param {number} props.post.shares - Number of shares.
 * @param {function} props.onCommentClick - Callback when the comment button is clicked.
 * @param {function} props.onEditPost - Callback when "Edit Post" is clicked from the ellipsis menu.
 * @param {function} props.onDeletePost - Callback when "Delete Post" is clicked from the ellipsis menu.
 * @param {boolean} props.initialIsFollowing - Optional: Initial follow status for the user/store.
 * @param {string} props.contrastColor - The brand's contrast color.
 * @param {string} props.brandColor - The brand's primary color.
 *
 */
const PostCard = ({
    post,
    onCommentClick,
    onEditPost,
    onDeletePost,
    initialIsFollowing = false,
    contrastColor,
    brandColor
}) => {
    const [showEllipsisMenu, setShowEllipsisMenu] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

    const handleEllipsisToggle = () => {
        setShowEllipsisMenu(prev => !prev);
    };

    const handleSharePost = () => {
        console.log(`Sharing post: ${post.id}`);
        setShowEllipsisMenu(false);
    };

    const handleEditPost = () => {
        onEditPost(post.id);
        setShowEllipsisMenu(false);
    };

    const handleDeletePost = () => {
        // Replaced window.confirm with a console message as confirm() is not supported in this environment.
        console.log(`User confirmed deletion of post: ${post.id}`);
        onDeletePost(post.id);
        setShowEllipsisMenu(false);
    };

    const handleFollowToggle = () => {
        console.log(isFollowing ? `Unfollowing ${post.userName}` : `Following ${post.userName}`);
        setIsFollowing(prev => !prev);
    };

    return (
        <Card className="relative flex flex-col p-4 rounded-lg shadow-md bg-white w-full max-w-md mx-auto">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <img
                        src={post.userProfilePic || userProfilePic}
                        alt={post.userName}
                        className="w-10 h-10 rounded-full object-cover"
                        // **OPTIMIZATION: Added width and height to prevent CLS.**
                        width={40}
                        height={40}
                        loading="lazy"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{post.userName}</span>
                        <span className="text-xs text-gray-500">{post.location} • {post.timeAgo}</span>
                    </div>
                </div>
                {/* Ellipsis Menu */}
                <div className="relative">
                    <button
                        onClick={handleEllipsisToggle}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="More options"
                    >
                        <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
                    </button>
                    {showEllipsisMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <ul className="py-1">
                                <li>
                                    <button
                                        onClick={handleSharePost}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {/* **OPTIMIZATION: Added width and height to prevent CLS.** */}
                                        <img src={LinkIcon} alt="Share" className="h-4 w-4 mr-2" width={16} height={16} loading="lazy" /> Share this post
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleEditPost}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {/* **OPTIMIZATION: Added width and height to prevent CLS.** */}
                                        <img src={PencilSquareIcon} alt="Edit" className="h-4 w-4 mr-2" width={16} height={16} loading="lazy" /> Edit Post
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleDeletePost}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        {/* **OPTIMIZATION: Added width and height to prevent CLS.** */}
                                        <img src={TrashIcon} alt="Delete" className="h-4 w-4 mr-2" width={16} height={16} loading="lazy" /> Delete Post
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
                        src={post.imageUrl || postImage}
                        alt="Post content"
                        className="w-full h-64 object-cover"
                        // **OPTIMIZATION: Added width and height to prevent CLS.**
                        // `h-64` translates to 256px. `w-full` is fluid, so we use a representative width.
                        width={400}
                        height={256}
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x256/e0e0e0/000000?text=No+Image"; }}
                    />
                </div>
            )}

            {/* Post Text */}
            {post.text && (
                <p className="text-gray-800 mb-4">{post.text}</p>
            )}

            {/* Interaction Buttons and Follow Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-3 gap-3 sm:gap-0">
                {/* Left group: Likes, Comments, Shares */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <button className="flex items-center text-gray-600 hover:text-red-500 transition-colors text-sm">
                        {/* **OPTIMIZATION: Added width and height to prevent CLS.** */}
                        <img src={HeartIcon} alt="Likes" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" width={16} height={16} loading="lazy" />
                        <span>{post.likes}</span>
                    </button>

                    <button
                        onClick={() => onCommentClick(post.id)}
                        className="flex items-center text-gray-600 hover:text-blue-500 transition-colors text-sm"
                    >
                        {/* **OPTIMIZATION: Added width and height to prevent CLS.** */}
                        <img src={CommentIcon} alt="Comments" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" width={16} height={16} loading="lazy" />
                        <span>{post.comments}</span>
                    </button>

                    <button className="flex items-center text-gray-600 hover:text-green-500 transition-colors text-sm">
                        {/* **OPTIMIZATION: Added width and height to prevent CLS.** */}
                        <img src={ShareIcon} alt="Shares" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" width={16} height={16} loading="lazy" />
                        <span>{post.shares}</span>
                    </button>
                </div>

                {/* Right group: Follow Button and Download Icon */}
                <div className="flex items-center justify-center sm:justify-end gap-3 flex-wrap sm:flex-nowrap">
                    <Button
                        onClick={handleFollowToggle}
                        className={`px-3 py-1.5 text-sm rounded-full transition-colors flex-shrink-0 ${isFollowing
                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                : ''
                            }`}
                        style={!isFollowing ? { backgroundColor: brandColor, color: contrastColor } : {}}
                    >
                        {isFollowing ? 'Following' : 'Follow Store'}
                    </Button>

                    <button className="text-gray-600 hover:text-purple-500 transition-colors flex-shrink-0">
                        {/* **OPTIMIZATION: Added width and height to prevent CLS.** */}
                        <img src={DownloadIcon} alt="Download" className="h-4 w-4 sm:h-5 sm:w-5" width={16} height={16} loading="lazy" />
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default PostCard;
