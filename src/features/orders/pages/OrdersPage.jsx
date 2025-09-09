import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OrderListItem from '../../../components/order/OrderListItem';
import OrderDetailsPanel from '../../../components/order/OrderDetailsPanel';
import Button from '../../../components/ui/Button';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { useStoreProfile } from '../../../services/queries/storeProfileQuery';
import { useGetOrdersQuery } from '../../../services/queries/useOrderQuery';
import { useToast } from '../../../components/ui/ToastProvider';

const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { push } = useToast();

  // Extract userId from URL or fallback
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId') || 'default_user_id';
  const isLoggedIn = Boolean(userId);

  // Brand color
  const { data: storeProfile, isLoading: isProfileLoading, error: profileError } = useStoreProfile(userId, {
    enabled: isLoggedIn && !!userId,
  });
  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  // Tabs: New | Completed
  const [activeOrderTab, setActiveOrderTab] = useState('New');

  // Orders for current tab
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    error: ordersError,
  } = useGetOrdersQuery(activeOrderTab, userId, { enabled: isLoggedIn && !!userId });

  const ordersData = Array.isArray(ordersResponse?.orders) ? ordersResponse.orders : [];

  // Selection + mobile toggle
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showOrderList, setShowOrderList] = useState(true);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Toast errors
  useEffect(() => {
    if (profileError) push('Failed to load store profile.', { type: 'error' });
    if (ordersError) push('Failed to load orders.', { type: 'error' });
  }, [profileError, ordersError, push]);

  // Keep selection stable; auto-select when needed
  useEffect(() => {
    if (ordersData.length === 0) {
      setSelectedOrderId(null);
      setShowOrderDetails(false);
      setShowOrderList(true);
      return;
    }
    const exists = ordersData.some((o) => o.id === selectedOrderId);
    if (!exists) setSelectedOrderId(ordersData[0].id);
  }, [ordersData, selectedOrderId]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-gray-600">
        <p className="text-lg mb-4">Please log in to view your orders.</p>
        <Button
          onClick={() => navigate('/login')}
          style={{ backgroundColor: brandColor, color: contrastTextColor }}
          className="py-2 px-6 rounded-lg font-semibold"
        >
          Login Now
        </Button>
      </div>
    );
  }

  if (isProfileLoading || isOrdersLoading) {
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  }

  const handleOrderListItemClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowOrderList(false);
    setShowOrderDetails(true);
  };

  const handleBackToList = () => {
    setShowOrderDetails(false);
    setShowOrderList(true);
  };

  const selectedOrder = ordersData.find((order) => order.id === selectedOrderId) || null;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] lg:gap-8">
        {/* Tabs & List */}
        <div className={`lg:col-span-1 space-y-4 ${showOrderDetails ? 'hidden lg:block' : ''}`}>
          <div className="flex space-x-4 mb-6">
            {['New', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveOrderTab(tab)}
                className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-200 flex-1 ${
                  activeOrderTab === tab ? '' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={activeOrderTab === tab ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
                aria-pressed={activeOrderTab === tab}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          {ordersData.length === 0 ? (
            <div className="p-6 bg-white rounded-xl shadow-md text-center text-gray-500">
              No {activeOrderTab.toLowerCase()} orders found.
            </div>
          ) : (
            ordersData.map((order) => (
              <OrderListItem
                key={order.id || `order-${order.customerName}-${order.totalPrice}`}
                order={order}
                isActive={order.id === selectedOrderId}
                onClick={handleOrderListItemClick}
                brandColor={brandColor}
              />
            ))
          )}
        </div>

        {/* Details */}
        <div className={`lg:col-span-1 ${showOrderList ? 'hidden lg:block' : ''}`}>
          {selectedOrder ? (
            <OrderDetailsPanel
              customerOrder={selectedOrder}
              brandColor={brandColor}
              onBackToList={handleBackToList}
              fullOrderData={selectedOrder}
            />
          ) : (
            <div className="p-6 bg-white rounded-xl shadow-md flex items-center justify-center h-full text-gray-500">
              Select an order to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;