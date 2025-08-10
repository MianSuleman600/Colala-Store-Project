// src/components/Feed/EditPostModal.jsx
import React, { useState, useEffect } from 'react';
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
 * EditPostModal Component
 * Allows users to edit an existing post's text content and optional image.
 * It pre-populates the modal with the data from the post being edited.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {function} props.onEditPost - Callback function when a post is edited.
 * @param {object} props.post - The post object to be edited.
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastColor - The primary brand color for styling.
 */
const EditPostModal = ({ isOpen, onClose, onEditPost, post, brandColor, contrastColor }) => {
    // State is initialized with the text and image from the 'post' prop
    const [postText, setPostText] = useState(post?.text || '');
    const [selectedImage, setSelectedImage] = useState(post?.imageUrl || null);
    const [showErrorMessage, setShowErrorMessage] = useState(false); // State for the custom error message

    // Use useEffect to update the state if the 'post' prop changes
    // This is important for when the same modal component is used to edit different posts
    useEffect(() => {
        if (post) {
            setPostText(post.text);
            setSelectedImage(post.imageUrl);
        }
    }, [post]);

    // Dummy selectable images
    const selectableImages = [
        dummyImage1,
        dummyImage2,
        dummyImage3,
        dummyImage4,
    ];

    if (!isOpen) return null;

    const handleEditPost = () => {
        // Check if the user has made any changes
        const hasChanges = postText.trim() !== post.text || selectedImage !== post.imageUrl;

        // Ensure there is some content to save
        if (!hasChanges) {
            // No changes, just close the modal
            onClose();
            return;
        }

        if (postText.trim() || selectedImage) {
            const updatedPost = {
                ...post, // Keep all existing post data
                text: postText.trim(),
                imageUrl: selectedImage,
            };
            onEditPost(updatedPost); // Pass the updated post to the parent component
            onClose();
        } else {
            // Use a custom message box instead of alert()
            setShowErrorMessage(true);
            setTimeout(() => {
                setShowErrorMessage(false);
            }, 3000); // Hide the message after 3 seconds
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Post" // Title changed to "Edit Post"
            className="max-w-md "
        >
            <div className="p-4 flex flex-col rounded-2xl space-y-4">
                {/* User Info and Text Area */}
                <div className="relative flex items-start space-x-3 p-2 border border-gray-200 rounded-2xl bg-gray-100 min-h-[120px]">
                    <img
                        src={userProfilePic}
                        alt="Your Profile"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1 ml-1"
                    />
                    <textarea
                        className="flex-grow p-2 pl-0 bg-transparent rounded-lg focus:outline-none resize-none text-gray-800"
                        rows="4"
                        placeholder="What is on your mind?"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        style={{ minHeight: '80px' }}
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
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Image Selection Thumbnails */}
                <div className="flex space-x-2 overflow-x-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                    <button
                        className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:bg-gray-100 transition-colors"
                        aria-label="Upload image"
                        onClick={() => setShowErrorMessage(true)} // Example of using the message box
                    >
                        <CameraIcon className="h-6 w-6" />
                    </button>
                    {selectableImages.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Selectable image ${index + 1}`}
                            className={`flex-shrink-0 w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img ? `border-[${brandColor}]` : 'border-transparent'} hover:border-gray-300 transition-colors`}
                            onClick={() => setSelectedImage(img)}
                        />
                    ))}
                </div>

                {/* Custom error message box */}
                {showErrorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
                        <span className="block sm:inline">Please add some text or select an image to save.</span>
                    </div>
                )}
                
                {/* Save Changes Button */}
                <Button
                    onClick={handleEditPost}
                    className="w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow text-white hover:bg-red-600"
                    style={{ backgroundColor: brandColor, color: contrastColor }}
                >
                    Save Changes {/* Button text changed to "Save Changes" */}
                </Button>
            </div>
        </Modal>
    );
};

export default EditPostModal;
