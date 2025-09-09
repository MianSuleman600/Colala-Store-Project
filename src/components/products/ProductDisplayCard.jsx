import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { PencilSquareIcon, EllipsisVerticalIcon, ShoppingCartIcon, FireIcon } from '@heroicons/react/24/outline';

const ProductDisplayCard = ({
  product = {},
  brandColor = '#EF4444',
  contrastTextColor = '#FFFFFF',
  lightBrandColor = '#FCA5A5',
  onEdit = () => {},
  onMoreOptionsClick = () => {},
  mode = 'default',
  onViewDetailsClick = () => {},
}) => {
  const displayPrice = product.discountPrice ?? product.currentPrice ?? 0;
  const originalPrice = product.discountPrice ? (product.currentPrice ?? 0) : null;
  const productViews = product?.metrics?.productViews ?? 0;
  const productClicks = product?.metrics?.productClicks ?? 0;
  const messages = product?.metrics?.messages ?? 0;
  const category = product.category ?? 'Category';
  const isOutOfStock = product.status === 'Sold Out' || product.status === 'Unavailable';

  const handleViewDetails = () => onViewDetailsClick(product);

  return (
    <Card className="relative flex flex-col p-4 rounded-xl shadow-lg w-full max-w-sm mx-auto">
      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center rounded-xl z-20">
          <span className="text-white text-2xl font-bold uppercase tracking-wide">Out of Stock</span>
        </div>
      )}

      <div className={`relative ${isOutOfStock ? 'pointer-events-none' : ''}`}>
        {/* Image & Sponsored Tag */}
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name || 'Product'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/default-profile.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image Available</div>
          )}
          {(mode === 'default' || mode === 'promoted') && product.isSponsored && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center">
              <FireIcon className="h-4 w-4 mr-1 text-orange-400" /> Sponsored
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name || 'Unnamed Product'}</h3>

        {/* Price Info */}
        <div className="flex items-baseline mb-3">
          <span className="text-2xl font-bold" style={{ color: brandColor }}>
            N{displayPrice.toLocaleString()}
          </span>
          {originalPrice !== null && (
            <span className="text-base text-gray-500 line-through ml-2">N{originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Delivery/Discount Tags */}
        {(mode === 'default' || mode === 'promoted') && (
          <div className="flex  flex-wrap gap-2 mb-4">
            {product.hasFreeDelivery && (
              <span className="flex  items-center bg-orange-500 rounded-full overflow-hidden shadow-sm">
                <span
                  className="flex items-center justify-center px-2 py-1"
                  style={{ backgroundColor: brandColor, color: contrastTextColor, transform: 'skewX(-15deg)' }}
                >
                  <ShoppingCartIcon className="h-4 w-4" style={{ transform: 'skewX(15deg)' }} />
                </span>
                <span className="bg-orange-500 text-white text-xs px-2 py-1">Free delivery</span>
              </span>
            )}
            {product.hasBulkDiscount && (
              <span className="flex items-center bg-orange-500 rounded-full overflow-hidden shadow-sm">
                <span
                  className="flex items-center justify-center px-2 py-1"
                  style={{ backgroundColor: brandColor, color: contrastTextColor, transform: 'skewX(-20deg)' }}
                >
                  <ShoppingCartIcon className="h-4 w-4" style={{ transform: 'skewX(20deg)' }} />
                </span>
                <span className="bg-orange-500 text-white text-xs px-2 py-1">20% Off in bulk</span>
              </span>
            )}
          </div>
        )}

        {/* Product Statistics */}
        {(mode === 'default' || mode === 'promoted') && (
          <div className="flex  gap-2 flex-col mb-4 text-sm text-gray-700">
            <div className="flex justify-between items-center">
              <span>Product Views</span>
              <span className="font-semibold">{productViews}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Product Clicks</span>
              <span className="font-semibold">{productClicks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Messages</span>
              <span className="font-semibold">{messages}</span>
            </div>
          </div>
        )}

        {/* Category & Actions */}
        <div className="flex flex-col items-center justify-between mt-auto pt-4 border-t border-gray-100">
         

          {mode === 'default' ? (
            <div className="flex  space-x-2">
              <Button
                onClick={() => onEdit(product.id)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                aria-label="Edit Product"
                disabled={isOutOfStock}
              >
                <PencilSquareIcon className="h-5 w-5" />
              </Button>
              <Button
                onClick={(e) => onMoreOptionsClick(e, product.id)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                aria-label="More Options"
                disabled={isOutOfStock}
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleViewDetails}
              className="px-4 py-2 w-full rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
              style={{ backgroundColor: brandColor, color: contrastTextColor }}
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductDisplayCard;