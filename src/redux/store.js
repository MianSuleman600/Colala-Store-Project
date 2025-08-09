import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import registrationReducer from "../features/auth/registrationSlice"
import userReducer from "../features/auth/userSlice"
import { setupListeners } from '@reduxjs/toolkit/query';
import { storeProfileApi } from '../services/storeProfileApi'; // Adjust path if necessary
import { productsApi } from '../services/productsApi'; // <-- NEW: Import products API
import cartReducer from '../features/cart/cartSlice';



// add more as needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registration: registrationReducer,
    user: userReducer,
    cart: cartReducer,
    [storeProfileApi.reducerPath]: storeProfileApi.reducer, // Add the new API reducer
    [productsApi.reducerPath]: productsApi.reducer, // <-- NEW: Add products API reducer
  },
  // Add the API middleware to enable caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(storeProfileApi.middleware,productsApi.middleware ),

  
});

// Optional: Required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);