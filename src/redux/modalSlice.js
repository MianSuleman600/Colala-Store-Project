// src/redux/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  mode: null, // 'login' | 'register' | null
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.open = true;
      state.mode = action.payload || 'login'; // default to 'login'
    },
    closeModal: (state) => {
      state.open = false;
      state.mode = null;
    },
    switchMode: (state, action) => {
      state.mode = action.payload; // 'login' | 'register'
    },
  },
});

export const { openModal, closeModal, switchMode } = modalSlice.actions;
export default modalSlice.reducer;

// Optional selectors
export const selectModalOpen = (s) => s.modal.open;
export const selectModalMode = (s) => s.modal.mode;