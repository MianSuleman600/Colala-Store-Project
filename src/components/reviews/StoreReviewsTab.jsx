// src/components/reviews/StoreReviewsTab.jsx
import React from 'react';
import Card from '../ui/Card';
import { StarIcon } from '@heroicons/react/24/solid'; // Solid star for filled ratings

/**
 * StoreReviewsTab Component
 * Displays a list of store reviews.
 * Matches the design in 'image_f473ff.png' and 'image_f48eaa.png'.
 *
 * @param {object} props
 * @param {Array<object>} props.reviews - An array of store review objects.
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {function} props.onViewReview - Callback to view a specific review in a modal.

 */
const StoreReviewsTab = ({ reviews, brandColor, onViewReview }) => {
    // IMPORTANT DEBUGGING LINE: Check the type of onViewStore when this component renders
    console.log('StoreReviewsTab DEBUG: Type of onViewStore prop received:', typeof onViewStore);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                        i <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                />
            );
        }
        return <div className="flex">{stars}</div>;
    };

    return (
        <div className="space-y-4">
            {reviews.length === 0 ? (
                <Card className="p-6 text-center text-gray-600">No store reviews available.</Card>
            ) : (
                reviews.map(review => (
                    <Card key={review.id} className="p-4 rounded-xl shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                                <img
                                    src={review.reviewerAvatar || "https://placehold.co/40x40/e0e0e0/000000?text=User"}
                                    alt={review.reviewerName}
                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/e0e0e0/000000?text=User"; }}
                                />
                                <div className="flex flex-col">
                                    <span className="text-gray-800 font-medium">{review.reviewerName}</span>
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            <span className="text-gray-500 text-xs">{review.dateCreated}</span>
                        </div>
                        <p className="text-gray-700 text-base mb-3">{review.reviewText}</p>

                        {/* Store Information Section - Matches image_f48eaa.png */}
                        <div className="flex items-center p-2 border border-gray-200 rounded-lg bg-gray-50">
                            <img
                                src="https://placehold.co/40x40/e0e0e0/000000?text=Store" // Placeholder for store image
                                alt="Sasha Stores"
                                className="h-10 w-10 rounded-lg object-cover mr-3"
                            />
                            <div className="flex flex-col flex-grow">
                                <span className="text-gray-800 font-medium">Sasha Stores</span>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span>4.5 Stars</span> {/* Hardcoded as per image */}
                                    {/* Small star icon for 4.5 stars, could be more dynamic */}
                                    <StarIcon className="h-4 w-4 text-yellow-400 ml-1" />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    // Another DEBUGGING LINE: Confirm onViewStore is a function right before calling
                                    console.log('Button Click: Type of onViewStore:', typeof onViewStore);
                                    if (typeof onViewStore === 'function') {
                                        onViewStore(review); // Call the onViewStore prop
                                    } else {
                                        console.error('onViewStore is not a function when button is clicked!');
                                        alert('Error: View Store functionality not available.');
                                    }
                                }}
                                className="text-sm font-semibold py-1 px-2 rounded-lg"
                                style={{ color: brandColor }}
                            >
                                View Store
                            </button>
                        </div>
                    </Card>
                ))
            )}
        </div>
    );
};

export default StoreReviewsTab;
