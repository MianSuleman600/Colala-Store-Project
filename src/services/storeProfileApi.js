// src/features/api/storeProfileApi.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import MOCK_STORE_PROFILES_DB, { hydrateImagePaths, saveDbToLocalStorage } from '../utils/db';
import { setStoreProfile, login } from '../features/auth/userSlice';
import { resetRegistration } from '../features/auth/registrationSlice';

// A mock utility to simulate network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const storeProfileApi = createApi({
    reducerPath: 'storeProfileApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    tagTypes: ['StoreProfile'],

    endpoints: (builder) => ({
        getStoreProfile: builder.query({
            queryFn: async (id) => {
                await delay(500); // Simulate network delay
                try {
                    let profileToReturn = MOCK_STORE_PROFILES_DB[id];

                    if (!profileToReturn) {
                        console.warn(`No mock profile found for ID: ${id}. Returning a generic one.`);
                        profileToReturn = {
                            ...MOCK_STORE_PROFILES_DB['default_user_id'],
                            name: `Store for User ${id}`,
                            email: `${id}@example.com`,
                        };
                        MOCK_STORE_PROFILES_DB[id] = profileToReturn;
                        saveDbToLocalStorage(MOCK_STORE_PROFILES_DB);
                    }
                    
                    return { data: profileToReturn };
                } catch (error) {
                    console.error("Error fetching store profile:", error);
                    return { error: { status: 'FETCH_ERROR', data: error.message } };
                }
            },
            providesTags: (result, error, id) => [{ type: 'StoreProfile', id }],
        }),

        updateStoreProfile: builder.mutation({
            queryFn: async (payload) => {
                await delay(500); // Simulate network delay
                console.log('API received payload:', payload);

                const { id, data } = payload;
                console.log('API received data type:', typeof data);

                try {
                    let currentProfile = MOCK_STORE_PROFILES_DB[id];

                    if (currentProfile) {
                        let updatedFields = {};
                        
                        if (data instanceof FormData) {
                            updatedFields = Object.fromEntries(data.entries());
                        } else if (data && typeof data === 'object') {
                            updatedFields = data;
                        } else {
                            console.error("Invalid data format for updateStoreProfile mutation. Expected FormData or a plain object.");
                            return { error: { status: 'UPDATE_ERROR', data: 'Invalid data format provided for update.' } };
                        }
                        
                        const updatedProfile = { ...currentProfile, ...updatedFields };

                        for (const key in updatedProfile) {
                            if (updatedProfile[key] instanceof File) {
                                updatedProfile[key] = `simulated-url-for-${key}-${id}`;
                            }
                        }

                        MOCK_STORE_PROFILES_DB[id] = updatedProfile;
                        saveDbToLocalStorage(MOCK_STORE_PROFILES_DB);

                        return { data: updatedProfile };
                    } else {
                        return { error: { status: 'NOT_FOUND', data: `Profile with ID ${id} not found for update.` } };
                    }
                } catch (error) {
                    console.error("Error updating store profile:", error);
                    return { error: { status: 'UPDATE_ERROR', data: error.message } };
                }
            },
            
            async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
                try {
                    const { data: updatedProfileData } = await queryFulfilled;
                    dispatch(setStoreProfile(updatedProfileData));
                    console.log('✅ storeProfileApi: userSlice updated with new profile data.');
                } catch (error) {
                    console.error('❌ storeProfileApi: Failed to update userSlice:', error);
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'StoreProfile', id }],
        }),
        
        registerUser: builder.mutation({
            queryFn: async (formData) => {
                await delay(1000);
                const data = Object.fromEntries(formData.entries());
                console.log('🟢 Mock registration request received:', data);

                if (data.email === 'test@error.com') {
                    return { error: { status: 400, data: 'Email is already taken. Please use a different one.' } };
                }
                
                const newUserId = `user_${Date.now()}`;
                
                const newProfile = {
                    name: data.storeName,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    location: data.storeLocation,
                    categories: JSON.parse(data.categories),
                    profilePictureUrl: `simulated-url-for-profilePicture-${newUserId}`,
                    bannerImageUrl: `simulated-url-for-bannerImage-${newUserId}`,
                    promotionalBannerImageUrl: null,
                    showPhoneOnProfile: true,
                    brandColor: data.selectedColor,
                };
                
                MOCK_STORE_PROFILES_DB[newUserId] = newProfile;
                saveDbToLocalStorage(MOCK_STORE_PROFILES_DB);
                
                console.log('✅ Mock registration successful. New user ID:', newUserId);

                return { data: { success: true, message: 'User registered successfully', userId: newUserId } };
            },
            // --- NEW LOGIC FOR REGISTRATION ---
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data && data.userId) {
                        // Log the user into the userSlice
                        dispatch(login({ userId: data.userId, userName: arg.get('storeName') }));
                        // Reset the registration form data in the registrationSlice
                        dispatch(resetRegistration());
                        console.log('✅ storeProfileApi: Registration successful. User logged in and registration form reset.');
                    }
                } catch (error) {
                    console.error('❌ storeProfileApi: Failed to handle registration side effects:', error);
                }
            },
            // --- END NEW LOGIC ---
        }),
    }),
});

export const { useGetStoreProfileQuery, useUpdateStoreProfileMutation, useRegisterUserMutation } = storeProfileApi;
