import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const OrderItemCard = ({ item, onTrackOrder, brandColor, contrastTextColor }) => {
  return (
    <Card className="flex flex-col sm:flex-row sm:items-center p-4 rounded-xl shadow-sm border border-gray-200 bg-white">
      <div className="w-full sm:w-20 h-40 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mb-4 sm:mb-0 sm:mr-4">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/80x80/e0e0e0/000000?text=No+Image';
            }}
          />
        ) : (
          <span className="text-gray-400 text-center text-xs">No Image</span>
        )}
      </div>

      <div className="flex-grow text-center sm:text-left mb-4 sm:mb-0">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-base font-bold mt-1" style={{ color: brandColor }}>
          N{item.price?.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
      </div>

      <div className="w-full sm:w-auto flex-shrink-0 sm:ml-4">
        <Button
          onClick={() => onTrackOrder(item)}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium"
          style={{ backgroundColor: brandColor, color: contrastTextColor }}
        >
          Track Order
        </Button>
      </div>
    </Card>
  );
};

export default OrderItemCard;