import React from 'react';
import Card from '../ui/Card';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const OrderListItem = ({ order, isActive, onClick, brandColor }) => {
  const handleClick = () => {
    if (order?.id) onClick(order.id);
  };

  return (
    <Card
      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive ? 'border-2' : 'border border-gray-200 hover:shadow-md'
      }`}
      style={isActive ? { borderColor: brandColor, backgroundColor: '#FEE2E2' } : {}}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? handleClick() : null)}
      aria-pressed={isActive}
    >
      <div
        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4"
        style={{ backgroundColor: isActive ? brandColor : '#FEE2E2' }}
      >
        <ShoppingCartIcon className="h-6 w-6" style={{ color: isActive ? '#ffffff' : brandColor }} />
      </div>

      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{order?.customerName || 'Unknown Customer'}</h3>
        <p className="text-sm text-gray-500">{order?.itemCount ?? 0} items</p>
      </div>

      <div className="flex-shrink-0 text-right">
        <span className="text-lg font-bold" style={{ color: brandColor }}>
          N{order?.totalPrice?.toLocaleString() ?? '0'}
        </span>
      </div>
    </Card>
  );
};

export default OrderListItem;