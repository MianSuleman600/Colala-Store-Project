// src/pages/CheckoutPage.jsx
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getContrastTextColor } from "../../utils/colorUtils";
import { useGetStoreProfileQuery } from "../../services/storeProfileApi";
import { selectCartItemsByUser } from "../../features/cart/cartSlice";

// ----- Selector factory for per-user total cost -----
const makeSelectTotalCostByUser = (userId) =>
  createSelector([selectCartItemsByUser(userId)], (items) =>
    Array.isArray(items)
      ? items.reduce((total, item) => total + (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0), 0)
      : 0
  );

// ----- Price formatting utility -----
const formatPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) return "₦0";
  return price.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export default function CheckoutPage({ userId = "default_user_id" }) {
  const navigate = useNavigate();

  // Memoized selector
  const totalCostSelector = useMemo(() => makeSelectTotalCostByUser(userId), [userId]);

  // Per-user cart
  const cartItems = useSelector(selectCartItemsByUser(userId));
  const totalCost = useSelector(totalCostSelector);

  // Fetch store profile for dynamic branding
  const { data: storeProfile, error, isLoading } = useGetStoreProfileQuery(userId);

  if (isLoading) return <div className="p-8 text-center text-gray-600">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;

  const brandColor = storeProfile?.brandColor || "#EF4444";
  const contrastTextColor = getContrastTextColor(brandColor);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // TODO: Validate form, process payment, clear cart, navigate to confirmation
    console.log("Placing order for user:", userId);
    // navigate("/order-confirmation");
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/" className="hover:text-gray-800 transition" style={{ color: brandColor }}>
            <ArrowLeftIcon className="h-5 w-5 inline-block mr-2" />
            Back to shopping
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h2>

        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-xl mb-4">Your cart is empty.</p>
            <Link to="/" className="hover:underline" style={{ color: brandColor }}>
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-md mb-6 lg:mb-0">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span style={{ color: brandColor }}>{formatPrice(totalCost)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <form onSubmit={handlePlaceOrder}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                      ZIP
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <h2 className="text-xl font-semibold mt-8 mb-4">Payment Information</h2>
                <div className="bg-gray-100 p-4 rounded-md text-gray-500">
                  <p>Payment form integration (e.g., Stripe, PayPal) would go here.</p>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 font-semibold rounded-md transition"
                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
