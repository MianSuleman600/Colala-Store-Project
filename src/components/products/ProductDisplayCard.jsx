// src/components/products/ProductDisplayCard.jsx

import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import {
  PencilSquareIcon,
  EllipsisVerticalIcon,
  FireIcon,
  ShoppingCartIcon,
  StarIcon,
  MapPinIcon,
  ArrowPathIcon, // For the loading spinner
} from '@heroicons/react/24/outline';
import { getContrastTextColor } from '../../utils/colorUtils';

const ProductDisplayCard = ({
  item = {},
  brandColor = '#EF4444',
  contrastTextColor,
  mode = 'product', // 'profile' | 'product' | 'sponsored' | 'service'
  isUpdating = false, // <-- LOGIC: To show loading state for this specific card
  onAddToCart = () => {},
  onViewDetailsClick = () => {},
  onViewStatsClick = () => {},
  onEdit = () => {},
  onMoreOptionsClick = () => {},
}) => {
  // --- UI & State Normalization ---
  const isService = mode === 'service';
  const contrast = contrastTextColor ?? getContrastTextColor(brandColor);

  const raw = String(item.status || '').trim().toLowerCase();
  const normalizedStatus =
    raw === 'available' || raw === 'active'
      ? 'available'
      : raw === 'sold' || raw === 'sold out' || raw === 'out of stock' || raw === 'oos'
      ? 'sold'
      : raw === 'unavailable' || raw === 'inactive'
      ? 'unavailable'
      : 'available';

  const isSold = normalizedStatus === 'sold';
  const isUnavailable = normalizedStatus === 'unavailable';
  const isMasked = isSold || isUnavailable;

  // LOGIC: A button is disabled if the item is sold, unavailable, OR being updated.
  const isDisabled = isMasked || isUpdating;

  const displayPrice = Number(item.discountPrice ?? item.currentPrice ?? item.price ?? 0);
  const originalPrice = item.originalPrice != null ? Number(item.currentPrice ?? item.price ?? 0) : null;
  const badgeText = isSold ? 'Out of Stock' : isUnavailable ? 'Unavailable' : null;

  // --- Render ---
  return (
    <Card className={`relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition-opacity ${isUpdating ? 'opacity-75' : ''}`}>
      
      {/* LOGIC: Loading overlay for when this specific card is being mutated */}
      {isUpdating && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-white/50 backdrop-blur-sm">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-800" />
        </div>
      )}

      {/* UI: Final Status Overlay (Sold/Unavailable) */}
      <div
        className={`absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-black/50 transition-opacity ${
          isMasked ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        role="status"
        aria-label={badgeText}
      >
        {badgeText && (
          <span className="select-none rounded-lg px-3 py-2 text-2xl font-semibold uppercase tracking-wide text-white shadow">
            {badgeText}
          </span>
        )}
      </div>

      {/* UI: Top image section */}
      <div className="relative h-40 w-full bg-gray-100 sm:h-48">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name || 'Item'} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
        )}
        {item.isSponsored && (
          <div className="absolute left-2 top-2 z-10 flex items-center rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            <FireIcon className="mr-1 h-4 w-4 text-orange-400" />
            Sponsored
          </div>
        )}
        {badgeText && !isMasked && ( // Show badge only if not masked to avoid duplication
          <div className="absolute right-2 top-2 z-10 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold uppercase text-white">
            {badgeText}
          </div>
        )}
      </div>

      {/* UI: Store & rating bar */}
      {mode !== 'service' && (
        <div className="flex items-center gap-2 bg-[#F2F2F2] px-3 py-2">
          <img src={item.storeLogo || '/default-profile.png'} alt="store logo" className="h-6 w-6 rounded-full object-cover" loading="lazy" />
          <span className="text-sm font-medium text-gray-800" style={{ color: brandColor }}>
            {item.storeName || 'Store'}
          </span>
          <span className="ml-auto flex items-center gap-1 pr-1 text-sm" style={{ color: brandColor }}>
            <StarIcon className="h-4 w-4" />
            {item.rating ?? '4.5'}
          </span>
        </div>
      )}

      {/* UI: Main Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">{item.name || 'Item Name'}</h3>
        
        {/* Price section */}
        {!isService ? (
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: brandColor }}>
              ₦{Number.isFinite(displayPrice) ? displayPrice.toLocaleString() : '0'}
            </span>
            {originalPrice !== null && (
              <span className="text-[12px] text-gray-400 line-through">
                ₦{Number.isFinite(originalPrice) ? originalPrice.toLocaleString() : '0'}
              </span>
            )}
          </div>
        ) : (
          <div className="mb-3">
            <span className="text-xl font-bold" style={{ color: brandColor }}>
              ₦{item.minPrice?.toLocaleString?.() || '0'} - ₦{item.maxPrice?.toLocaleString?.() || '0'}
            </span>
          </div>
        )}
        
        {/* Discount Tags section */}
        {!isService && (
          <div className="mb-4 flex flex-wrap gap-2">
            {item.hasFreeDelivery && (
              <span className="flex items-center overflow-hidden rounded-md text-xs text-white shadow-sm" style={{ background: `linear-gradient(120deg, ${brandColor} 0 30%, orange 30% 100%)` }}>
                <span className="flex items-center justify-center px-2"><ShoppingCartIcon className="h-4 w-4" style={{ color: contrast }} /></span>
                <span className="px-3 py-1">Free delivery</span>
              </span>
            )}
            {item.hasBulkDiscount && (
              <span className="flex items-center overflow-hidden rounded-md text-xs text-white shadow-sm" style={{ background: `linear-gradient(120deg, ${brandColor} 0 30%, orange 30% 100%)` }}>
                <span className="flex items-center justify-center px-2"><ShoppingCartIcon className="h-4 w-4" style={{ color: contrast }} /></span>
                <span className="px-3 py-1">20% Off in bulk</span>
              </span>
            )}
          </div>
        )}

        {/* UI & LOGIC: Metrics and Actions Section */}
        <div className="mt-auto w-full">
          <div className="mb-4 grid gap-3 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">{isService ? "Service Views" : "Product Views"}</span>
              <span className="font-semibold">{isService ? item.serviceViews ?? 0 : item.metrics?.productViews ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Product Clicks</span>
              <span className="font-semibold">{isService  ? item.productClicks ?? 0 : item.metrics?.productClicks ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Messages</span>
              <span className="font-semibold">{isService ? item.messages ?? 0 : item.metrics?.messages ?? 0}</span>
            </div>
          </div>

          {mode === 'product' && (
            <div className="flex items-center justify-between">
              <span className="rounded-lg border px-2 py-1 text-gray-800">{item.category || 'Uncategorized'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Edit"
                  onClick={() => onEdit(item.id)}
                  className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title="Edit"
                  disabled={isDisabled}
                >
                  <PencilSquareIcon className={`h-6 w-6 transition-colors ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`} />
                </button>
                <button
                  type="button"
                  aria-label="More options"
                  onClick={(e) => onMoreOptionsClick(e, item)} // LOGIC: Pass full item object
                  className="rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title="More options"
                  disabled={isDisabled}
                >
                  <EllipsisVerticalIcon className={`h-6 w-6 transition-colors ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`} />
                </button>
              </div>
            </div>
          )}

          {mode === 'sponsored' && (
            <Button
              className="mt-3 w-full rounded-lg py-2 font-semibold shadow-sm"
              style={{ backgroundColor: brandColor, color: contrast }}
              onClick={() => onViewDetailsClick(item.id)}
              disabled={isDisabled}
            >
              View Details
            </Button>
          )}

          {isService && (
            <Button
              onClick={() => onViewStatsClick(item.id)}
              className="w-full rounded-lg py-2 font-semibold shadow-md transition-shadow hover:shadow-lg"
              style={{ backgroundColor: brandColor, color: contrast }}
              disabled={isDisabled}
            >
              Details
            </Button>
          )}
        </div>

        {mode === 'profile' && (
            // This part is for a different view, but logic is consistent
            <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex items-center text-sm text-gray-500"><MapPinIcon className="h-6 w-6" /><span>{item.location || 'Lagos, Nigeria'}</span></div>
            <button type="button" onClick={onAddToCart} className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-50" aria-label="Add to cart" title="Add to cart" disabled={isDisabled}>
              <ShoppingCartIcon className={`h-6 w-6 transition-colors ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`} />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductDisplayCard;