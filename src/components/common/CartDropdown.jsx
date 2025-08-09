// src/components/cart/CartDropdown.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { removeItem } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

// ----- Selectors (defined outside to avoid re-creation) -----
const selectCartItems = (state) => state.cart.items;

const selectTotalCost = createSelector([selectCartItems], (items) => {
  if (!Array.isArray(items)) {
    console.error("Cart items is not an array. Returning 0 for total cost.");
    return 0;
  }
  return items.reduce((total, item) => {
    const price = parseFloat(item.currentPrice);
    const quantity = parseFloat(item.quantity);

    if (!isNaN(price) && !isNaN(quantity)) {
      return total + price * quantity;
    }
    return total;
  }, 0);
});

// ----- Component -----
export default function CartDropdown({ onClose, brandColor, contrastTextColor }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const totalCost = useSelector(selectTotalCost);

  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };

  const handleCheckout = () => {
    onClose?.(); // close dropdown
    navigate("/checkout");
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return "₦0";
    }
    const formattedPrice = price.toLocaleString("en-NG", {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formattedPrice;
  };

  return (
    <div
      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-slideDown"
      role="dialog"
      aria-label="Shopping cart"
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Close cart"
        >
          <XMarkIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        {cartItems.length === 0 ? (
          <p className="p-4 text-center text-gray-500">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                )}
                <div>
                  <h3 className="font-medium text-gray-800 line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × {formatPrice(item.currentPrice)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:text-red-700 ml-2"
                aria-label={`Remove ${item.name} from cart`}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Total & Checkout */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <span className="text-lg font-bold" style={{ color: brandColor }}>
              {formatPrice(totalCost)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="block w-full px-4 py-2 font-semibold rounded-2xl transition"
            style={{
              backgroundColor: brandColor,
              color: contrastTextColor,
            }}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}