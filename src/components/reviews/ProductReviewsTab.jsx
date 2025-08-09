// src/components/reviews/ProductReviewsTab.jsx
import React from 'react';
import Card from '../ui/Card';
import { StarIcon } from '@heroicons/react/24/solid'; // Solid star for filled ratings

/**
 * ProductReviewsTab Component
 * Displays a list of product reviews, including product images.
 * Matches the design in 'image_f47401.png'.
 *
 * @param {object} props
 * @param {Array<object>} props.reviews - An array of product review objects.
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {function} props.onViewReview - Callback to view a specific review in a modal.
 */
const ProductReviewsTab = ({ reviews, brandColor, onViewReview }) => {
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
                <Card className="p-6 text-center text-gray-600">No product reviews available.</Card>
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
                        <p className="text-gray-700 text-sm mb-3">{review.reviewText}</p>
                        {review.productImages && review.productImages.length > 0 && (
                            <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
                                {review.productImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Product Image ${index + 1}`}
                                        className="h-20 w-20 object-cover rounded-lg flex-shrink-0"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/e0e0e0/000000?text=Img"; }}
                                    />
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={() => onViewReview(review)}
                                className="text-sm font-semibold py-1 px-3 rounded-lg"
                                style={{ color: brandColor }}
                            >
                                View Product
                            </button>
                        </div>
                    </Card>
                ))
            )}
        </div>
    );
};

export default ProductReviewsTab;
