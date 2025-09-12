// src/pages/products/ProductDetailsPage.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useProductDetailsQuery } from '../../../services/queries/useproductsQuery';
import { useToast } from '../../../components/ui/ToastProvider';

import ProductMediaGallery from '../../../features/products/pages/ProductMediaGallery';
import ProductMoreMenu from '../../../features/products/pages/ProductMoreMenu';
import ProductDeleteModal from '../../../components/models/ProductDeleteModal';
import { useMediaGallery } from '../../../hooks/Products/useMediaGallery';
import { useProductActions } from '../../../hooks/Products/useProductActions';
import { useLike } from '../../../hooks/Products/useLike';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import BackButton from '../../../components/ui/BackButton';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { userId } = useSelector((s) => s.user);
  const { push } = useToast();

  const { data: storeProfileData, isLoading: profileLoading } = useStoreProfile(userId, { enabled: !!userId });
  const brandColor = storeProfileData?.brandColor || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);

  const { data: product, isLoading, isError, error } = useProductDetailsQuery(productId, { enabled: !!productId });

  const media = useMediaGallery(product);
  const { markStatus, deleteProduct, copyLink, shareLink, normalizeStatus } = useProductActions({ productId, userId });
  const { liked, toggle: toggleLike } = useLike(productId, userId);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentStatus = useMemo(() => normalizeStatus(product?.status), [product, normalizeStatus]);

  if (isLoading || profileLoading) return <div className="flex justify-center items-center h-screen">Loading product details...</div>;
  if (isError || !product) return <div className="flex justify-center items-center h-screen text-red-500">Failed to load product: {error?.message || 'Unknown error'}</div>;

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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
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
        <ProductMediaGallery
          brandColor={brandColor}
          mediaRawList={media.mediaRawList}
          selectedRaw={media.selectedRaw}
          selectedDisplay={media.selectedDisplay}
          isVideoDisplay={media.isVideoDisplay}
          videoRef={media.videoRef}
          isPlaying={media.isPlaying}
          onThumbClick={media.handleThumbClick}
          onPlayClick={media.handlePlayClick}
          onVideoError={media.handleVideoError}
          onImageError={media.handleImageError}
        />

        {/* Right: Details and actions */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-gray-600">{product.detailsPageInfo?.description}</p>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold" style={{ color: brandColor }}>
              ₦{product.currentPrice?.toLocaleString() ?? 'N/A'}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-yellow-500 text-sm font-semibold ml-auto">★ {product.rating} </span>
          </div>

          {/* Optional tags placeholder */}
          <div className="flex flex-col space-y-2">
            <div className="bg-orange-500 text-white p-2 h-2.5 rounded-md flex items-center">
              <span className="flex items-center w-7 h-full justify-center pr-1" style={{ backgroundColor: brandColor }}>
                {/* your icon here */}
              </span>
              <span className="text-[12px]">Information tag 1</span>
            </div>
          </div>

          <hr className="my-4 border-t border-gray-300 opacity-60" />

          {/* Quantity Selector (display only) */}
          <div className="flex items-center justify-between py-4 mb-4 mt-4">
            <span className="text-gray-700 text-sm">Quantity left</span>
            <span className="font-semibold" style={{ color: brandColor }}>
              {product.detailsPageInfo?.quantityLeft ?? 0}
            </span>
            <div className="flex items-center rounded-md overflow-hidden">
              <button className="px-3 py-1 text-lg rounded-xl" style={{ backgroundColor: brandColor, color: contrastTextColor }} disabled>
                -
              </button>
              <input type="text" value={1} readOnly className="w-12 text-center bg-white text-gray-900 py-1" />
              <button className="px-3 py-1 text-lg rounded-xl" style={{ backgroundColor: brandColor, color: contrastTextColor }} disabled>
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-4 gap-4 mt-2">
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center p-3 rounded-md shadow-sm hover:shadow-md bg-white text-gray-700"
              title="Delete"
            >
              Delete
            </Button>

            <Button
              onClick={() => navigate(`/my-products/${productId}/stats`)}
              className="flex items-center justify-center p-3 rounded-md shadow-sm hover:shadow-md bg-white text-gray-700"
              title="Stats"
            >
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
            onClick={() => navigate(`/my-products/${productId}/boost-setup`)}
          >
            Boost Post
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mt-6 border border-gray-200">
        <div className="flex border-b rounded-2xl border-gray-200 mb-4 gap-2">
          <button className="py-2 px-4 text-lg rounded-xl" style={{ backgroundColor: brandColor, color: contrastTextColor }}>
            Description
          </button>
          <button className="py-2 px-4 rounded-xl text-lg text-gray-600 hover:text-gray-800">Reviews</button>
        </div>
        <div>
          <p className="text-gray-700 leading-relaxed">
            {product.detailsPageInfo?.description || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;