// src/features/auth/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userName: 'Sasha Stores', // Default/mock logged-in user name for demo
        isLoggedIn: true, // Simulate logged-in state for demo
        cartItemCount: 3, // Mock cart count for demo
        // --- ADDED userId HERE ---
        // IMPORTANT: This 'default_user_id' MUST match the key used in MOCK_STORE_PROFILES_DB in storeProfileApi.js
        userId: 'default_user_id', // Assign a mock user ID for the initial logged-in state
        // --- NEW: Added a field to store the user's store profile ---
        storeProfile: null,
    },
    reducers: {
        setUserName: (state, action) => {
            state.userName = action.payload;
        },
        setCartItemCount: (state, action) => {
            state.cartItemCount = action.payload;
        },
        login: (state, action) => { // Consider accepting a payload for more dynamic login
            state.isLoggedIn = true;
            state.userName = action.payload?.userName || 'Logged In User'; // Optionally update userName from payload
            // --- SET userId ON LOGIN ---
            // In a real app, action.payload would contain the user ID from your backend's login response
            state.userId = action.payload?.userId || 'default_user_id'; // Set a specific ID on login
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.userName = 'Guest';
            state.cartItemCount = 0;
            // --- CLEAR userId ON LOGOUT ---
            state.userId = null; // Clear userId on logout
            state.storeProfile = null; // Also clear the store profile on logout
        },
        // --- NEW: Reducer to set the entire store profile object ---
        setStoreProfile: (state, action) => {
            state.storeProfile = action.payload;
        },
    },
});

export const { setUserName, setCartItemCount, login, logout, setStoreProfile } = userSlice.actions;
export default userSlice.reducer;
