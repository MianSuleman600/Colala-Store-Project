import React from 'react';
import Card from '../ui/Card';
import { StarIcon } from '@heroicons/react/24/solid';

const renderStars = (rating) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map((i) => (
      <StarIcon key={i} className={`h-5 w-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

const StoreReviewsTab = ({ reviews, brandColor, onViewReview }) => {
  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <Card className="p-6 text-center text-gray-600">No store reviews found.</Card>
      ) : (
        reviews.map((review) => (
          <Card key={review.id} className="p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <img
                  src={review.user?.profile_picture_url || 'https://ui-avatars.com/api/?name=' + review.user?.full_name}
                  alt={review.user?.full_name}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                />
                <div>
                  <span className="font-medium text-gray-800">{review.user?.full_name}</span>
                  {renderStars(review.rating)}
                </div>
              </div>
              <span className="text-gray-500 text-xs">{new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700 mb-3">{review.comment}</p>
            <div className="flex items-center justify-end mt-2">
              <button onClick={() => onViewReview(review, 'store')} className="text-sm font-semibold" style={{ color: brandColor }}>
                View Review
              </button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default StoreReviewsTab;