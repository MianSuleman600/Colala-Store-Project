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
  const contrast = contrastTextColor ?? getContrastTextColor(brandColor);

  const displayPrice = Number(item.discountPrice ?? item.currentPrice ?? item.price ?? 0);
  const originalPrice =
    item.discountPrice != null ? Number(item.currentPrice ?? item.price ?? 0) : null;

  // Build a normalized cart payload so reducers always get valid id/price/image
  const buildCartItem = (src = {}) => {
    return {
      id: src.id || src._id, // support both id and _id
      name: src.name || src.title || 'Unnamed Product',
      price: Number(src.discountPrice ?? src.currentPrice ?? src.price ?? 0),
      image: src.imageUrl || src.images?.[0]?.url || src.image || '',
      // optional meta you may want in cart UI
      storeId: src.storeId,
      sku: src.sku,
      variantId: src.selectedVariantId || src.variantId,
      brand: src.brand || src.brandName,
      category: src.category || src.categoryName,
    };
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const cartItem = buildCartItem(item);

    // If id is missing, do nothing (prevents silent failures in reducer)
    if (!cartItem.id) {
      // Optional: console.warn('Missing product id for cart add', item);
      return;
    }

    // Call parent handler with normalized cart payload (first arg) and raw item (second arg)
    if (typeof onAddToCart === 'function') {
      onAddToCart(cartItem, item);
    } else {
      // Optional fallback: emit an event if no handler is wired
      window.dispatchEvent?.(
        new CustomEvent('CART_ADD_ITEM', { detail: { item: cartItem } })
      );
    }
  };

  return (
    <Card className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-md">
      {/* Top Image */}
      <div className="relative h-40 w-full bg-gray-100 sm:h-48">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name || 'Item'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Sponsored Tag */}
        {mode !== 'myServices' && item.isSponsored && (
          <div className="absolute left-2 top-2 flex items-center rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            <FireIcon className="mr-1 h-4 w-4 text-orange-400" />
            Sponsored
          </div>
        )}
      </div>

      {/* Store & Rating (not for services) */}
      {mode !== 'service' && (
        <div className="flex items-center gap-2 bg-[#F2F2F2] px-3 py-2">
          <img
            src={item.storeLogo || '/default-profile.png'}
            alt="store logo"
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-800">
            {item.storeName || 'Store'}
          </span>
          <span className="ml-auto flex items-center gap-1 pr-1 text-sm text-yellow-600">
            <StarIcon className="h-4 w-4" />
            {item.rating ?? '4.5'}
          </span>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
          {item.name || 'Item Name'}
        </h3>

        {/* Price or Range */}
        {!isService ? (
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">
              ₦{Number.isFinite(displayPrice) ? displayPrice.toLocaleString() : '0'}
            </span>
            {originalPrice !== null && (
              <span className="text-base text-gray-400 line-through">
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

        {/* Tags (delivery/discount) - products only */}
        {!isService && (
          <div className="mb-4 flex flex-wrap gap-2">
            {item.hasFreeDelivery && (
              <span
                className="flex items-center overflow-hidden rounded-md text-xs text-white shadow-sm"
                style={{
                  background: `linear-gradient(120deg, ${brandColor} 0 30%, orange 30% 100%)`,
                }}
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
                style={{
                  background: `linear-gradient(120deg, ${brandColor} 0 30%, orange 30% 100%)`,
                }}
              >
                <span className="flex items-center justify-center px-2">
                  <ShoppingCartIcon className="h-4 w-4" style={{ color: contrast }} />
                </span>
                <span className="px-3 py-1">20% Off in bulk</span>
              </span>
            )}
          </div>
        )}

        {/* Metrics for products and sponsored (not profile, not services) */}
        {!isService && mode !== 'profile' && (
          <div className="mt-auto border-t border-gray-100 pt-3 text-sm text-gray-600">
            <div className="mb-2 grid grid-cols-3 gap-2">
              <span>{item.metrics?.productViews ?? 0} Views</span>
              <span>{item.metrics?.productClicks ?? 0} Luxes</span>
              <span>{item.metrics?.messages ?? 0} Messages</span>
            </div>

            {/* Category + actions for 'product' mode */}
            {mode === 'product' && (
              <div className="mt-2 flex items-center justify-between">
                <span className="rounded-lg border px-2 py-1 text-gray-800">
                  {item.category || 'Uncategorized'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Edit"
                    onClick={() => onEdit(item.id)}
                    className="rounded p-1 hover:bg-gray-100"
                    title="Edit"
                  >
                    <PencilSquareIcon className="h-6 w-6 text-gray-700" />
                  </button>
                  <button
                    type="button"
                    aria-label="More options"
                    onClick={(e) => onMoreOptionsClick(e, item.id)}
                    className="rounded p-1 hover:bg-gray-100"
                    title="More options"
                  >
                    <EllipsisVerticalIcon className="h-6 w-6 text-gray-700" />
                  </button>
                </div>
              </div>
            )}

            {/* CTA for 'sponsored' mode */}
            {mode === 'sponsored' && (
              <Button
                className="mt-3 w-full rounded-lg py-2 font-semibold shadow-sm"
                style={{ backgroundColor: brandColor, color: contrast }}
                onClick={() => onViewDetailsClick(item.id)}
              >
                View Details
              </Button>
            )}
          </div>
        )}

        {/* Service-specific details */}
        {isService && (
          <div className="mt-auto w-full">
            <div className="mb-4 grid grid-cols-3 gap-3 text-sm text-gray-700">
              <div className="flex flex-col items-center rounded-lg bg-gray-50 p-2">
                <span className="text-xs text-gray-500">Views</span>
                <span className="font-semibold">{item.serviceViews ?? 0}</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-gray-50 p-2">
                <span className="text-xs text-gray-500">Clicks</span>
                <span className="font-semibold">{item.productClicks ?? 0}</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-gray-50 p-2">
                <span className="text-xs text-gray-500">Messages</span>
                <span className="font-semibold">{item.messages ?? 0}</span>
              </div>
            </div>

            <Button
              onClick={() => onViewStatsClick(item.id)}
              className="w-full rounded-lg py-2 font-semibold shadow-md transition-shadow hover:shadow-lg"
              style={{ backgroundColor: brandColor, color: contrast }}
            >
              Details
            </Button>
          </div>
        )}

        {/* Profile-specific footer (cart icon lives here) */}
        {mode === 'profile' && (
          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex items-center text-sm text-gray-500">
             <MapPinIcon className="h-6 w-6 " />
              <span>{item.location || 'Lagos, Nigeria'}</span>
            </div>

            <button
              type="button"
              onClick={handleAddToCartClick}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-50"
              aria-label="Add to cart"
              title="Add to cart"
              data-testid="add-to-cart-button"
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