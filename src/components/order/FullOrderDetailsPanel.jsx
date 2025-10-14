import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const FullOrderDetailsPanel = ({ order, brandColor, contrastTextColor, onBackToTracker }) => {
  if (!order) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md flex items-center justify-center h-full text-gray-500">
        No order details available.
      </div>
    );
  }

  // ✅ FIX: Using the correct order ID from the nested object.
  const formattedOrderId = `ORD-${String(order.order?.id || '').slice(0, 7).toUpperCase()}`;
  
  // ✅ FIX: Accessing nested delivery and user details with optional chaining for safety.
  const deliveryInfo = order.order?.delivery_address;
  const paymentMethod = order.payment_method || 'Not specified';
  const customerInfo = order.order?.user;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 rounded-xl shadow-md" style={{ backgroundColor: brandColor }}>
            <h3 className="text-lg text-white mb-4 p-4 rounded-2xl">{formattedOrderId}</h3>

            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center p-3 rounded-lg bg-white shadow-sm">
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mr-3">
                    {/* ✅ FIX: Accessing product image from item.product */}
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://placehold.co/64x64/e0e0e0/000000?text=No+Image';
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-center text-xs">No Image</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    {/* ✅ FIX: Accessing product name from item.product */}
                    <p className="text-base font-medium text-gray-800">{item.product?.name || 'Product Name'}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: brandColor }}>
                      N{item.price?.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-6 mt-1">
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      {item.color && (
                        <div className="flex items-center text-xs text-gray-500">
                          Color:
                          <span className="w-5 h-5 rounded-full ml-1" style={{ backgroundColor: item.color }} />
                        </div>
                      )}
                      {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Delivery Address */}
          <Card className="p-4 rounded-xl bg-white">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-gray-800">Delivery Address</h4>
              <span className="text-xs text-red-500">Delivery fee/Location</span>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-400">Phone number</p>
                {/* ✅ FIX: Accessing nested phone number */}
                <p className="text-sm text-gray-800 font-medium">{deliveryInfo?.phone_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Address</p>
                {/* ✅ FIX: Accessing nested address */}
                <p className="text-sm text-gray-800 font-medium">{deliveryInfo?.address || 'N/A'}</p>
              </div>
            </div>
          </Card>

          {/* Price Breakdown */}
          <Card className="p-4 rounded-xl shadow-md bg-white">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              {/* ✅ FIX: Using snake_case for API consistency */}
              <div>Items Cost</div>
              <div className="text-right font-semibold">N{(order.items_cost || 0).toLocaleString()}</div>

              <div>Coupon Discount</div>
              <div className="text-right font-semibold" style={{ color: brandColor }}>
                -N{(order.coupon_discount || 0).toLocaleString()}
              </div>

              <div>Points Discount</div>
              <div className="text-right font-semibold" style={{ color: brandColor }}>
                -N{(order.points_discount || 0).toLocaleString()}
              </div>

              <div>Delivery Fee</div>
              <div className="text-right font-semibold">N{(order.delivery_fee || 0).toLocaleString()}</div>

              <div className="text-lg font-bold">Total</div>
              <div className="text-right text-lg font-bold" style={{ color: brandColor }}>
                N{(order.total_price || 0).toLocaleString()}
              </div>
            </div>
          </Card>

          {/* Review Buttons */}
          <div className="flex space-x-4 mt-6">
            <Button className="flex-1 py-3 px-6 rounded-xl font-semibold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
              View Product Review
            </Button>
            <Button className="flex-1 py-3 px-6 rounded-xl font-semibold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
              View Store Review
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 rounded-xl shadow-md bg-white">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>Tracking ID</div>
              <div className="text-right font-semibold">{formattedOrderId}</div>

              <div>Total Items</div>
              {/* ✅ FIX: Calculating item count dynamically */}
              <div className="text-right font-semibold">{order.items?.length || 0}</div>

              <div>Payment Method</div>
              <div className="text-right font-semibold">{paymentMethod}</div>

              <div>Total</div>
              <div className="text-right font-semibold" style={{ color: brandColor }}>
                N{(order.total_price || 0).toLocaleString()}
              </div>
            </div>
          </Card>

          <div className="mt-8">
            <Button
              onClick={onBackToTracker}
              className="w-full py-3 px-6 rounded-xl font-semibold text-lg"
              style={{
                backgroundColor: 'white',
                color: brandColor,
                border: `1px solid ${brandColor}`,
              }}
            >
              Go Back to Tracker
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullOrderDetailsPanel;
