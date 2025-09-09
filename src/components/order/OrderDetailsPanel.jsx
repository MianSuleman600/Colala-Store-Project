import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import OrderItemCard from './OrderItemCard';
import OrderTrackerPanel from './OrderTrackerPanel';
import { getContrastTextColor } from '../../utils/colorUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';

const OrderDetailsPanel = ({ customerOrder, brandColor, onBackToList, fullOrderData }) => {
  const navigate = useNavigate();
  const { push } = useToast();
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  const [activeStatusTab, setActiveStatusTab] = useState('Order placed');
  const [showTracker, setShowTracker] = useState(false);
  const [itemToTrack, setItemToTrack] = useState(null);

  const handleTrackOrder = (item) => {
    setItemToTrack(item);
    setShowTracker(true);
  };

  const handleOpenChat = () => {
    if (customerOrder?.conversationId) {
      navigate(`/chat/${customerOrder.conversationId}`);
    } else {
      push('This order does not have an associated chat.', { type: 'error' });
    }
  };

  const handleBackToOrderDetails = () => {
    setShowTracker(false);
    setItemToTrack(null);
  };

  if (!customerOrder) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md flex items-center justify-center h-full text-gray-500">
        Select an order to view details.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile Back Button — show only when NOT showing tracker to avoid double header */}
      {!showTracker && (
        <div className="flex items-center gap-2 lg:hidden mb-2">
          <button
            onClick={onBackToList}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            aria-label="Back"
            type="button"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">{customerOrder.customerName}</h2>
        </div>
      )}

      {showTracker && itemToTrack ? (
        <OrderTrackerPanel
          customerName={customerOrder.customerName}
          itemToTrack={itemToTrack}
          onOpenChat={handleOpenChat}
          onBackToOrderDetails={handleBackToOrderDetails}
          brandColor={brandColor}
          fullOrderData={fullOrderData}
        />
      ) : (
        <>
          {/* Status Tabs */}
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 no-scrollbar">
            {['Order placed', 'Out for delivery', 'Delivered', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                className={`py-2 px-4 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors duration-200 flex-shrink-0 ${
                  activeStatusTab === tab ? 'shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={activeStatusTab === tab ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                aria-pressed={activeStatusTab === tab}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Items in Cart */}
          <Card className="p-4 rounded-xl shadow-md">
            <h3 className="text-lg text-white mb-4 p-4 rounded-2xl" style={{ backgroundColor: brandColor }}>
              Items in cart
            </h3>
            <div className="space-y-4">
              {customerOrder.items?.length > 0 ? (
                customerOrder.items.map((item) => (
                  <OrderItemCard
                    key={item.id || `${item.name}-${item.price}`}
                    item={item}
                    onTrackOrder={handleTrackOrder}
                    brandColor={brandColor}
                    contrastTextColor={contrastTextColor}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">No items found for this order.</p>
              )}
            </div>
          </Card>

          {/* Open Chat */}
          <Button
            onClick={handleOpenChat}
            className="w-full py-3 px-6 rounded-xl font-semibold text-lg"
            style={{
              backgroundColor: 'white',
              color: brandColor,
              border: `1px solid ${brandColor}`,
            }}
          >
            Open Chat
          </Button>
        </>
      )}
    </div>
  );
};

export default OrderDetailsPanel;