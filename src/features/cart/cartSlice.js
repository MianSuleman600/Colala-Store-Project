// src/features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {object} CartItem
 * @property {string} id - Unique identifier for the product.
 * @property {string} name - Name of the product.
 * @property {number} price - Price per unit of the product.
 * @property {number} quantity - Number of units in the cart.
 * @property {string} image - URL for the product image.
 */

/**
 * Per-user cart state structure:
 * itemsByUserId = {
 *   userId1: [CartItem, CartItem],
 *   userId2: [CartItem, CartItem],
 * }
 */
const initialState = {
  itemsByUserId: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { userId, item } = action.payload;
      if (!state.itemsByUserId[userId]) state.itemsByUserId[userId] = [];

      const existingItem = state.itemsByUserId[userId].find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.itemsByUserId[userId].push({ ...item, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      const { userId, itemId } = action.payload;
      if (state.itemsByUserId[userId]) {
        state.itemsByUserId[userId] = state.itemsByUserId[userId].filter(i => i.id !== itemId);
      }
    },
    increaseQuantity: (state, action) => {
      const { userId, itemId } = action.payload;
      const item = state.itemsByUserId[userId]?.find(i => i.id === itemId);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const { userId, itemId } = action.payload;
      const item = state.itemsByUserId[userId]?.find(i => i.id === itemId);
      if (item) {
        if (item.quantity > 1) item.quantity -= 1;
        else state.itemsByUserId[userId] = state.itemsByUserId[userId].filter(i => i.id !== itemId);
      }
    },
    clearCart: (state, action) => {
      const { userId } = action.payload;
      state.itemsByUserId[userId] = [];
    }
  },
});

export const { addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItemsByUser = (userId) => (state) =>
  state.cart.itemsByUserId[userId] || [];

export const selectTotalItemsByUser = (userId) => (state) =>
  state.cart.itemsByUserId[userId]?.reduce((total, item) => total + item.quantity, 0) || 0;

export const selectTotalCostByUser = (userId) => (state) =>
  state.cart.itemsByUserId[userId]?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;

export default cartSlice.reducer;
