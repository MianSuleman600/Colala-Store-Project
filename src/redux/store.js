// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import registrationReducer from "../features/auth/registrationSlice";
import userReducer from "../features/auth/userSlice";
import cartReducer from "../features/cart/cartSlice";
import likesReducer from "../features/feed/pages/likesSlice"; // ✅ Likes slice
import modalReducer from './modalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registration: registrationReducer,
    user: userReducer,
    cart: cartReducer,
    likes: likesReducer, // ✅ Add likes reducer
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Optional: ignore non-serializable warnings for file uploads in registration form
      serializableCheck: {
        ignoredPaths: ["registration.formData"],
        ignoredActions: ["registration/updateField"],
      },
    }),
});
