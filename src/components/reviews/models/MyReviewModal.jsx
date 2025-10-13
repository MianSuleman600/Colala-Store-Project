import React from 'react';
import Button from '../../ui/Button';
import { XMarkIcon as XSolidIcon, StarIcon } from '@heroicons/react/24/solid';

const MyReviewModal = ({ isOpen, review, onClose, onEdit, onDelete, brandColor }) => {
  if (!isOpen || !review) return null;

  const renderStars = (rating) => (
    <div className="flex justify-center mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} className={`h-7 w-7 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My review</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
              <XSolidIcon className="h-6 w-6" />
            </button>
          </div>
          {renderStars(review.rating)}
          <div className="flex items-center mb-4">
            <img
              src={review.user?.profile_picture_url || '...'}
              alt={review.user?.full_name}
              className="h-10 w-10 rounded-full object-cover mr-3"
            />
            <span className="font-medium">{review.user?.full_name}</span>
            <span className="text-gray-500 text-xs ml-auto">{new Date(review.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-700 text-base mb-6">{review.comment}</p>
          <div className="flex justify-between space-x-4">
            <Button onClick={() => onEdit(review)} className="flex-1 py-3 rounded-lg" style={{ backgroundColor: '#E5E7EB' }}>Edit Review</Button>
            <Button onClick={() => onDelete(review)} className="flex-1 py-3 rounded-lg text-white" style={{ backgroundColor: brandColor }}>Delete Review</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReviewModal;