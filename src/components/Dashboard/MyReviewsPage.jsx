// src/pages/MyReviewsPage.jsx
import React, { useState } from 'react';
import StoreReviewsTab from '../../components/reviews/StoreReviewsTab';
import ProductReviewsTab from '../../components/reviews/ProductReviewsTab';
import MyReviewModal from '../../components/reviews/models/MyReviewModal';
import LeaveReviewModal from '../../components/reviews/models/LeaveReviewModal';
import ScrollToTop from '../ui/ScrollToTop';

// Dummy images for avatars and product reviews
import reviewerAvatar1 from '../../assets/images/productImages/2.jpeg';
import reviewerAvatar2 from '../../assets/images/productImages/3.jpeg';
import reviewerAvatar3 from '../../assets/images/productImages/4.jpeg';
import reviewProduct1 from '../../assets/images/productImages/1.png';
import reviewProduct2 from '../../assets/images/productImages/2.jpeg';
import reviewProduct3 from '../../assets/images/productImages/3.jpeg';


/**
 * MyReviewsPage Component
 * This component acts as the main container for managing seller reviews.
 * It features two tabs: "Store Reviews" and "Product Reviews", and controls
 * the display of modals for viewing and editing reviews.
 * It matches the design in 'image_f473ff.png' and 'image_f47401.png'.
 *
 * @param {object} props
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastTextColor - The text color that contrasts well with brandColor.
 */
const MyReviewsPage = ({ brandColor, contrastTextColor }) => {
    // State to manage the active tab: 'store' or 'product'
    const [activeTab, setActiveTab] = useState('store');

    // State for viewing a specific review in MyReviewModal
    const [showMyReviewModal, setShowMyReviewModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    // State for editing a review in LeaveReviewModal
    const [showLeaveReviewModal, setShowLeaveReviewModal] = useState(false);
    const [reviewToEdit, setReviewToEdit] = useState(null);

    // Dummy data for Store Reviews
    const [storeReviews, setStoreReviews] = useState([
        { id: 'sr1', reviewerName: 'Adam Sandler', reviewerAvatar: reviewerAvatar1, rating: 4, reviewText: 'The Store is amazing', dateCreated: '07-16-25/05:33AM' },
        { id: 'sr2', reviewerName: 'Chris Pine', reviewerAvatar: reviewerAvatar2, rating: 5, reviewText: 'Great service and fast delivery!', dateCreated: '07-15-25/10:00AM' },
        { id: 'sr3', reviewerName: 'Sophia Loren', reviewerAvatar: reviewerAvatar3, rating: 3, reviewText: 'Good products, but delivery was a bit slow.', dateCreated: '07-14-25/09:00AM' },
    ]);

    // Dummy data for Product Reviews
    const [productReviews, setProductReviews] = useState([
        { id: 'pr1', reviewerName: 'Adam Sandler', reviewerAvatar: reviewerAvatar1, rating: 4, reviewText: 'Really great product, I enjoyed using it for a long time', dateCreated: '07-16-25/05:33AM', productImages: [reviewProduct1, reviewProduct2, reviewProduct3] },
        { id: 'pr2', reviewerName: 'Chris Evans', reviewerAvatar: reviewerAvatar2, rating: 5, reviewText: 'Fantastic quality, highly recommend!', dateCreated: '07-15-25/11:00AM', productImages: [reviewProduct2] },
        { id: 'pr3', reviewerName: 'Scarlett Johansson', reviewerAvatar: reviewerAvatar3, rating: 4, reviewText: 'Solid product for the price. Would buy again.', dateCreated: '07-14-25/09:00AM', productImages: [reviewProduct3, reviewProduct1] },
    ]);

    // Handler to open MyReviewModal
    const handleViewReview = (review, type) => {
        setSelectedReview({ ...review, type }); // Add type to differentiate between store/product
        setShowMyReviewModal(true);
    };

    // Handler to close MyReviewModal
    const handleCloseMyReviewModal = () => {
        setShowMyReviewModal(false);
        setSelectedReview(null);
    };

    // Handler to open LeaveReviewModal for editing
    const handleEditReview = (review) => {
        setReviewToEdit(review);
        setShowLeaveReviewModal(true);
        handleCloseMyReviewModal(); // Close MyReviewModal if it's open
    };

    // Handler to close LeaveReviewModal
    const handleCloseLeaveReviewModal = () => {
        setShowLeaveReviewModal(false);
        setReviewToEdit(null);
    };

    // Handler to save edited review
    const handleSaveReview = (updatedReview) => {
        console.log('Saving review:', updatedReview);
        if (updatedReview.type === 'store') {
            setStoreReviews(prevReviews =>
                prevReviews.map(rev =>
                    rev.id === updatedReview.id ? updatedReview : rev
                )
            );
        } else if (updatedReview.type === 'product') {
            setProductReviews(prevReviews =>
                prevReviews.map(rev =>
                    rev.id === updatedReview.id ? updatedReview : rev
                )
            );
        }
        setShowLeaveReviewModal(false);
    };

    // Handler to delete review
    const handleDeleteReview = (reviewId, reviewType) => {
        if (window.confirm(`Are you sure you want to delete this ${reviewType} review?`)) {
            if (reviewType === 'store') {
                setStoreReviews(prevReviews => prevReviews.filter(rev => rev.id !== reviewId));
            } else if (reviewType === 'product') {
                setProductReviews(prevReviews => prevReviews.filter(rev => rev.id !== reviewId));
            }
            handleCloseMyReviewModal();
            alert('Review deleted successfully!'); // Replace with custom modal
        }
    };


    return (
        <div className="p-4 md:p-8">
              <ScrollToTop/>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">My Reviews</h2>

            {/* Tab Navigation */}
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

            {/* Conditional Tab Content */}
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

            {/* My Review Modal */}
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

            {/* Leave a Review Modal (for editing) */}
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
