import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import OrderItemCard from './OrderItemCard';
import OrderTrackerPanel from './OrderTrackerPanel';
import { getContrastTextColor } from '../../utils/colorUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';
import { useSelector } from 'react-redux'; // Import useSelector

const OrderDetailsPanel = ({ customerOrder, brandColor, onBackToList }) => {
  const navigate = useNavigate();
  const { push } = useToast();
  // Get the logged-in user's ID for mutations
  const userId = useSelector(state => state.auth.user?.id);
  
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  // The status tabs are purely for UI and don't need to fetch data.
  // We can derive the active tab from the order's actual status.
  const activeStatusTab = useMemo(() => {
    const status = (customerOrder?.status || '').toLowerCase();
    if (status === 'delivered' || status === 'completed') return 'Completed';
    if (status === 'out_for_delivery') return 'Out for delivery';
    return 'Order placed';
  }, [customerOrder?.status]);

  const [showTracker, setShowTracker] = useState(false);
  const [itemToTrack, setItemToTrack] = useState(null);

  const handleTrackOrder = (item) => {
    setItemToTrack(item);
    setShowTracker(true);
  };

  const handleOpenChat = () => {
    // ✅ FIX: The backend provides the chat object directly.
    if (customerOrder?.chat?.id) {
      navigate(`/chat/${customerOrder.chat.id}`);
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

  // ✅ FIX: Extract customer name from the nested user object provided by the backend.
  const customerName = customerOrder.order?.user?.full_name || 'Customer';

  return (
    <div className="space-y-6">
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
          <h2 className="text-lg font-semibold text-gray-800">{customerName}</h2>
        </div>
      )}

      {showTracker && itemToTrack ? (
        <OrderTrackerPanel
          customerName={customerName}
          itemToTrack={itemToTrack}
          onOpenChat={handleOpenChat}
          onBackToOrderDetails={handleBackToOrderDetails}
          brandColor={brandColor}
          fullOrderData={customerOrder} // Pass the complete order object
          userId={userId} // Pass userId for mutation hooks
        />
      ) : (
        <>
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 no-scrollbar">
            {['Order placed', 'Out for delivery', 'Completed'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors duration-200 flex-shrink-0 ${
                  activeStatusTab === tab ? 'shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={activeStatusTab === tab ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                aria-pressed={activeStatusTab === tab}
                type="button"
                disabled // Tabs are for display, not interaction
              >
                {tab}
              </button>
            ))}
          </div>

          <Card className="p-4 rounded-xl shadow-md">
            <h3 className="text-lg text-white mb-4 p-4 rounded-2xl" style={{ backgroundColor: brandColor }}>
              Items in Order
            </h3>
            <div className="space-y-4">
              {customerOrder.items?.length > 0 ? (
                customerOrder.items.map((item) => (
                  <OrderItemCard
                    key={item.id}
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