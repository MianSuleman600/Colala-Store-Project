// src/pages/products/ProductDetailsPage.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { useProductDetailsQuery } from '../../../services/queries/useproductsQuery';
import { useToast } from '../../../components/ui/ToastProvider';

import ProductMoreMenu from '../../../features/products/pages/ProductMoreMenu';
import ProductDeleteModal from '../../../components/models/ProductDeleteModal';
import ProductImageGallery from '../../../components/products/ProductImageGallery';
import { useProductActions } from '../../../hooks/Products/useProductActions';
import { useLike } from '../../../hooks/Products/useLike';
import {
  HeartIcon as HeartIconOutline,
  ChartBarIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import BackButton from '../../../components/ui/BackButton';

// ✅ Removed duplicate mutation imports — handled by useProductActions internally

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useSelector((s) => s.user);
  const { push } = useToast();

  // --- Store profile for theming ---
  // Note: Store info is now obtained from product data

  // --- Product details query ---
  const preloadedProduct = location.state?.product;
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProductDetailsQuery(productId, {
    enabled: !!productId,
    initialData: preloadedProduct ? {
      ...preloadedProduct,
      detailsPageInfo: preloadedProduct.detailsPageInfo || {},
      reviews: preloadedProduct.reviews || [],
    } : undefined,
  });

  // --- Hooks for actions ---
  const { markStatus, deleteProduct, copyLink, shareLink, normalizeStatus } =
    useProductActions({ productId, userId });
  const { liked, toggle: toggleLike } = useLike(productId, userId);

  // --- Local UI state ---
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [qty, setQty] = useState(1);

  // --- Derived values ---
  const currentStatus = useMemo(
    () => normalizeStatus(product?.status),
    [product, normalizeStatus]
  );
  const quantityLeft = Number(product?.qty ?? product?.quantity ?? 0);
  const reviews = Array.isArray(product?.reviews) ? product.reviews : [];
  const reviewCount = reviews.length;
  
  // Price calculations based on API response
  const currentPrice = product?.discount_price ? parseFloat(product.discount_price) : parseFloat(product?.price || 0);
  const originalPrice = product?.discount_price ? parseFloat(product.price || 0) : null;
  
  // Store information
  const storeInfo = product?.store;
  const brandColor = storeInfo?.theme_color || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);

  // --- Keep qty valid based on stock ---
  useEffect(() => {
    setQty(quantityLeft > 0 ? 1 : 0);
  }, [productId, quantityLeft]);

  const isMinusDisabled = qty <= 1;
  const isPlusDisabled = quantityLeft <= 0 || qty >= quantityLeft;

  const handleDecrement = () => setQty((q) => Math.max(1, q - 1));

  const handleIncrement = () => {
    if (quantityLeft <= 0) {
      push?.('Out of stock.', { type: 'warning' });
      return;
    }
    setQty((q) => {
      if (q >= quantityLeft) {
        push?.('You reached the available stock.', { type: 'info' });
        return q;
      }
      return q + 1;
    });
  };

  // --- Loading & error states ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-600">Loading product details...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the product information</p>
        </div>
      </div>
    );
  }
  if (isError || !product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to load product</h2>
          <p className="text-gray-600 mb-4">{error?.message || 'Unknown error occurred'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --- Render UI ---
  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      {/* Mobile back button */}
      <div className="md:hidden mb-3">
        <BackButton fallback="/my-products" />
      </div>

      {/* Delete modal */}
      <ProductDeleteModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteProduct(() => navigate('/my-products'))}
        productName={product.name}
        brandColor={brandColor}
        contrastTextColor={contrastTextColor}
      />

      {/* Header with Like + More menu */}
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold text-gray-800"
          style={{ fontFamily: 'Manrope' }}
        >
          <Link to="/my-products" className="hover:underline text-black/50">
            My product
          </Link>{' '}
          /<span className="text-black"> Product Details</span>
        </h1>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-gray-200"
            title={liked ? 'Unlike' : 'Like'}
            onClick={toggleLike}
          >
            {liked ? (
              <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIconOutline className="h-6 w-6 text-gray-600" />
            )}
          </button>

          <ProductMoreMenu
            currentStatus={currentStatus}
            onEdit={() => navigate(`/my-products/${productId}/edit`)}
            onBoost={() => navigate(`/my-products/${productId}/boost-setup`)}
            onStats={() => navigate(`/my-products/${productId}/stats`)}
            onCopyLink={() => copyLink()}
            onShare={() => shareLink(product?.name)}
            onMarkSold={() => markStatus('sold')}
            onMarkUnavailable={() => markStatus('unavailable')}
            onMarkAvailable={() => markStatus('available')}
            onDelete={() => setShowDeleteConfirm(true)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border border-gray-200">
        {/* Left: Media */}
        <ProductImageGallery
          images={product.images || []}
          video={product.video}
        />

        {/* Right: Details and actions */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-gray-600">{product.description || 'No description available'}</p>

          {/* Store Information */}
          {storeInfo && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {storeInfo.profile_image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL || 'https://colala.hmstech.xyz'}/storage/${storeInfo.profile_image}`}
                    alt={storeInfo.store_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {storeInfo.store_name?.charAt(0) || 'S'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{storeInfo.store_name}</h3>
                <p className="text-sm text-gray-600">{storeInfo.store_location}</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm text-gray-600">{storeInfo.average_rating || '0'}</span>
              </div>
            </div>
          )}

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold" style={{ color: brandColor }}>
              ₦{currentPrice.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ₦{originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-yellow-500 text-sm font-semibold ml-auto">
              ★ {product.average_rating || '0'}
            </span>
          </div>

      

          <hr className="my-4 border-t border-gray-300 opacity-60" />

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-4 mb-4 mt-4">
            <div className="flex flex-col">
              <span className="text-gray-700 text-sm">Quantity left</span>
              <span className="font-semibold" style={{ color: brandColor }}>
                {quantityLeft}
              </span>
            </div>

            <div className="flex items-center rounded-md overflow-hidden">
              <button
                className="px-3 py-1 text-lg rounded-l-xl disabled:opacity-50"
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                onClick={handleDecrement}
                disabled={isMinusDisabled}
              >
                -
              </button>
              <input
                type="text"
                value={qty}
                readOnly
                className="w-12 text-center bg-white text-gray-900 py-1"
              />
              <button
                className="px-3 py-1 text-lg rounded-r-xl disabled:opacity-50"
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                onClick={handleIncrement}
                disabled={isPlusDisabled}
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-4 gap-4 mt-2">
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 p-3 rounded-md shadow-sm hover:shadow-md bg-white text-gray-700"
              title="Delete"
            >
              <TrashIcon className="h-5 w-5" />
              Delete
            </Button>

            <Button
              onClick={() => navigate(`/my-products/${productId}/stats`)}
              className="flex items-center justify-center gap-2 p-3 rounded-md shadow-sm hover:shadow-md bg-white text-gray-700"
              title="Stats"
            >
              <ChartBarIcon className="h-5 w-5" />
              Stats
            </Button>

            <Button
              onClick={() => navigate(`/my-products/${productId}/edit`)}
              className="col-span-2 flex items-center justify-center p-3 rounded-md shadow-sm hover:shadow-md"
              style={{ backgroundColor: brandColor, color: contrastTextColor }}
              title="Edit Product"
            >
              Edit Product
            </Button>
          </div>

          {/* Boost button */}
          <Button
            className="w-full py-3 rounded-md shadow-sm hover:shadow-md text-white mt-4"
            style={{ backgroundColor: 'black' }}
            onClick={() => {
              // Prepare product data with image as primary (not video)
              const boostProductData = {
                ...product,
                // Ensure the first image is used as primary, not video
                primaryImage: product?.images?.find(img => img.is_main === 1) || product?.images?.[0],
                // Remove video from the data to ensure only images are used
                video: null,
                // Keep all other data intact
                images: product?.images || [],
                name: product?.name,
                price: product?.price,
                discount_price: product?.discount_price,
                description: product?.description,
                category: product?.category,
                brand: product?.brand,
                id: product?.id,
                store_id: product?.store_id,
                status: product?.status,
                views: product?.views,
                clicks: product?.clicks,
                carts: product?.carts,
                orders: product?.orders,
                chats: product?.chats,
                average_rating: product?.average_rating,
                impressions: product?.impressions,
                variants: product?.variants || [],
                created_at: product?.created_at,
                updated_at: product?.updated_at,
              };
              
              navigate(`/my-products/${productId}/boost-setup`, { 
                state: { product: boostProductData } 
              });
            }}
          >
            Boost Post
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mt-6 border border-gray-200">
        <div className="flex border-b rounded-2xl border-gray-200 mb-4 gap-2">
          <button
            className={`py-2 px-4 text-lg rounded-xl ${
              activeTab === 'description'
                ? ''
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            style={
              activeTab === 'description'
                ? { backgroundColor: brandColor, color: contrastTextColor }
                : {}
            }
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>

          <button
            className={`py-2 px-4 text-lg rounded-xl ${
              activeTab === 'reviews'
                ? ''
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            style={
              activeTab === 'reviews'
                ? { backgroundColor: brandColor, color: contrastTextColor }
                : {}
            }
            onClick={() => setActiveTab('reviews')}
          >
            Reviews {reviewCount ? `(${reviewCount})` : ''}
          </button>
        </div>

        {activeTab === 'description' ? (
          <div>
            <p className="text-gray-700 leading-relaxed">
              {product.description || 'No description available.'}
            </p>
            {product.brand && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Brand</h4>
                <p className="text-gray-600">{product.brand}</p>
              </div>
            )}
            {product.category && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Category</h4>
                <p className="text-gray-600">{product.category.title}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {reviewCount > 0 ? (
              <ul className="space-y-4">
                {reviews.map((r, idx) => {
                  const author = r?.userName || r?.name || 'Anonymous';
                  const rating = typeof r?.rating === 'number' ? r.rating : null;
                  const comment = r?.comment || r?.text || '';
                  return (
                    <li
                      key={r?.id || r?._id || idx}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800">{author}</span>
                        {rating != null && (
                          <span className="text-yellow-500 text-sm">★ {rating}</span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm">{comment}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-600">No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
