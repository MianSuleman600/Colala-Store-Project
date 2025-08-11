// src/mocks/db.js

import profileImage from '../assets/images/profileImage.png';
import bannerImage from '../assets/images/bannerImage.png';
import PromotionalBannerImage from '../assets/images/bag.png';

// The default mock database
export const MOCK_DEFAULT_DB = {
    'default_user_id': {    
        name: 'Sasha Stores',
        // 🟢 ADDED: Include the storeName field for consistency
        storeName: 'Sasha Stores', 
        email: 'sashastores@example.com',
        phoneNumber: '0901234456',
        location: 'Lagos',
        categories: ['Electronics'],
        profilePictureUrl: profileImage,
        bannerImageUrl: bannerImage,
        promotionalBannerImageUrl: PromotionalBannerImage,
        showPhoneOnProfile: true,
        brandColor: '#EF4444',
    },
};

// Helper function to replace string paths with imported image modules
export const hydrateImagePaths = (profile) => {
    const hydratedProfile = { ...profile };
    if (hydratedProfile.profilePictureUrl && String(hydratedProfile.profilePictureUrl).includes('assets/images/profileImage.png')) {
        hydratedProfile.profilePictureUrl = profileImage;
    }
    if (hydratedProfile.bannerImageUrl && String(hydratedProfile.bannerImageUrl).includes('assets/images/bannerImage.png')) {
        hydratedProfile.bannerImageUrl = bannerImage;
    }
    if (hydratedProfile.promotionalBannerImageUrl && String(hydratedProfile.promotionalBannerImageUrl).includes('assets/images/bag.png')) {
        hydratedProfile.promotionalBannerImageUrl = PromotionalBannerImage;
    }
    return hydratedProfile;
};

// Initialize the database from localStorage or with defaults
let MOCK_STORE_PROFILES_DB = {};
const storedProfiles = localStorage.getItem('mockStoreProfiles');

if (!storedProfiles) {
    MOCK_STORE_PROFILES_DB = { ...MOCK_DEFAULT_DB };
    localStorage.setItem('mockStoreProfiles', JSON.stringify(MOCK_STORE_PROFILES_DB));
} else {
    const parsedProfiles = JSON.parse(storedProfiles);
    for (const id in parsedProfiles) {
        // Hydrate the image paths on initialization
        MOCK_STORE_PROFILES_DB[id] = hydrateImagePaths(parsedProfiles[id]);
    }
}

// Function to save the database to localStorage, converting image modules back to strings
export const saveDbToLocalStorage = (db) => {
    const dbToStore = {};
    for (const id in db) {
        dbToStore[id] = { ...db[id] };
        if (dbToStore[id].profilePictureUrl instanceof File) {
            dbToStore[id].profilePictureUrl = 'simulated-url-for-profileImage.png';
        }
        if (dbToStore[id].bannerImageUrl instanceof File) {
            dbToStore[id].bannerImageUrl = 'simulated-url-for-bannerImage.png';
        }
        if (dbToStore[id].promotionalBannerImageUrl instanceof File) {
            dbToStore[id].promotionalBannerImageUrl = 'simulated-url-for-promotionalBanner.png';
        }
    }
    localStorage.setItem('mockStoreProfiles', JSON.stringify(dbToStore));
};

export default MOCK_STORE_PROFILES_DB;
