// src/components/reviews/models/LeaveReviewModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button'; // Adjusted path for Button
import { XMarkIcon, StarIcon, PhotoIcon } from '@heroicons/react/24/outline'; // Close icon, Outline star, Photo icon for upload

/**
 * LeaveReviewModal Component
 * A modal form for leaving or editing a review. Allows rating, typing review text,
 * and optionally uploading images.
 * Matches the design in 'image_f47403.png'.
 *
 * @param {object} props
 * @param {object} [props.reviewToEdit] - Optional: The review object to pre-fill for editing.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onSave - Callback to save the review data.
 * @param {string} props.brandColor - The primary brand color for styling the save button.
 */
const LeaveReviewModal = ({ reviewToEdit, onClose, onSave, brandColor }) => {
    const [rating, setRating] = useState(reviewToEdit?.rating || 0);
    const [reviewText, setReviewText] = useState(reviewToEdit?.reviewText || '');
    const [selectedImages, setSelectedImages] = useState(reviewToEdit?.productImages || []); // Stores URLs for preview

    // Effect to update state if reviewToEdit changes (e.g., when opening for a new review after editing one)
    useEffect(() => {
        if (reviewToEdit) {
            setRating(reviewToEdit.rating || 0);
            setReviewText(reviewToEdit.reviewText || '');
            setSelectedImages(reviewToEdit.productImages || []);
        } else {
            // Reset for new review if reviewToEdit is null
            setRating(0);
            setReviewText('');
            setSelectedImages([]);
        }
    }, [reviewToEdit]);

    const handleStarClick = (index) => {
        setRating(index);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImageUrls = files.map(file => URL.createObjectURL(file));
        setSelectedImages(prev => [...prev, ...newImageUrls]);
        // In a real app, you'd handle file uploads to a server here.
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a star rating.');
            return;
        }
        if (!reviewText.trim()) {
            alert('Please type your review.');
            return;
        }

        const reviewData = {
            ...reviewToEdit, // Include existing properties if editing
            rating,
            reviewText,
            productImages: selectedImages, // In a real app, these would be uploaded URLs
            // For new reviews, you might add reviewerName, reviewerAvatar, dateCreated here
            // For simplicity, for new reviews, we'll assume these are handled by the parent
        };
        onSave(reviewData);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 font-serif">Leave a review</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800"
                    aria-label="Close"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((index) => (
                    <StarIcon
                        key={index}
                        className={`h-8 w-8 cursor-pointer ${
                            index <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => handleStarClick(index)}
                    />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-1">Type review</label>
                    <textarea
                        id="review-text"
                        placeholder="Type your review"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        rows="4"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    ></textarea>
                </div>

                {/* Image Upload/Preview */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    <label htmlFor="image-upload" className="flex-shrink-0 h-24 w-24 border border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors duration-200">
                        <PhotoIcon className="h-8 w-8 text-gray-400" />
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="sr-only"
                            onChange={handleImageUpload}
                        />
                    </label>
                    {selectedImages.map((imgUrl, index) => (
                        <div key={index} className="relative flex-shrink-0">
                            <img
                                src={imgUrl}
                                alt={`Uploaded ${index + 1}`}
                                className="h-24 w-24 object-cover rounded-lg"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/e0e0e0/000000?text=Img"; }}
                            />
                            {/* Optional: Add a button to remove image */}
                        </div>
                    ))}
                </div>

                <Button
                    type="submit"
                    style={{ backgroundColor: brandColor }}
                    className="w-full py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-shadow"
                >
                    Send Review
                </Button>
            </form>
        </div>
    );
};

export default LeaveReviewModal;
