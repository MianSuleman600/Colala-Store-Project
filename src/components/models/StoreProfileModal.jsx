import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import PromotionalBanner from '../ui/PromotionBanner';
import { getContrastTextColor } from '../../utils/colorUtils';
import { openModal } from '../../redux/modalSlice';
import { addItem, selectCartItemsByUser } from '../../features/cart/cartSlice';
import { useToast } from '../ui/ToastProvider';

import StoreHeader from '../store/StoreHeader';
import StoreOwnerInfoSection from '../store/StoreOwnerInfoSection';
import StoreTabs from '../store/StoreTabs';
import ProductFilterControls from '../ui/ProductFilterControls';
import ProductDisplayCard from '../products/ProductDisplayCard';

import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import { useGetMyProductsQuery, useStoreProductsQuery } from '../../services/queries/useproductsQuery';
import { useStoreFeedQuery } from '../../services/queries/useFeedQuery';
// If your reviews hook is in hooks/useReviewQuery, use the path below:
import { useStoreReviewsQuery } from '../../services/queries/useReviewQuery';
// If instead it lives at services/queries/useReviewQuery, swap the import accordingly.
// import { useStoreReviewsQuery } from '../../services/queries/useReviewQuery';

import StoreReviewsTab from '../reviews/StoreReviewsTab';

function StoreProfileModal({ isOpen, onClose, storeId }) {
  const dispatch = useDispatch();
  const { isLoggedIn, userId } = useSelector((state) => state.user);
  const cartItems = useSelector(selectCartItemsByUser(userId));
  const navigate = useNavigate();
  const { push } = useToast();

  const [activeTab, setActiveTab] = useState('Products');
  const [isFollowing, setIsFollowing] = useState(false);

  // Parent-controlled filters
  const [filters, setFilters] = useState({
    search: '',
    isSponsored: false,
    sort: 'none', // keep API order unless user changes it
  });

  const currentStoreId = useMemo(() => storeId || userId, [storeId, userId]);
  const isFeedTabActive = activeTab === 'SocialFeed';
  const isReviewsTabActive = activeTab === 'Reviews';

  // Store profile
  const {
    data: storeProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useStoreProfile(currentStoreId, {
    enabled: isOpen && !!currentStoreId,
    staleTime: 5 * 60 * 1000,
  });

  const brandColor = useMemo(
    () => storeProfile?.brandColor || '#EF4444',
    [storeProfile]
  );
  const contrastTextColor = useMemo(
    () => getContrastTextColor(brandColor),
    [brandColor]
  );

  const isStoreOwner = useMemo(
    () => isLoggedIn && storeProfile?.ownerId === userId,
    [isLoggedIn, storeProfile, userId]
  );

  // Products: owner vs public store
  const myProductsQuery = useGetMyProductsQuery(userId, {
    enabled: isOpen && !!userId && isStoreOwner,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  const storeProductsQuery = useStoreProductsQuery(currentStoreId, {
    enabled: isOpen && !!currentStoreId && !isStoreOwner,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  const products = isStoreOwner ? myProductsQuery.data ?? [] : storeProductsQuery.data ?? [];
  const productsLoading = isStoreOwner ? myProductsQuery.isLoading : storeProductsQuery.isLoading;
  const productsError = isStoreOwner ? myProductsQuery.error : storeProductsQuery.error;

  // Store-specific feed (load only on tab)
  const {
    data: feedPosts = [],
    isLoading: feedLoading,
    error: feedError,
  } = useStoreFeedQuery(currentStoreId, {
    enabled: isOpen && !!currentStoreId && isFeedTabActive,
  });

  // Store-specific reviews (load only on tab)
  const {
    data: storeReviews = [],
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useStoreReviewsQuery(
    { storeId: currentStoreId, limit: 50 },
    { enabled: isOpen && !!currentStoreId && isReviewsTabActive, staleTime: 60_000 }
  );

  useEffect(() => {
    if (!isOpen) {
      // setActiveTab('Products');
    }
  }, [isOpen]);

  const handleFollowToggle = () => {
    if (!isLoggedIn) {
      dispatch(openModal('login'));
      return;
    }
    setIsFollowing((prev) => !prev);
  };

  // Normalize any product to a cart item
  const normalizeToCartItem = (src = {}) => ({
    id: src.id || src._id,
    name: src.name || src.title || 'Unnamed Product',
    price: Number(src.discountPrice ?? src.currentPrice ?? src.price ?? 0),
    image: src.imageUrl || src.images?.[0]?.url || src.image || '',
    storeId: src.storeId || storeProfile?.id || currentStoreId,
    sku: src.sku,
    variantId: src.selectedVariantId || src.variantId,
    brand: src.brand || src.brandName,
    category: src.category || src.categoryName,
  });

  // Add to cart (supports both normalized payload or raw item)
  const handleAddToCart = useCallback(
    (payloadOrProduct, rawItem) => {
      if (!isLoggedIn) {
        dispatch(openModal('login'));
        push('Please log in to add items to your cart.', { type: 'info' });
        return;
      }

      const cartItem = rawItem ? payloadOrProduct : normalizeToCartItem(payloadOrProduct);
      if (!cartItem?.id) {
        push('Unable to add this product to the cart.', { type: 'error' });
        return;
      }

      const existed = Array.isArray(cartItems) ? cartItems.some((i) => i.id === cartItem.id) : false;
      dispatch(addItem({ userId, item: cartItem }));

      push(
        existed
          ? `${cartItem.name} quantity updated in your cart.`
          : `${cartItem.name} added to your cart.`,
        { type: 'success', duration: 2500 }
      );
    },
    [dispatch, isLoggedIn, userId, currentStoreId, storeProfile?.id, cartItems, push]
  );

  // Filter utils
  const norm = (v) => (v == null ? '' : String(v).trim().toLowerCase());

  // Apply filters in parent; keep original API order unless user sorts
  const filteredProducts = useMemo(() => {
    const src = Array.isArray(products) ? products : [];

    const text = norm(filters.search);

    let result = src.filter((p) => {
      // search
      if (text) {
        const hay = norm(
          `${p.name || ''} ${p.title || ''} ${p.brand || p.brandName || ''} ${p.category || p.categoryName || ''}`
        );
        if (!hay.includes(text)) return false;
      }
      // sponsored
      if (filters.isSponsored && !p.isSponsored) return false;

      return true;
    });

    // Sort ONLY if explicitly chosen
    switch (filters.sort) {
      case 'priceAsc':
        result = [...result].sort(
          (a, b) =>
            Number(a.discountPrice ?? a.currentPrice ?? a.price ?? 0) -
            Number(b.discountPrice ?? b.currentPrice ?? b.price ?? 0)
        );
        break;
      case 'priceDesc':
        result = [...result].sort(
          (a, b) =>
            Number(b.discountPrice ?? b.currentPrice ?? b.price ?? 0) -
            Number(a.discountPrice ?? a.currentPrice ?? a.price ?? 0)
        );
        break;
      case 'rating':
        result = [...result].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      case 'recent':
        if (result.some((x) => x.createdAt || x.updatedAt)) {
          result = [...result].sort((a, b) => {
            const da = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const db = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return db - da;
          });
        }
        break;
      case 'none':
      default:
        // Keep API order
        break;
    }

    return result;
  }, [products, filters]);

  if (profileLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Loading Store..." className="w-11/12 max-w-6xl">
        <div className="p-6 space-y-6">
          <div className="h-24 bg-gray-200 animate-pulse rounded" />
          <div className="h-16 bg-gray-200 animate-pulse rounded" />
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </Modal>
    );
  }

  if (profileError || !storeProfile) {
    const errorMessage = profileError?.message || 'Failed to load store profile. Please try again.';
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Store Not Found" className="w-11/12 max-w-2xl">
        <div className="p-6 text-center text-red-500">
          <p>{errorMessage}</p>
          <Button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  // Grid uses filteredProducts
  const ProductsGrid = () => {
    if (productsLoading) return <div className="text-center text-gray-500 py-6">Loading products...</div>;
    if (productsError) return <div className="text-center text-red-500 py-6">Failed to load products.</div>;

    if (!filteredProducts.length) {
      return (
        <div className="text-center text-gray-500 py-6">
          No products found for the current filter.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((p) => (
          <ProductDisplayCard
            key={p.id || p._id}
            item={p}
            brandColor={brandColor}
            contrastTextColor={contrastTextColor}
            mode="profile"
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    );
  };

  // Store Social Feed (with store avatar, text, media, date)
  const FeedPreview = () => {
    if (!isFeedTabActive) return null;

    if (feedLoading) {
      return (
        <div className="space-y-3">
          <div className="h-24 bg-gray-100 animate-pulse rounded" />
          <div className="h-24 bg-gray-100 animate-pulse rounded" />
          <div className="h-24 bg-gray-100 animate-pulse rounded" />
        </div>
      );
    }

    if (feedError) {
      return (
        <div className="text-center text-red-500 py-6">
          Failed to load posts.
          <div className="mt-3">
            <Button
              onClick={() => navigate(`/feed?storeId=${encodeURIComponent(currentStoreId)}`)}
              className="px-4 py-2 rounded"
              style={{ backgroundColor: brandColor, color: contrastTextColor }}
            >
              Open Full Feed
            </Button>
          </div>
        </div>
      );
    }

    const posts = Array.isArray(feedPosts) ? feedPosts : [];
    if (posts.length === 0) {
      return (
        <div className="text-center text-gray-500 py-6">
          No posts from this store yet.
          <div className="mt-3">
            <Button
              onClick={() => navigate(`/feed?storeId=${encodeURIComponent(currentStoreId)}`)}
              className="px-4 py-2 rounded"
              style={{ backgroundColor: brandColor, color: contrastTextColor }}
            >
              Open Full Feed
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {posts.slice(0, 3).map((post) => {
          const text = post.text || post.content || '';
          const media = post.media || post.images || [];
          const createdAt = post.createdAt ? new Date(post.createdAt).toLocaleString() : '';
          const avatar = storeProfile?.profilePictureUrl || '/default-profile.png';
          const storeName = storeProfile?.storeName || 'Store';
          return (
            <div key={post.id || post._id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center mb-3">
                <img
                  src={avatar}
                  alt={storeName}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/default-profile.png';
                  }}
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{storeName}</span>
                  <span className="text-xs text-gray-500">{createdAt}</span>
                </div>
              </div>

              {text && <p className="text-gray-800 whitespace-pre-wrap">{text}</p>}

              {Array.isArray(media) && media.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {media.slice(0, 4).map((m, i) => (
                    <img
                      key={i}
                      src={m.url || m.src || m}
                      alt="post media"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://placehold.co/320x180/e0e0e0/000000?text=Media';
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="flex justify-center">
          <Button
            onClick={() => navigate(`/feed?storeId=${encodeURIComponent(currentStoreId)}`)}
            className="px-4 py-2 rounded"
            style={{ backgroundColor: brandColor, color: contrastTextColor }}
          >
            View Full Feed
          </Button>
        </div>
      </div>
    );
  };

  // Reviews tab (store-specific)
  const ReviewsList = () => {
    if (!isReviewsTabActive) return null;

    if (reviewsLoading) {
      return (
        <div className="space-y-3">
          <div className="h-16 bg-gray-100 animate-pulse rounded" />
          <div className="h-16 bg-gray-100 animate-pulse rounded" />
          <div className="h-16 bg-gray-100 animate-pulse rounded" />
        </div>
      );
    }

    if (reviewsError) {
      return <div className="text-center text-red-500 py-6">Failed to load reviews.</div>;
    }

    // StoreReviewsTab expects reviews as an array with reviewerName, reviewerAvatar, rating, reviewText, dateCreated
    const reviews = Array.isArray(storeReviews) ? storeReviews : [];

    return <StoreReviewsTab reviews={reviews} brandColor={brandColor} onViewReview={() => {}} />;
  };

  // Filter change handler from child
  const handleFilterChange = useCallback((next) => {
    setFilters((prev) => {
      const incoming = typeof next === 'function' ? next(prev) : next || {};
      return { ...prev, ...incoming };
    });
  }, []);

  const modalContent = (
    <div className="grid grid-cols-1 mt-3 lg:grid-cols-3 px-6 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <StoreHeader
          bannerImageUrl={storeProfile.bannerImageUrl}
          profilePictureUrl={storeProfile.profilePictureUrl}
          isModalOpen={isOpen}
          handleGoBack={onClose}
          handleShare={() =>
            navigator.share?.({ title: storeProfile.storeName, url: window.location.href })
          }
        />
        <StoreOwnerInfoSection
          storeData={storeProfile}
          isLoggedIn={isLoggedIn}
          isStoreOwner={isStoreOwner}
          onOpenAuthModal={(mode) => dispatch(openModal(mode || 'login'))}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
          isFollowing={isFollowing}
          handleFollowToggle={handleFollowToggle}
        />
        <PromotionalBanner
          storeName={storeProfile.storeName}
          onButtonClick={() => console.log('Shop Now clicked')}
          imageUrl={storeProfile.promotionalBannerImageUrl}
        />
      </div>

      <div className="lg:col-span-2 space-y-6">
        <StoreTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
        />

        {activeTab === 'Products' && (
          <>
            <ProductFilterControls
              value={filters}
              onChange={handleFilterChange}
              showSponsored
              showSort
            />
            <ProductsGrid />
          </>
        )}

        {activeTab === 'SocialFeed' && <FeedPreview />}

        {activeTab === 'Reviews' && <ReviewsList />}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-11/12 overflow-y-auto scrollbar-custom max-w-6xl"
      title={<h2 className="text-center">{storeProfile.storeName}</h2>}
      titleClassName="text-center"
      headerClassName="bg-gray-50"
      footer={
        isStoreOwner && (
          <Button
            onClick={() => {
              onClose();
              navigate('/store-management');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <PlusCircle className="inline-block w-4 h-4 mr-2" />
            Manage Store
          </Button>
        )
      }
    >
      {modalContent}
    </Modal>
  );
}

export default StoreProfileModal;