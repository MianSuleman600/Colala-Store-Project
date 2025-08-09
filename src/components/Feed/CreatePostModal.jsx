// src/components/Feed/CreatePostModal.jsx
import React, { useState } from 'react';
import Modal from '../ui/Modal'; // Your generic Modal component
import Button from '../ui/Button'; // Your reusable Button component

// Heroicons
import {
    CameraIcon, // For selecting images
    XMarkIcon // For removing selected image
} from '@heroicons/react/24/outline';

// Dummy images for demonstration
import userProfilePic from '../../assets/images/profileImage.png'; // Current user's profile pic
import dummyImage1 from '../../assets/images/productImages/1.png'; // Dummy selectable image 1
import dummyImage2 from '../../assets/images/productImages/2.jpeg'; // Dummy selectable image 2
import dummyImage3 from '../../assets/images/productImages/3.jpeg'; // Dummy selectable image 3
import dummyImage4 from '../../assets/images/productImages/4.jpeg'; // Dummy selectable image 4

/**
 * CreatePostModal Component
 * Allows users to create a new post with text content and optional images.
 * Designed to match the 'Create Post' modal in 4.png and 5.png.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {function} props.onCreatePost - Callback function when a new post is created.
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastColor - The primary brand color for styling.
 */
const CreatePostModal = ({ isOpen, onClose, onCreatePost , brandColor,contrastColor}) => {
    const [postText, setPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null); // Stores the URL of the selected image

    // Dummy selectable images (added dummyImage5 to match screenshot if needed)
    const selectableImages = [
        dummyImage1,
        dummyImage2,
        dummyImage3,
        dummyImage4,
        // Assuming dummyImage5 is available if needed to match 4 images + camera icon
        // If not, just remove this line or add a fifth dummy image asset
        // dummyImage5,
    ];

    if (!isOpen) return null;

    const handleCreatePost = () => {
        if (postText.trim() || selectedImage) {
            const newPost = {
                id: `post-${Date.now()}`, // Simple unique ID
                userName: 'Sasha Stores', // Current user's name
                userProfilePic: userProfilePic, // Current user's profile pic
                timeAgo: 'Just now',
                location: 'Lagos, Nigeria',
                imageUrl: selectedImage,
                text: postText.trim(),
                likes: 0,
                comments: 0,
                shares: 0,
                commentsList: [], // Initialize with empty comments
            };
            onCreatePost(newPost);
            setPostText('');
            setSelectedImage(null);
            onClose();
        } else {
            alert('Please type something or select an image to create a post.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Post" // Title set to "Create Post"
            className="max-w-md" // Adjusted max-width for the create post modal
        >
            <div className="p-4 flex flex-col space-y-4">
                {/* User Info and Text Area */}
                {/* This wrapper ensures the profile picture and textarea are laid out correctly */}
                <div className="relative flex items-start space-x-3 p-2 border border-gray-200 rounded-2xl bg-gray-100 min-h-[120px]">
                    {/* Profile Picture - positioned absolutely within its container, or just at the start of flex */}
                    <img
                        src={userProfilePic}
                        alt="Your Profile"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1 ml-1" // Added mt-1, ml-1 for slight alignment from padding
                    />

                    {/* Textarea - positioned to allow space for the image */}
                    <textarea
                        className="flex-grow p-2 pl-0 bg-transparent rounded-lg focus:outline-none resize-none text-gray-800" // Removed border, bg-gray-100, and full width/height
                        rows="4" // Set initial rows
                        placeholder="What is on your mind?"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        style={{ minHeight: '80px' }} // Ensure a minimum height for the textarea
                    />
                </div>

                {/* Selected Image Preview (if an image is selected) */}
                {selectedImage && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                        <img src={selectedImage} alt="Selected post" className="w-full h-full object-cover" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
                            aria-label="Remove image"
                        >
                            <XMarkIcon className="h-4 w-4" /> {/* X icon for removing image */}
                        </button>
                    </div>
                )}

                {/* Image Selection Thumbnails */}
                <div className="flex space-x-2 overflow-x-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                    <button
                        className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:bg-gray-100 transition-colors"
                        aria-label="Upload image"
                        onClick={() => alert('Image upload functionality would go here!')} // Placeholder for actual upload
                    >
                        <CameraIcon className="h-6 w-6" /> {/* Camera icon for upload */}
                    </button>
                    {selectableImages.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Selectable image ${index + 1}`}
                            // Highlight selected image with blue border
                            className={`flex-shrink-0 w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img ? 'border-blue-500' : 'border-transparent'} hover:border-gray-300 transition-colors`}
                            onClick={() => setSelectedImage(img)}
                        />
                    ))}
                </div>

                {/* Create Post Button */}
                <Button
                    onClick={handleCreatePost}
                    className="w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow  text-white hover:bg-red-600" 
                    style={{ backgroundColor: brandColor ,color:contrastColor}}
                >
                    Create Post {/* Button text "Create Post" */}
                </Button>
            </div>
        </Modal>
    );
};

export default CreatePostModal;