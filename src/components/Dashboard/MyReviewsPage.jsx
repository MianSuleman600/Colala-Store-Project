// src/pages/MyReviewsPage.jsx
import React, { useState } from 'react';
import StoreReviewsTab from '../../components/reviews/StoreReviewsTab';
import ProductReviewsTab from '../../components/reviews/ProductReviewsTab';
import MyReviewModal from '../../components/reviews/models/MyReviewModal';
import LeaveReviewModal from '../../components/reviews/models/LeaveReviewModal';
import ScrollToTop from '../ui/ScrollToTop';

import {
  useStoreReviewsQuery,
  useProductReviewsQuery,
} from '../../services/queries/useReviewQuery.js';

import {
  useUpdateStoreReviewMutation,
  useUpdateProductReviewMutation,
  useDeleteStoreReviewMutation,
  useDeleteProductReviewMutation,
} from '../../services/mutations/useReviewMutation.js';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

const MyReviewsPage = ({ brandColor = '#EF4444', contrastTextColor = '#ffffff' }) => {
  const [activeTab, setActiveTab] = useState('store');
  const [showMyReviewModal, setShowMyReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showLeaveReviewModal, setShowLeaveReviewModal] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);

  // Fetch lists (you can pass params like storeId/productId if needed)
  const { data: storeReviews = [], isLoading: loadingStore } = useStoreReviewsQuery({});
  const { data: productReviews = [], isLoading: loadingProduct } = useProductReviewsQuery({});

  // Mutations
  const updateStoreReview = useUpdateStoreReviewMutation({});
  const updateProductReview = useUpdateProductReviewMutation({});
  const deleteStoreReview = useDeleteStoreReviewMutation({});
  const deleteProductReview = useDeleteProductReviewMutation({});

  const handleViewReview = (review, type) => {
    const r = type ? { ...review, type } : review;
    setSelectedReview(r);
    setShowMyReviewModal(true);
  };

  const handleCloseMyReviewModal = () => {
    setShowMyReviewModal(false);
    setSelectedReview(null);
  };

  const handleEditReview = (review) => {
    setReviewToEdit(review);
    setShowLeaveReviewModal(true);
    handleCloseMyReviewModal();
  };

  const handleCloseLeaveReviewModal = () => {
    setShowLeaveReviewModal(false);
    setReviewToEdit(null);
  };

  const handleSaveReview = async (updatedReview) => {
    try {
      if (updatedReview.type === 'store') {
        await updateStoreReview.mutateAsync({
          id: updatedReview.id,
          payload: {
            rating: updatedReview.rating,
            reviewText: updatedReview.reviewText,
            reviewerName: updatedReview.reviewerName,
            reviewerAvatar: updatedReview.reviewerAvatar,
          },
        });
      } else if (updatedReview.type === 'product') {
        await updateProductReview.mutateAsync({
          id: updatedReview.id,
          payload: {
            rating: updatedReview.rating,
            reviewText: updatedReview.reviewText,
            reviewerName: updatedReview.reviewerName,
            reviewerAvatar: updatedReview.reviewerAvatar,
            productImages: updatedReview.productImages || [],
          },
        });
      }
      toast('success', 'Review updated');
    } catch (err) {
      toast('error', err?.message || 'Failed to save review');
    } finally {
      setShowLeaveReviewModal(false);
    }
  };

  const handleDeleteReview = async (reviewId, reviewType) => {
    if (!window.confirm(`Are you sure you want to delete this ${reviewType} review?`)) return;
    try {
      if (reviewType === 'store') {
        await deleteStoreReview.mutateAsync(reviewId);
      } else if (reviewType === 'product') {
        await deleteProductReview.mutateAsync(reviewId);
      }
      toast('success', 'Review deleted successfully!');
    } catch (err) {
      toast('error', err?.message || 'Failed to delete review');
    } finally {
      handleCloseMyReviewModal();
    }
  };

  return (
    <div className="p-4 md:p-8">
      <ScrollToTop />
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Reviews</h2>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
            activeTab === 'store' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
          }`}
          style={activeTab === 'store' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
          onClick={() => setActiveTab('store')}
        >
          Store Reviews
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
            activeTab === 'product' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
          }`}
          style={activeTab === 'product' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
          onClick={() => setActiveTab('product')}
        >
          Product Reviews
        </button>
      </div>

      {activeTab === 'store' && (
        <StoreReviewsTab
          reviews={storeReviews}
          brandColor={brandColor}
          onViewReview={(review) => handleViewReview(review, 'store')}
        />
      )}

      {activeTab === 'product' && (
        <ProductReviewsTab
          reviews={productReviews}
          brandColor={brandColor}
          onViewReview={(review) => handleViewReview(review, 'product')}
        />
      )}

      {showMyReviewModal && selectedReview && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
            <MyReviewModal
              review={selectedReview}
              onClose={handleCloseMyReviewModal}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}

      {showLeaveReviewModal && reviewToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
            <LeaveReviewModal
              reviewToEdit={reviewToEdit}
              onClose={handleCloseLeaveReviewModal}
              onSave={handleSaveReview}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;