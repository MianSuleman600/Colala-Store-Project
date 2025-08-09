import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import profileImage from '../assets/images/profileImage.png';
import bannerImage from '../assets/images/bannerImage.png';
import PromotionalBannerImage from '../assets/images/bag.png';


// A map to store mock profiles by ID.
// In a real app, this would be a database or a backend API.
// For localStorage, we'll store a JSON stringified version of this map.
let MOCK_STORE_PROFILES_DB = {
    // We'll use a placeholder ID 'default_user_id' for initial setup.
    // You should replace this with a real user ID from your Redux state if available.
    // Or, during login/registration, create a unique ID and store a profile for it.
    'default_user_id': { // This ID should match what you get from `userId` in Redux
        name: 'Sasha Stores',
        email: 'sashastores@example.com',
        phoneNumber: '0901234456',
        location: 'Lagos',
        categories: ['Electronics'],
        profilePictureUrl: profileImage,
        bannerImageUrl: bannerImage,
        promotionalBannerImageUrl:  PromotionalBannerImage ,
        showPhoneOnProfile: true,
        brandColor: '#EF4444',
    },
    // Add more mock profiles if needed for different IDs
    // 'another_user_id': { /* ... another profile data ... */ }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize localStorage with mock data if not already present
// This ensures each user ID can have its own profile stored.
if (!localStorage.getItem('mockStoreProfiles')) {
    localStorage.setItem('mockStoreProfiles', JSON.stringify(MOCK_STORE_PROFILES_DB));
} else {
    // If it exists, load it. This allows changes made via updateStoreProfile to persist.
    MOCK_STORE_PROFILES_DB = JSON.parse(localStorage.getItem('mockStoreProfiles'));
    // Ensure default images are correctly re-mapped if the stored paths are strings
    for (const id in MOCK_STORE_PROFILES_DB) {
        if (MOCK_STORE_PROFILES_DB[id].profilePictureUrl && String(MOCK_STORE_PROFILES_DB[id].profilePictureUrl).includes('assets/images/profileImage.png')) {
            MOCK_STORE_PROFILES_DB[id].profilePictureUrl = profileImage;
        }
        if (MOCK_STORE_PROFILES_DB[id].bannerImageUrl && String(MOCK_STORE_PROFILES_DB[id].bannerImageUrl).includes('assets/images/bannerImage.png')) {
            MOCK_STORE_PROFILES_DB[id].bannerImageUrl = bannerImage;
        }
         if (MOCK_STORE_PROFILES_DB[id].promotionalBannerImageUrl &&
        String(MOCK_STORE_PROFILES_DB[id].promotionalBannerImageUrl).includes('assets/images/bag.png')) {
        MOCK_STORE_PROFILES_DB[id].promotionalBannerImageUrl = PromotionalBannerImage;
    }
    }
}


export const storeProfileApi = createApi({
    reducerPath: 'storeProfileApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    tagTypes: ['StoreProfile'],

    endpoints: (builder) => ({
        // UPDATED: Now accepts an 'id' argument
        getStoreProfile: builder.query({
            queryFn: async (id) => { // <<< IMPORTANT: Added 'id' parameter
                await delay(500); // Simulate network delay
                try {
                    const storedProfiles = JSON.parse(localStorage.getItem('mockStoreProfiles') || '{}');
                    let profileToReturn = storedProfiles[id]; // Try to find profile by ID

                    if (!profileToReturn) {
                        // If no profile found for this ID, use a default or create one
                        // For demonstration, let's create a very basic one or use MOCK_INITIAL_STORE_PROFILE as a base.
                        // In a real app, this would typically mean the profile doesn't exist.
                        console.warn(`No mock profile found for ID: ${id}. Returning a generic one.`);
                        profileToReturn = {
                            ...MOCK_STORE_PROFILES_DB['default_user_id'], // Use the default template
                            name: `Store for User ${id}`, // Customize name
                            email: `${id}@example.com`,
                            // Ensure image modules are correctly assigned if using local defaults
                            profilePictureUrl: profileImage,
                            bannerImageUrl: bannerImage,
                            // Add any other default properties
                        };
                        // Optionally, save this new default profile to localStorage for next time
                        storedProfiles[id] = profileToReturn;
                        localStorage.setItem('mockStoreProfiles', JSON.stringify(storedProfiles));
                    } else {
                        // Ensure local image paths are re-mapped to actual imported modules
                        if (String(profileToReturn.profilePictureUrl).includes('assets/images/profileImage.png')) {
                            profileToReturn.profilePictureUrl = profileImage;
                        }
                        if (String(profileToReturn.bannerImageUrl).includes('assets/images/bannerImage.png')) {
                            profileToReturn.bannerImageUrl = bannerImage;
                        }
                    }

                    return { data: profileToReturn };
                } catch (error) {
                    console.error("Error fetching store profile:", error);
                    return { error: { status: 'FETCH_ERROR', data: error.message } };
                }
            },
            // The providesTags should now include the ID if you're fetching specific profiles
            providesTags: (result, error, id) => [{ type: 'StoreProfile', id }],
        }),

        // UPDATED: Now expects 'id' in the patch for specific store update
        updateStoreProfile: builder.mutation({
            queryFn: async ({ id, ...patch }) => { // IMPORTANT: Destructure 'id' from patch
                await delay(500); // Simulate network delay
                try {
                    let storedProfiles = JSON.parse(localStorage.getItem('mockStoreProfiles') || '{}');
                    let currentProfile = storedProfiles[id];

                    if (currentProfile) {
                        let updatedProfile = { ...currentProfile, ...patch };
                        storedProfiles[id] = updatedProfile;
                        localStorage.setItem('mockStoreProfiles', JSON.stringify(storedProfiles));
                        return { data: updatedProfile };
                    } else {
                        // If trying to update a non-existent profile, you might create it or return an error
                        return { error: { status: 'NOT_FOUND', data: `Profile with ID ${id} not found for update.` } };
                    }
                } catch (error) {
                    console.error("Error updating store profile:", error);
                    return { error: { status: 'UPDATE_ERROR', data: error.message } };
                }
            },
            // Invalidate the specific tag for the updated profile
            invalidatesTags: (result, error, { id }) => [{ type: 'StoreProfile', id }],
        }),
    }),
});

export const { useGetStoreProfileQuery, useUpdateStoreProfileMutation } = storeProfileApi;