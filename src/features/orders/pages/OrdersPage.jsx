import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import OrderListItem from "../../../components/order/OrderListItem";
import OrderDetailsPanel from "../../../components/order/OrderDetailsPanel";
import Button from "../../../components/ui/Button";
import { getContrastTextColor } from "../../../utils/colorUtils";
import {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
} from "../../../services/queries/useOrderQuery";
import { useToast } from "../../../components/ui/ToastProvider";
const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { push } = useToast();

  // ✅ STEP 1: All hook calls are now at the top level.
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userId = user?.id;

  // Get selectedOrderId from navigation state
  const initialSelectedOrderId = location.state?.selectedOrderId || null;

  const [activeOrderTab, setActiveOrderTab] = useState("New");
  const [selectedOrderId, setSelectedOrderId] = useState(initialSelectedOrderId);
  const [showOrderDetails, setShowOrderDetails] = useState(false); // For mobile view

  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    error: ordersError,
  } = useGetOrdersQuery(userId, { enabled: isAuthenticated && !!userId });

  // Fetch detailed order data when an order is selected
  const {
    data: selectedOrderDetails,
    isLoading: isSelectedOrderLoading,
    error: selectedOrderError,
  } = useGetOrderByIdQuery(selectedOrderId, userId, {
    enabled: isAuthenticated && !!userId && !!selectedOrderId,
  });

  const brandColor = useMemo(
    () => user?.store?.theme_color || "#EF4444",
    [user]
  );
  const contrastTextColor = useMemo(
    () => getContrastTextColor(brandColor),
    [brandColor]
  );

  const ordersData = useMemo(() => {
    if (!ordersResponse) return [];
    return activeOrderTab === "New"
      ? ordersResponse.new
      : ordersResponse.completed;
  }, [ordersResponse, activeOrderTab]);

  // Use detailed order data if available, otherwise fall back to basic order data
  const selectedOrder = useMemo(() => {
    if (selectedOrderDetails) {
      return selectedOrderDetails;
    }
    if (!ordersResponse || !selectedOrderId) return null;
    return [
      ...(ordersResponse.new || []),
      ...(ordersResponse.completed || []),
    ].find((order) => order.id === selectedOrderId);
  }, [selectedOrderDetails, ordersResponse, selectedOrderId]);

  // --- Effects ---
  useEffect(() => {
    if (ordersError) push("Failed to load orders.", { type: "error" });
  }, [ordersError, push]);

  // Clear navigation state after component mounts
  useEffect(() => {
    if (location.state?.selectedOrderId) {
      // Replace the current location to remove the state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state?.selectedOrderId, navigate, location.pathname]);

  useEffect(() => {
    if (selectedOrderError)
      push("Failed to load order details.", { type: "error" });
  }, [selectedOrderError, push]);

  useEffect(() => {
    if (
      ordersData.length > 0 &&
      !ordersData.some((o) => o.id === selectedOrderId)
    ) {
      setSelectedOrderId(ordersData[0].id);
    } else if (ordersData.length === 0) {
      setSelectedOrderId(null);
    }
  }, [ordersData, selectedOrderId]);

  // --- Handlers ---
  const handleOrderListItemClick = (orderId) => {
    setSelectedOrderId(orderId);
    if (window.innerWidth < 1024) {
      setShowOrderDetails(true);
    }
  };

  const handleBackToList = () => {
    setShowOrderDetails(false);
  };

  // ✅ STEP 2: Conditional returns are now AFTER all hooks have been called.
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-gray-600">
        <p className="text-lg mb-4">Please log in to view your orders.</p>
        <Button
          onClick={() => navigate("/login")} // Assuming you want to navigate, or use dispatch(openModal('login'))
          style={{ backgroundColor: brandColor, color: contrastTextColor }}
          className="py-2 px-6 rounded-lg font-semibold"
        >
          Login Now
        </Button>
      </div>
    );
  }

  if (isOrdersLoading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Loading your orders...
      </div>
    );
  }

  // ✅ STEP 3: The main render logic is at the end.
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] lg:gap-8">
        {/* Left Panel: Tabs & List */}
        <div
          className={`lg:col-span-1 space-y-4 ${
            showOrderDetails ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex space-x-4 mb-6">
            {["New", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveOrderTab(tab)}
                className={`py-2 px-6 rounded-lg font-semibold transition-colors duration-200 flex-1 ${
                  activeOrderTab === tab
                    ? ""
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                style={
                  activeOrderTab === tab
                    ? { backgroundColor: brandColor, color: contrastTextColor }
                    : {}
                }
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
                key={order.id}
                order={order}
                isActive={order.id === selectedOrderId}
                onClick={() => handleOrderListItemClick(order.id)}
                brandColor={brandColor}
              />
            ))
          )}
        </div>

        {/* Right Panel: Details */}
        <div
          className={`lg:col-span-1 ${
            !showOrderDetails && window.innerWidth < 1024 ? "hidden" : "block"
          } lg:block`}
        >
          {isSelectedOrderLoading ? (
            <div className="p-6 bg-white rounded-xl shadow-md flex items-center justify-center h-full">
              <div className="text-center">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
                  style={{ borderColor: brandColor }}
                ></div>
                <p className="text-gray-600">Loading order details...</p>
              </div>
            </div>
          ) : selectedOrder ? (
            <OrderDetailsPanel
              customerOrder={selectedOrder}
              brandColor={brandColor}
              onBackToList={handleBackToList}
              fullOrderData={selectedOrder}
            />
          ) : (
            <div className="p-6 bg-white rounded-xl shadow-md flex items-center justify-center h-full text-gray-500">
              {ordersData.length > 0
                ? "Select an order to view details."
                : "No orders to display."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
