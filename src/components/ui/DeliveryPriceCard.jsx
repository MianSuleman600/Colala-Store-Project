import React from 'react';
import Button from '../ui/Button';

/**
 * DeliveryPriceCard Component
 * Displays delivery price details for a specific zone.
 *
 * @param {object} props
 * @param {object} props.data - The delivery price data for this card.
 * @param {function} props.onEdit - Function to call when edit button is clicked.
 * @param {function} props.onDelete - Function to call when delete button is clicked.
 */
const DeliveryPriceCard = ({ data, onEdit, onDelete }) => {
  // Safely access delivery fee
  const formattedDeliveryFee = parseFloat(data?.deliveryFee || 0).toLocaleString();

  return (
    <div className="p-4 border border-gray-200 rounded-2xl bg-white shadow-sm relative ">
      {data?.markForFreeDelivery && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
          Free Delivery Active
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div>
          <p className="text-sm text-gray-500">State</p>
          <p className="text-base font-bold text-gray-800">{data?.state || 'N/A'}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Local Government</p>
          <p className="text-base font-bold text-gray-700">{data?.localGovernment || 'N/A'}</p>
        </div>

        <div>
          <p className="block text-sm text-gray-500">Price</p>
          <p className="text-lg font-bold text-gray-900">
            {data?.markForFreeDelivery ? 'Free' : `₦${formattedDeliveryFee}`}
          </p>
        </div>
      </div>

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
