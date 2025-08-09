// src/components/reviews/models/MyReviewModal.jsx
import React from 'react';
import Button from '../../ui/Button'; // Adjusted path for Button
import { XMarkIcon, StarIcon } from '@heroicons/react/24/solid'; // Close icon, Solid star for filled ratings

/**
 * MyReviewModal Component
 * Displays a detailed view of a single review, including reviewer info, rating, text,
 * and product images (if applicable). Provides options to edit or delete the review.
 * Matches the design in 'image_f47402.png'.
 *
 * @param {object} props
 * @param {object} props.review - The review object to display.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onEdit - Callback to trigger editing of the review.
 * @param {function} props.onDelete - Callback to trigger deletion of the review.
 * @param {string} props.brandColor - The primary brand color for styling buttons.
 */
const MyReviewModal = ({ review, onClose, onEdit, onDelete, brandColor }) => {
    // Defensive check: If review is not provided, render nothing to prevent errors
    if (!review) {
        console.warn("MyReviewModal received no review prop. Not rendering.");
        return null; // This prevents the component from trying to access properties of undefined
    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    className={`h-7 w-7 ${ // Larger stars for the modal
                        i <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                />
            );
        }
        return <div className="flex justify-center mb-4">{stars}</div>;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 font-serif">My review</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800"
                    aria-label="Close"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            {renderStars(review.rating)}

            <div className="flex items-center mb-4">
                <img
                    src={review.reviewerAvatar || "https://placehold.co/40x40/e0e0e0/000000?text=User"}
                    alt={review.reviewerName}
                    className="h-10 w-10 rounded-full object-cover mr-3"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/e0e0e0/000000?text=User"; }}
                />
                <div className="flex flex-col">
                    <span className="text-gray-800 font-medium">{review.reviewerName}</span>
                    {/* Stars are rendered above, so no need here again */}
                </div>
                <span className="text-gray-500 text-xs ml-auto">{review.dateCreated}</span>
            </div>

            {review.productImages && review.productImages.length > 0 && (
                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                    {review.productImages.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Review Image ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/e0e0e0/000000?text=Img"; }}
                        />
                    ))}
                </div>
            )}

            <p className="text-gray-700 text-base mb-6">{review.reviewText}</p>

            <div className="flex justify-between space-x-4">
                <Button
                    onClick={() => onEdit(review)}
                    className="flex-1 py-3 rounded-lg font-semibold text-gray-800 shadow-md hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: '#E5E7EB' }} // Light gray background
                >
                    Edit Review
                </Button>
                <Button
                    onClick={() => onDelete(review.id, review.type)}
                    className="flex-1 py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: brandColor }}
                >
                    Delete Review
                </Button>
            </div>
        </div>
    );
};

export default MyReviewModal;
