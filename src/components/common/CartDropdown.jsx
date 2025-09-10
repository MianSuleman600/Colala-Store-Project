import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import {
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  selectCartItemsByUser,
} from '../../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

// ----- Selector factory for total cost -----
const makeSelectTotalCostByUser = (userId) =>
  createSelector([selectCartItemsByUser(userId)], (items) =>
    Array.isArray(items)
      ? items.reduce(
          (total, item) =>
            total +
            (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0),
          0
        )
      : 0
  );

// ----- Price formatting utility -----
const formatPrice = (price) => {
  const n = typeof price === 'number' ? price : parseFloat(price);
  if (isNaN(n)) return '₦0';
  return n.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export default function CartDropdown({
  onClose,
  brandColor = '#EF4444',
  contrastTextColor = '#FFFFFF',
  userId,
  onSelect, // OPTIONAL: if provided, enables selection mode and "Send items"
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userKey = userId ?? 'guest';

  const selectionEnabled = typeof onSelect === 'function';

  // Memoize selectors per user
  const itemsSelector = useMemo(() => selectCartItemsByUser(userKey), [userKey]);
  const totalCostSelector = useMemo(
    () => makeSelectTotalCostByUser(userKey),
    [userKey]
  );

  const cartItems = useSelector(itemsSelector);
  const totalCost = useSelector(totalCostSelector);

  const handleRemove = (itemId) => dispatch(removeItem({ itemId, userId: userKey }));
  const handleIncrease = (itemId) => dispatch(increaseQuantity({ itemId, userId: userKey }));
  const handleDecrease = (itemId) => dispatch(decreaseQuantity({ itemId, userId: userKey }));

  const handleCheckout = () => {
    onClose?.();
    navigate('/checkout');
  };

  // Selection state for picker mode (chat)
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  // Reset selection when user or items change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [userKey]);

  const toggleSelect = (id) => {
    if (!selectionEnabled) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = useMemo(() => {
    const count = Array.isArray(cartItems) ? cartItems.length : 0;
    return selectionEnabled && count > 0 && selectedIds.size === count;
  }, [cartItems, selectedIds, selectionEnabled]);

  const toggleSelectAll = () => {
    if (!selectionEnabled || !Array.isArray(cartItems)) return;
    setSelectedIds((prev) => {
      if (prev.size === cartItems.length) return new Set();
      return new Set(cartItems.map((i) => i.id));
    });
  };

  const selectedItems = useMemo(
    () =>
      selectionEnabled && Array.isArray(cartItems)
        ? cartItems.filter((i) => selectedIds.has(i.id))
        : [],
    [cartItems, selectedIds, selectionEnabled]
  );

  const selectedTotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, i) => sum + (parseFloat(i.price) || 0) * (parseFloat(i.quantity) || 0),
        0
      ),
    [selectedItems]
  );

  const handleSendSelected = () => {
    if (!selectionEnabled) return;
    const payload = selectedItems.map((i) => ({
      id: i.id,
      name: i.name,
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
      image: i.image || '',
    }));
    onSelect?.(payload);
    onClose?.();
  };

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Desktop dropdown
  const DesktopPanel = (
    <div
      id="cart-dropdown"
      className="hidden sm:block w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-slideDown"
      role="dialog"
      aria-label="Shopping cart"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
        <div className="flex items-center gap-3">
          {selectionEnabled && (
            <button
              onClick={toggleSelectAll}
              className="text-xs text-gray-600 hover:underline"
              aria-label={allSelected ? 'Clear selection' : 'Select all'}
            >
              {allSelected ? 'Clear selection' : 'Select all'}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close cart"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {(!cartItems || cartItems.length === 0) ? (
          <p className="p-4 text-center text-gray-500">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => {
            const selected = selectionEnabled ? selectedIds.has(item.id) : false;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 transition ${
                  selected ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {selectionEnabled && (
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-red-500 border-gray-300 rounded"
                      checked={selected}
                      onChange={() => toggleSelect(item.id)}
                      aria-label={selected ? `Deselect ${item.name}` : `Select ${item.name}`}
                    />
                  )}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://placehold.co/48x48/eee/999?text=Img';
                      }}
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-800 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 mt-1">
                      <button
                        onClick={() => handleDecrease(item.id)}
                        className="px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        aria-label={`Decrease quantity of ${item.name}`}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrease(item.id)}
                        className="px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {formatPrice((parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0))}
                  </span>
                  {!selectionEnabled && (
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {cartItems && cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          {selectionEnabled ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Selected total</span>
                <span className="text-sm font-bold" style={{ color: brandColor }}>
                  {formatPrice(selectedTotal)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-2xl border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendSelected}
                  className="flex-1 px-4 py-2 rounded-2xl"
                  style={{ backgroundColor: brandColor, color: contrastTextColor }}
                  disabled={selectedIds.size === 0}
                >
                  Send items
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );

  // Mobile bottom sheet
  const MobileSheet = (
    <div className="sm:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden">
        {/* Grab handle */}
        <div className="flex justify-center pt-2">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-base font-bold text-gray-800">Your Cart</h2>
          <div className="flex items-center gap-3">
            {selectionEnabled && (
              <button
                onClick={toggleSelectAll}
                className="text-xs text-gray-600 hover:underline"
                aria-label={allSelected ? 'Clear selection' : 'Select all'}
              >
                {allSelected ? 'Clear selection' : 'Select all'}
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close cart">
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '55vh' }}>
          {(!cartItems || cartItems.length === 0) ? (
            <p className="p-4 text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => {
              const selected = selectionEnabled ? selectedIds.has(item.id) : false;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 ${selected ? 'bg-gray-50' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    {selectionEnabled && (
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-red-500 border-gray-300 rounded"
                        checked={selected}
                        onChange={() => toggleSelect(item.id)}
                        aria-label={selected ? `Deselect ${item.name}` : `Select ${item.name}`}
                      />
                    )}
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            'https://placehold.co/48x48/eee/999?text=Img';
                        }}
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-800 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <button
                          onClick={() => handleDecrease(item.id)}
                          className="px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                          aria-label={`Decrease quantity of ${item.name}`}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleIncrease(item.id)}
                          className="px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  {!selectionEnabled && (
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems && cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            {selectionEnabled ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Selected total</span>
                  <span className="text-sm font-bold" style={{ color: brandColor }}>
                    {formatPrice(selectedTotal)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="w-1/2 px-4 py-3 text-sm font-semibold rounded-2xl border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendSelected}
                    className="w-1/2 px-4 py-3 text-sm font-semibold rounded-2xl"
                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                    disabled={selectedIds.size === 0}
                  >
                    Send items
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-base font-semibold text-gray-800">Total</span>
                  <span className="text-base font-bold" style={{ color: brandColor }}>
                    {formatPrice(totalCost)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full px-4 py-3 text-sm font-semibold rounded-2xl"
                  style={{ backgroundColor: brandColor, color: contrastTextColor }}
                >
                  Checkout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {DesktopPanel}
      {MobileSheet}
    </>
  );
}