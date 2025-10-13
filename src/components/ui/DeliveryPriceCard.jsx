import React from 'react';
import Button from '../ui/Button';

const DeliveryPriceCard = ({ data, onEdit, onDelete, brandColor }) => {
  // Safely access data to prevent errors if data is null/undefined.
  // This logic is kept to ensure the card displays correctly.
  const state = data?.state || 'N/A';
  const localGovernment = data?.localGovernment || 'N/A';
  const isFree = data?.markForFreeDelivery || false;
  const price = parseFloat(data?.deliveryFee || 0);

  const formattedPrice = isFree ? 'Free' : `₦${price.toLocaleString()}`;

  return (
    // ✅ UI REVERTED: The outer div and layout are restored to your original design.
    <div className="p-4 border border-gray-200 rounded-2xl bg-white shadow-sm relative">
      {isFree && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
          Free Delivery Active
        </div>
      )}

      {/* ✅ UI REVERTED: The content structure is restored. */}
      <div className="space-y-2 mb-4">
        <div>
          <p className="text-sm text-gray-500">State</p>
          <p className="text-base font-bold text-gray-800">{state}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Local Government</p>
          <p className="text-base font-bold text-gray-700">{localGovernment}</p>
        </div>

        <div>
          <p className="block text-sm text-gray-500">Price</p>
          <p className="text-lg font-bold text-gray-900">
            {formattedPrice}
          </p>
        </div>
      </div>

      {/* ✅ UI REVERTED: The button section and styles are restored. */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          onClick={onEdit}
          className="px-4 py-2 text-sm rounded-md bg-redd text-white hover:bg-red-700 shadow-sm transition-colors"
        >
          Edit
        </Button>
        <Button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 text-sm rounded-md border border-redd text-redd hover:bg-red-50 shadow-sm transition-colors"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeliveryPriceCard;