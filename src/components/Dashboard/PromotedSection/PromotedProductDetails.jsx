// src/features/products/pages/PromotedProductDetails.jsx
import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';
import { ShoppingCartIcon, FireIcon, PaperClipIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline';

const currency = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? `₦${v.toLocaleString()}` : n;
};

const PromotedProductDetails = ({
  product,
  brandColor = '#EF4444',
  contrastTextColor = '#FFFFFF',
  onExtend,
  onHide,
  onDelete,
  onAttachment,
}) => {
  const { push } = useToast();

  if (!product) {
    return <div className="text-center py-12 text-gray-600">Product details not found.</div>;
  }

  const displayPrice = product.discountPrice ?? product.price ?? 0;
  const originalPrice = product.discountPrice ? product.price : null;

  return (
    <div className="p-0">
      <Card className="p-4 md:p-6 rounded-xl shadow-lg w-full mx-auto mb-6">
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/600x400/e0e0e0/000000?text=No+Image';
            }}
          />
          {product.isSponsored && (
            <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-sm font-semibold px-3 py-1.5 rounded-md flex items-center">
              <FireIcon className="h-5 w-5 mr-1 text-orange-400" /> Sponsored
            </div>
          )}
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">{product.name}</h2>
        <div className="flex items-baseline mb-3">
          <span className="text-2xl md:text-3xl font-bold" style={{ color: brandColor }}>
            {currency(displayPrice)}
          </span>
          {Number.isFinite(originalPrice) && (
            <span className="text-base md:text-lg text-gray-500 line-through ml-2">{currency(originalPrice)}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          {product.hasFreeDelivery && (
            <span className="flex items-center rounded-full overflow-hidden shadow-sm">
              <span className="p-1 flex items-center justify-center" style={{ backgroundColor: brandColor }}>
                <ShoppingCartIcon className="h-4 w-3" style={{ color: contrastTextColor }} />
              </span>
              <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1">Free delivery</span>
            </span>
          )}
          {product.hasBulkDiscount && (
            <span className="flex items-center rounded-full overflow-hidden shadow-sm">
              <span className="p-1 flex items-center justify-center" style={{ backgroundColor: brandColor }}>
                <ShoppingCartIcon className="h-4 w-3" style={{ color: contrastTextColor }} />
              </span>
              <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1">20% Off in bulk</span>
            </span>
          )}
          {product.location && (
            <span className="text-sm text-gray-600 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {product.location}
            </span>
          )}
        </div>
      </Card>

      <Card className="p-4 md:p-6 rounded-xl shadow-lg w-full mx-auto mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Promotion Details</h3>
        <div className="space-y-3">
          {product.promotionDetails ? (
            Object.entries(product.promotionDetails).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, ' $1').trim();
              let display = value;
              if (key === 'costPerClick' || key === 'amountSpent') {
                const num = Number(value);
                display = Number.isFinite(num) ? `₦${num.toLocaleString()}` : value;
              }
              return (
                <div key={key} className="flex justify-between items-center rounded-2xl p-4 bg-gray-100">
                  <span className="text-gray-700 font-medium capitalize">{label}</span>
                  <span className={`font-semibold ${key === 'status' && value === 'Active' ? 'text-green-600' : 'text-gray-900'}`}>
                    {display}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-gray-600">No promotion details available.</div>
          )}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full mx-auto">
        <Button onClick={onAttachment} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-md" aria-label="Attachment" type="button">
          <PaperClipIcon className="h-6 w-6" />
        </Button>
        <Button onClick={onHide} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-md" aria-label="Hide Promotion" type="button">
          <EyeSlashIcon className="h-6 w-6" />
        </Button>
        <Button onClick={onDelete} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-md" aria-label="Delete Promotion" type="button">
          <TrashIcon className="h-6 w-6" />
        </Button>
        <Button
          onClick={onExtend}
          style={{ backgroundColor: brandColor, color: contrastTextColor }}
          className="flex-1 py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
          type="button"
        >
          Extend Promotion
        </Button>
      </div>
    </div>
  );
};

export default PromotedProductDetails;