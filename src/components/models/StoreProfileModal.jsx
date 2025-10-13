import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import PromotionalBanner from '../ui/PromotionBanner';
import { getContrastTextColor } from '../../utils/colorUtils';
import { openModal } from '../../redux/modalSlice';

import StoreHeader from '../store/StoreHeader';
import StoreOwnerInfoSection from '../store/StoreOwnerInfoSection';
import StoreTabs from '../store/StoreTabs';
import ProductFilterControls from '../ui/ProductFilterControls';
import ProductDisplayCard from '../products/ProductDisplayCard';
import StoreReviewsTab from '../reviews/StoreReviewsTab';

import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import { useGetMyProductsQuery } from '../../services/queries/useproductsQuery';
import { useStoreFeedQuery } from '../../services/queries/useFeedQuery';
import { useMyReviewsQuery } from '../../services/queries/useReviewQuery';

function StoreProfileModal({ isOpen, onClose, storeId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated: isLoggedIn, user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState('Products');
  const [isFollowing, setIsFollowing] = useState(false);
  const [filters, setFilters] = useState({ search: '', sort: 'none' });

  // The hook now returns clean, normalized data
  const { data: storeProfile, isLoading: profileLoading, error: profileError } = useStoreProfile(storeId, {
    enabled: isOpen && !!storeId,
  });

  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);
  const isStoreOwner = useMemo(() => isLoggedIn && userId === storeProfile?.ownerId, [isLoggedIn, userId, storeProfile]);

  const { data: products = [] } = useGetMyProductsQuery(storeId, { enabled: isOpen && !!storeId });
  const { data: feedPosts = [] } = useStoreFeedQuery(storeId, { enabled: isOpen && activeTab === 'SocialFeed' });
  const { data: reviewData } = useMyReviewsQuery({ enabled: isOpen && activeTab === 'Reviews' });
  
  const storeReviews = useMemo(() => (reviewData?.storeReviews || []).filter(r => r.store_id === storeId), [reviewData, storeId]);

  const handleFollowToggle = () => {
    if (!isLoggedIn) { dispatch(openModal('login')); return; }
    setIsFollowing((prev) => !prev);
  };

  const handleShare = () => {
      navigator.share?.({ title: storeProfile?.name, url: window.location.href });
  };
  
  const handleFilterChange = useCallback((newFilters) => { setFilters(prev => ({...prev, ...newFilters})); }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (filters.search) {
      result = result.filter(p => p.name?.toLowerCase().includes(filters.search.toLowerCase()));
    }
    return result;
  }, [products, filters]);

  if (!isOpen) return null;
  if (profileLoading) return <Modal isOpen={true} onClose={onClose} title="Loading..."><div className="p-8 text-center">Loading Store...</div></Modal>;
  if (profileError || !storeProfile) return <Modal isOpen={true} onClose={onClose} title="Error"><div className="p-8 text-center text-red-500">{profileError?.message || 'Store not found.'}</div></Modal>;

  const ProductsGrid = () => { /* ... unchanged ... */ };
  const FeedPreview = () => { /* ... unchanged ... */ };
  const ReviewsList = () => <StoreReviewsTab reviews={storeReviews} brandColor={brandColor} />;

  const modalContent = (
    <div className="grid grid-cols-1 mt-3 lg:grid-cols-3 px-6 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <StoreHeader
          bannerImageUrl={storeProfile.bannerImageUrl}
          profilePictureUrl={storeProfile.profilePictureUrl}
          isModalOpen={isOpen}
          handleGoBack={onClose}
          handleShare={handleShare}
          isFollowing={isFollowing}
          handleFollowToggle={handleFollowToggle}
          isStoreOwner={isStoreOwner}
        />
        <StoreOwnerInfoSection
          storeData={storeProfile}
          isLoggedIn={isLoggedIn}
          isStoreOwner={isStoreOwner}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />
        <PromotionalBanner placement="profile" />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <StoreTabs activeTab={activeTab} onTabChange={setActiveTab} brandColor={brandColor} contrastTextColor={contrastTextColor} />
        {activeTab === 'Products' && <><ProductFilterControls value={filters} onChange={handleFilterChange} /><ProductsGrid /></>}
        {activeTab === 'SocialFeed' && <FeedPreview />}
        {activeTab === 'Reviews' && <ReviewsList />}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-11/12 max-w-6xl" title="">
      {modalContent}
    </Modal>
  );
}

export default StoreProfileModal;