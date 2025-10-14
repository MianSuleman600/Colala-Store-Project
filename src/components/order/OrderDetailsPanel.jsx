import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import OrderItemCard from './OrderItemCard';
import OrderTrackerPanel from './OrderTrackerPanel';
import { getContrastTextColor } from '../../utils/colorUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';
import { useSelector } from 'react-redux';

const OrderDetailsPanel = ({ customerOrder, brandColor, onBackToList }) => {
  const navigate = useNavigate();
  const { push } = useToast();
  const userId = useSelector(state => state.auth.user?.id);
  
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  // ✅ FIX: Define the four interactive tabs as requested by the design.
  const TABS = ['Order placed', 'Out for delivery', 'Delivered', 'Completed'];

  // ✅ FIX: Add state to manage which tab is currently selected by the user.
  const [activeStatusTab, setActiveStatusTab] = useState('Order placed');

  const [showTracker, setShowTracker] = useState(false);
  const [itemToTrack, setItemToTrack] = useState(null);

  const handleTrackOrder = (item) => {
    setItemToTrack(item);
    setShowTracker(true);
  };

  const handleOpenChat = () => {
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
  
  // ✅ FIX: This function checks if the order's actual status matches the selected tab.
  const shouldDisplayItemsForCurrentTab = useMemo(() => {
    const orderStatus = (customerOrder?.status || '').toLowerCase();
    const tab = activeStatusTab.toLowerCase();

    if (tab === 'order placed') {
      // Show for any initial status that isn't one of the later stages.
      return !['out_for_delivery', 'delivered', 'completed'].includes(orderStatus);
    }
    if (tab === 'out for delivery') {
      return orderStatus === 'out_for_delivery';
    }
    if (tab === 'delivered') {
      return orderStatus === 'delivered';
    }
    if (tab === 'completed') {
      return orderStatus === 'completed';
    }
    return false;
  }, [activeStatusTab, customerOrder?.status]);


  if (!customerOrder) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md flex items-center justify-center h-full text-gray-500">
        Select an order to view details.
      </div>
    );
  }

  const displayName = customerOrder?.store?.store_name || customerOrder?.order?.order_no || `Order #${customerOrder?.id}`;

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
          <h2 className="text-lg font-semibold text-gray-800">{displayName}</h2>
        </div>
      )}

      {showTracker && itemToTrack ? (
        <OrderTrackerPanel
          customerName={displayName}
          itemToTrack={itemToTrack}
          onOpenChat={handleOpenChat}
          onBackToOrderDetails={handleBackToOrderDetails}
          brandColor={brandColor}
          fullOrderData={customerOrder}
          userId={userId}
        />
      ) : (
        <>
          <h2 className="hidden lg:block text-2xl font-bold text-gray-800">{displayName}</h2>
          
          {/* ✅ FIX: Tabs are now interactive, using the new state and tab array. */}
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)} // Set the active tab on click
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

          <Card className="p-4 rounded-xl shadow-md">
            <h3 className="text-lg text-white mb-4 p-4 rounded-2xl" style={{ backgroundColor: brandColor }}>
              Items in Order
            </h3>
            <div className="space-y-4">
              {/* ✅ FIX: Conditionally render items based on the selected tab and order status. */}
              {shouldDisplayItemsForCurrentTab && customerOrder.items?.length > 0 ? (
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
                <p className="text-sm text-center py-4 text-gray-500">
                  No items found for the "{activeStatusTab}" status.
                </p>
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