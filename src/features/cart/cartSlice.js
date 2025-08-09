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

// We'll start with an empty cart state.
// In a real application, you might load this from local storage or an API on app startup.
const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        /**
         * Adds an item to the cart or increases its quantity if it already exists.
         * @param {object} state - The current Redux state for the cart.
         * @param {object} action - The action containing the item to add.
         * @param {CartItem} action.payload - The cart item object to add.
         */
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (existingItem) {
                // If the item already exists, just increase its quantity.
                existingItem.quantity += 1;
            } else {
                // If the item is new, add it to the cart with a quantity of 1.
                state.items.push({ ...newItem, quantity: 1 });
            }
        },
        /**
         * Removes a specific item from the cart.
         * @param {object} state - The current Redux state for the cart.
         * @param {object} action - The action containing the ID of the item to remove.
         * @param {string} action.payload - The ID of the item to remove.
         */
        removeItem: (state, action) => {
            const idToRemove = action.payload;
            state.items = state.items.filter(item => item.id !== idToRemove);
        },
        /**
         * Increases the quantity of a specific item.
         * @param {object} state - The current Redux state for the cart.
         * @param {object} action - The action containing the ID of the item.
         * @param {string} action.payload - The ID of the item to increase.
         */
        increaseQuantity: (state, action) => {
            const idToIncrease = action.payload;
            const item = state.items.find(item => item.id === idToIncrease);
            if (item) {
                item.quantity += 1;
            }
        },
        /**
         * Decreases the quantity of a specific item.
         * Removes the item if the quantity drops to 0.
         * @param {object} state - The current Redux state for the cart.
         * @param {object} action - The action containing the ID of the item.
         * @param {string} action.payload - The ID of the item to decrease.
         */
        decreaseQuantity: (state, action) => {
            const idToDecrease = action.payload;
            const item = state.items.find(item => item.id === idToDecrease);

            if (item && item.quantity > 1) {
                item.quantity -= 1;
            } else if (item && item.quantity === 1) {
                // Remove the item completely if its quantity drops to zero.
                state.items = state.items.filter(i => i.id !== idToDecrease);
            }
        },
        /**
         * Clears all items from the cart.
         */
        clearCart: (state) => {
            state.items = [];
        }
    },
});

export const { addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

// Selectors
/**
 * Selects the total number of items (quantity) in the cart.
 * @param {object} state - The full Redux state.
 * @returns {number} The total quantity of all items in the cart.
 */
export const selectTotalItems = (state) => 
    state.cart.items.reduce((total, item) => total + item.quantity, 0);

/**
 * Selects the total cost of all items in the cart.
 * @param {object} state - The full Redux state.
 * @returns {number} The total calculated cost of the items.
 */
export const selectTotalCost = (state) => 
    state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

export default cartSlice.reducer;