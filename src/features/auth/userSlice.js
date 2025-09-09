// src/features/auth/userSlice.js

import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userName: 'Sasha Stores',
    isLoggedIn: true,
    cartItemCount: 3,
    userId: 'default_user_id', // This matches the store profile ID in db.js
    storeProfile: null,
  },
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setCartItemCount: (state, action) => {
      state.cartItemCount = action.payload;
    },
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userName = action.payload?.userName || 'Logged In User';
      state.userId = action.payload?.userId || 'default_user_id';
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userName = 'Guest';
      state.cartItemCount = 0;
      state.userId = null;
      state.storeProfile = null;
    },
    setStoreProfile: (state, action) => {
      state.storeProfile = action.payload;
    },
  },
});

export const { setUserName, setCartItemCount, login, logout, setStoreProfile } = userSlice.actions;
export default userSlice.reducer;
