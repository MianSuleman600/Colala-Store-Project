import React from 'react';
import Button from '../ui/Button';

const OrderItemCard = ({ item, onTrackOrder, brandColor, contrastTextColor }) => {
  const handleTrackClick = () => {
    onTrackOrder(item);
  };

  return (
    <div className="flex items-start p-3 rounded-lg bg-gray-50 shadow-sm">
      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mr-3">
        {/* The API does not provide an image for items, so a placeholder is used. */}
        <span className="text-gray-400 text-center text-xs">No Image</span>
      </div>
      <div className="flex-grow">
        <p className="text-base font-medium text-gray-800">{item.name}</p>
        <p className="text-sm font-bold mt-1" style={{ color: brandColor }}>
          N{parseFloat(item.unit_price || 0).toLocaleString()}
        </p>
        <div className="flex items-center gap-6 mt-1">
          <p className="text-xs text-gray-500">Qty: {item.qty}</p>
          {item.color && (
            <div className="flex items-center text-xs text-gray-500">
              Color:
              <span className="w-5 h-5 rounded-full ml-1" style={{ backgroundColor: item.color }} />
            </div>
          )}
          {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
        </div>
      </div>
      <Button
        onClick={handleTrackClick}
        className="ml-4 py-2 px-4 rounded-xl text-sm font-medium self-center"
        style={{ backgroundColor: brandColor, color: contrastTextColor }}
      >
        Track Order
      </Button>
    </div>
  );
};

export default OrderItemCard;