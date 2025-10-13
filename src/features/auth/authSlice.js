import { createSlice } from '@reduxjs/toolkit';
import { clearAuthTokens } from '../../api/apiClient';

const initialState = {
    user: null,
    token: null, 
    isAuthenticated: false,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.status = 'succeeded';
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        },
        
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            state.error = null;
            clearAuthTokens();

            // ✅ THE FIX, PART 2: Remove the user ID from local storage on logout.
            // This prevents a logged-out user from having a stale ID in their browser.
            localStorage.removeItem('userId');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;