import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ScrollToTop from '../../components/ui/ScrollToTop';
import { useToast } from '../../components/ui/ToastProvider';
import { getContrastTextColor } from '../../utils/colorUtils';

// Import hooks
import { useMyReviewsQuery } from '../../services/queries/useReviewQuery.js';
import {
  useUpdateStoreReviewMutation,
  useDeleteStoreReviewMutation,
  useUpdateProductReviewMutation,
  useDeleteProductReviewMutation,
} from '../../services/mutations/useReviewMutation.js';

// Import sub-components
import StoreReviewsTab from '../../components/reviews/StoreReviewsTab';
import ProductReviewsTab from '../../components/reviews/ProductReviewsTab';
import MyReviewModal from '../../components/reviews/models/MyReviewModal';
import LeaveReviewModal from '../../components/reviews/models/LeaveReviewModal';

const MyReviewsPage = () => {
  const { push } = useToast();
  const [activeTab, setActiveTab] = useState('store');
  const [selectedReview, setSelectedReview] = useState(null); // For viewing
  const [reviewToEdit, setReviewToEdit] = useState(null);     // For editing

  // Get user and brand color from Redux
  const { user } = useSelector((state) => state.auth);
  const brandColor = useMemo(() => user?.store?.brandColor || user?.store?.theme_color || '#EF4444', [user]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  // A single query to get all reviews, with selectors splitting the data
  const { data, isLoading } = useMyReviewsQuery();
  const storeReviews = data?.storeReviews || [];
  const productReviews = data?.productReviews || [];

  // Mutations
  const updateStoreReview = useUpdateStoreReviewMutation();
  const deleteStoreReview = useDeleteStoreReviewMutation();
  const updateProductReview = useUpdateProductReviewMutation(); // Note: Will show error until backend is ready
  const deleteProductReview = useDeleteProductReviewMutation(); // Note: Will show error until backend is ready

  const handleViewReview = (review, type) => {
    setSelectedReview({ ...review, type });
  };

  const handleEditReview = (review) => {
    setReviewToEdit(review);
    setSelectedReview(null); // Close the view modal to open the edit modal
  };

  const handleSaveReview = async (updatedReview) => {
    try {
      if (updatedReview.type === 'store') {
        await updateStoreReview.mutateAsync({
          storeId: updatedReview.store_id,
          reviewId: updatedReview.id,
          payload: { rating: updatedReview.rating, comment: updatedReview.comment, images: updatedReview.images },
        });
      } else {
        // This will fail until the backend endpoint is created, but the UI is ready
        push("Updating product reviews is not yet supported.", { type: 'info' });
        // await updateProductReview.mutateAsync({ reviewId: updatedReview.id, payload: { ... } });
      }
      push('Review updated successfully!', { type: 'success' });
      setReviewToEdit(null); // Close the edit modal
    } catch (err) {
      push(err.message || 'Failed to update review.', { type: 'error' });
    }
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm(`Are you sure you want to delete this ${review.type} review?`)) return;
    try {
      if (review.type === 'store') {
        await deleteStoreReview.mutateAsync({ storeId: review.store_id, reviewId: review.id });
      } else {
        // This will fail until the backend endpoint is created
        push("Deleting product reviews is not yet supported.", { type: 'info' });
        // await deleteProductReview.mutateAsync(review.id);
      }
      push('Review deleted successfully!', { type: 'success' });
      setSelectedReview(null); // Close the view modal
    } catch (err) {
      push(err.message || 'Failed to delete review.', { type: 'error' });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <ScrollToTop />
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Reviews</h2>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'store' ? 'shadow text-white' : 'text-gray-600'
          }`}
          style={activeTab === 'store' ? { backgroundColor: brandColor } : {}}
          onClick={() => setActiveTab('store')}
        >
          Store Reviews
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
            activeTab === 'product' ? 'shadow text-white' : 'text-gray-600'
          }`}
          style={activeTab === 'product' ? { backgroundColor: brandColor } : {}}
          onClick={() => setActiveTab('product')}
        >
          Product Reviews
        </button>
      </div>

      {isLoading ? (
        <div className="text-center p-8 text-gray-500">Loading reviews...</div>
      ) : (
        <>
          {activeTab === 'store' && <StoreReviewsTab reviews={storeReviews} brandColor={brandColor} onViewReview={handleViewReview} />}
          {activeTab === 'product' && <ProductReviewsTab reviews={productReviews} brandColor={brandColor} onViewReview={handleViewReview} />}
        </>
      )}

      <MyReviewModal
        isOpen={!!selectedReview}
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        onEdit={handleEditReview}
        onDelete={handleDeleteReview}
        brandColor={brandColor}
      />
      <LeaveReviewModal
        isOpen={!!reviewToEdit}
        reviewToEdit={reviewToEdit}
        onClose={() => setReviewToEdit(null)}
        onSave={handleSaveReview}
        brandColor={brandColor}
      />
    </div>
  );
};

export default MyReviewsPage;