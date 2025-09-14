// src/components/products/ProductDisplayCard.jsx
import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import {
  PencilSquareIcon,
  EllipsisVerticalIcon,
  FireIcon,
  ShoppingCartIcon,
  StarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { getContrastTextColor } from '../../utils/colorUtils';

const ProductDisplayCard = ({
  item = {},
  brandColor = '#EF4444',
  contrastTextColor,
  mode = 'profile', // 'profile' | 'product' | 'sponsored' | 'service'
  onAddToCart = () => {},
  onViewDetailsClick = () => {},
  onViewStatsClick = () => {},
  onEdit = () => {},
  onMoreOptionsClick = () => {},
}) => {
  const isService = mode === 'service';
  const isProductMode = mode === 'product';
  const contrast = contrastTextColor ?? getContrastTextColor(brandColor);

  // Normalize status to canonical values
  const raw = String(item.status || '').trim().toLowerCase();
  // backward compatibility mapping
  const normalizedStatus =
    raw === 'available' || raw === 'active'
      ? 'available'
      : raw === 'sold' || raw === 'sold out' || raw === 'out of stock' || raw === 'oos'
      ? 'sold'
      : raw === 'unavailable' || raw === 'inactive'
      ? 'unavailable'
      : 'available';

  const isUnavailable = normalizedStatus === 'unavailable';
  const isSold = normalizedStatus === 'sold';
  const isMasked = isUnavailable || isSold;

  const displayPrice = Number(item.discountPrice ?? item.currentPrice ?? item.price ?? 0);
  const originalPrice =
    item.originalPrice != null ? Number(item.currentPrice ?? item.price ?? 0) : null;

  const buildCartItem = (src = {}) => ({
    id: src.id || src._id,
    name: src.name || src.title || 'Unnamed Product',
    price: Number(src.discountPrice ?? src.currentPrice ?? src.price ?? 0),
    image: src.imageUrl || src.images?.[0]?.url || src.image || '',
    storeId: src.storeId,
    sku: src.sku,
    variantId: src.selectedVariantId || src.variantId,
    brand: src.brand || src.brandName,
    category: src.category || src.categoryName,
  });

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isMasked) return; // cannot add when sold/unavailable
    const cartItem = buildCartItem(item);
    if (!cartItem.id) return;
    onAddToCart?.(cartItem, item);
  };

  const disabledProps = isMasked ? { disabled: true, 'aria-disabled': true, tabIndex: -1 } : {};
  const disabledClasses = isMasked ? 'opacity-40 cursor-not-allowed pointer-events-none' : '';

  const badgeText = isSold ? 'Out of Stock' : isUnavailable ? 'Unavailable' : null;

  return (
    <Card className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg">
      {/* Full overlay mask */}
      <div
        className={`absolute inset-0 z-20 bg-black/50 flex items-center justify-center rounded-3xl transition-opacity ${
          isMasked ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        role="status"
        aria-label={isMasked ? badgeText : undefined}
      >
        {badgeText && (
          <span className="select-none rounded-lg px-3 py-2 text-2xl font-semibold uppercase tracking-wide text-white shadow">
            {badgeText}
          </span>
        )}
      </div>

      {/* Top image */}
      <div className="relative h-40 w-full bg-gray-100 sm:h-48">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name || 'Item'} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
        )}

        {/* Sponsored tag */}
        {mode !== 'myServices' && item.isSponsored && (
          <div className="absolute left-2 top-2 z-10 flex items-center rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            <FireIcon className="mr-1 h-4 w-4 text-orange-400" />
            Sponsored
          </div>
        )}

        {/* Top-right status badge */}
        {badgeText && (
          <div className="absolute right-2 top-2 z-10 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold uppercase text-white">
            {badgeText}
          </div>
        )}
      </div>

      {/* Store & rating */}
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

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">{item.name || 'Item Name'}</h3>

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

        {!isService && (
          <div className="mb-4 flex flex-wrap gap-2">
            {item.hasFreeDelivery && (
              <span
                className="flex items-center overflow-hidden rounded-md text-xs text-white shadow-sm"
                style={{ background: `linear-gradient(120deg, ${brandColor} 0 30%, orange 30% 100%)` }}
              >
                <span className="flex items-center justify-center px-2">
                  <ShoppingCartIcon className="h-4 w-4" style={{ color: contrast }} />
                </span>
                <span className="px-3 py-1">Free delivery</span>
              </span>
            )}
            {item.hasBulkDiscount && (
              <span
                className="flex items-center overflow-hidden rounded-md text-xs text-white shadow-sm"
                style={{ background: `linear-gradient(120deg, ${brandColor} 0 30%, orange 30% 100%)` }}
              >
                <span className="flex items-center justify-center px-2">
                  <ShoppingCartIcon className="h-4 w-4" style={{ color: contrast }} />
                </span>
                <span className="px-3 py-1">20% Off in bulk</span>
              </span>
            )}
          </div>
        )}

        {/* Metrics */}
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

          {isProductMode && (
            <div className="flex items-center justify-between">
              <span className="rounded-lg border px-2 py-1 text-gray-800">{item.category || 'Uncategorized'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Edit"
                  onClick={() => !isMasked && onEdit(item.id || item._id)}
                  className={`rounded p-1 hover:bg-gray-100 ${disabledClasses}`}
                  title="Edit"
                  {...disabledProps}
                >
                  <PencilSquareIcon className="h-6 w-6 text-gray-700" />
                </button>
                <button
                  type="button"
                  aria-label="More options"
                  onClick={(e) => !isMasked && onMoreOptionsClick(e, item.id || item._id)}
                  className={`rounded p-1 hover:bg-gray-100 ${disabledClasses}`}
                  title="More options"
                  {...disabledProps}
                >
                  <EllipsisVerticalIcon className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            </div>
          )}

          {mode === 'sponsored' && (
            <Button
              className={`mt-3 w-full rounded-lg py-2 font-semibold shadow-sm ${disabledClasses}`}
              style={{ backgroundColor: brandColor, color: contrast }}
              onClick={() => !isMasked && onViewDetailsClick(item.id || item._id)}
              {...disabledProps}
            >
              View Details
            </Button>
          )}

          {isService && (
            <Button
              onClick={() => !isMasked && onViewStatsClick(item.id || item._id)}
              className={`w-full rounded-lg py-2 font-semibold shadow-md transition-shadow hover:shadow-lg ${disabledClasses}`}
              style={{ backgroundColor: brandColor, color: contrast }}
              {...disabledProps}
            >
              Details
            </Button>
          )}
        </div>

        {mode === 'profile' && (
          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex items-center text-sm text-gray-500">
              <MapPinIcon className="h-6 w-6" />
              <span>{item.location || 'Lagos, Nigeria'}</span>
            </div>
            <button
              type="button"
              onClick={handleAddToCartClick}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-50 ${disabledClasses}`}
              aria-label="Add to cart"
              title="Add to cart"
              data-testid="add-to-cart-button"
              {...disabledProps}
            >
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductDisplayCard;