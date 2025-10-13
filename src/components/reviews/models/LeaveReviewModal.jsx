import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import { XMarkIcon as XOutlineIcon, StarIcon } from '@heroicons/react/24/outline';

const LeaveReviewModal = ({ isOpen, reviewToEdit, onClose, onSave, brandColor }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (reviewToEdit) {
      setRating(reviewToEdit.rating || 0);
      setComment(reviewToEdit.comment || '');
    }
  }, [reviewToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      // You can use your toast provider here
      alert('Please provide a rating and a comment.');
      return;
    }
    onSave({ ...reviewToEdit, rating, comment });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Leave a review</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
              <XOutlineIcon className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <StarIcon
                  key={index}
                  className={`h-8 w-8 cursor-pointer ${index <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => setRating(index)}
                />
              ))}
            </div>
            <div>
              <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-1">Type review</label>
              <textarea
                id="review-text"
                placeholder="Type your review"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{'--tw-ring-color': brandColor}}
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <Button
              type="submit"
              style={{ backgroundColor: brandColor }}
              className="w-full py-3 rounded-lg font-semibold text-white"
            >
              Send Review
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewModal;