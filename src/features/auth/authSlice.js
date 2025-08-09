// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Reducers for synchronous state updates
        logout: (state) => {
            state.user = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Example for handling async thunks (like loginUser)
        // builder
        //     .addCase(loginUser.pending, (state) => {
        //         state.status = 'loading';
        //         state.error = null;
        //     })
        //     .addCase(loginUser.fulfilled, (state, action) => {
        //         state.status = 'succeeded';
        //         state.user = action.payload; // Assuming payload is the user data
        //     })
        //     .addCase(loginUser.rejected, (state, action) => {
        //         state.status = 'failed';
        //         state.error = action.error.message;
        //     });
    },
});

export const { logout } = authSlice.actions;

// Placeholder for an async thunk for login
export const loginUser = (credentials) => async (dispatch) => {
    // In a real app, this would be an API call
    console.log('Dispatching loginUser with:', credentials);
    // dispatch(someActionForLoading());
    try {
        // const response = await AuthService.login(credentials);
        // dispatch(loginUser.fulfilled(response.data));
    } catch (err) {
        // dispatch(loginUser.rejected(err.message));
    }
};

export default authSlice.reducer;