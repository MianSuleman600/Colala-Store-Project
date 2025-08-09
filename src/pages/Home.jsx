// src/pages/Home.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import reusable UI components
import Card from '../components/ui/Card';
import InfoBox from '../components/ui/InfoBox';
import ProgressBar from '../components/ui/ProgressBar'; // Assuming ProgressBar is still used in InfoBox or elsewhere
import ActionCard from '../components/ui/ActionCard';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';

// CORRECTED IMPORT PATHS:
import PromotionalBanner from '../components/ui/PromotionBanner';
import StoreBuilderModal from '../components/models/StoreBuilderModal'; // Corrected path to modals

// Import NEWLY EXTRACTED components
import StoreHeader from '../components/store/StoreHeader';
import StoreOwnerInfoSection from '../components/store/StoreOwnerInfoSection'; // IMPORT NEW OWNER SECTION

// Import the new StoreProfileModal
import StoreProfileModal from '../components/models/StoreProfileModal'; // IMPORTANT: New Import

// Import local image assets
import storeIcon from '../assets/icons/storee.png';
import productIcon from '../assets/icons/product.png';
import checkIcon from '../assets/icons/check.png';
import chartbarIcon from '../assets/icons/ChartBar.png';
import shoppingCartIcon from '../assets/icons/ShoppingCart.png';
import shoppingBagImage from '../assets/images/bag.png';

// Import RTK Query hook for store profile data
import { useGetStoreProfileQuery } from '../services/storeProfileApi';

// Import profileCompletion from registrationSlice
import { useSelector as useRegistrationSelector } from 'react-redux'; // Use alias to avoid conflict


/**
 * Helper function to determine contrast text color (black or white)
 * based on the background color's luminance.
 * @param {string} hexcolor - The background color in hex format (e.g., '#RRGGBB').
 * @returns {string} The contrast text color ('#000000' for dark background, '#FFFFFF' for light background).
 */
const getContrastTextColor = (hexcolor) => {
    if (!hexcolor || typeof hexcolor !== 'string') {
        return '#FFFFFF'; // Default to white if color is invalid
    }

    const cleanHex = hexcolor.startsWith('#') ? hexcolor.slice(1) : hexcolor;
    const expandedHex = cleanHex.length === 3
        ? cleanHex.split('').map(char => char + char).join('')
        : cleanHex;

    const r = parseInt(expandedHex.substring(0, 2), 16);
    const g = parseInt(expandedHex.substring(2, 4), 16);
    const b = parseInt(expandedHex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Helper function to lighten or darken a hex color.
 * @param {string} hex - The hex color string (e.g., '#RRGGBB').
 * @param {number} amount - The amount to lighten (positive) or darken (negative) each RGB component (0-255).
 * @returns {string} The adjusted hex color.
 */
const adjustBrightness = (hex, amount) => {
    if (!hex || typeof hex !== 'string') {
        return '#000000'; // Default to black if color is invalid
    }

    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    const num = parseInt(cleanHex, 16);

    let r = (num >> 16) + amount;
    let b = ((num >> 8) & 0x00FF) + amount;
    let g = (num & 0x0000FF) + amount;

    r = Math.min(255, Math.max(0, r));
    b = Math.min(255, Math.max(0, b));
    g = Math.min(255, Math.max(0, g));

    return '#' + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};


/**
 * HomePage Component
 * Displays the main dashboard for a store, dynamically showing data for logged-in users
 * and a greyed-out/placeholder version for guests, matching the guest.png and vari.png images.
 * It consumes necessary user state directly from Redux to avoid prop drilling.
 * Now also fetches store profile data using RTK Query and applies brand color theming.
 */
function HomePage() {

  
    // Get both isLoggedIn, userName, and userId directly from Redux
    const { isLoggedIn, userName, userId } = useSelector((state) => state.user);
    // Get profileCompletion from the registrationSlice (aliased to avoid conflict with main useSelector)
    const { profileCompletion } = useRegistrationSelector((state) => state.registration);

    const navigate = useNavigate();

    // State for modal visibility
    const [isStoreBuilderModalOpen, setIsStoreBuilderModalOpen] = useState(false);
    // NEW STATE FOR STORE PROFILE MODAL
    const [isStoreProfileModalOpen, setIsStoreProfileModalOpen] = useState(false);
    const [selectedStoreIdForProfile, setSelectedStoreIdForProfile] = useState(null);

    // Fetch store profile data for display on the homepage
    // We fetch the logged-in user's store profile, so we pass userId if logged in
    const { data: storeProfile } = useGetStoreProfileQuery(userId, {
        skip: !isLoggedIn, // Only fetch if logged in
    });
      console.log({ isLoggedIn, userName, userId });

    // Determine the brand color and contrasting text color
    const brandColor = storeProfile?.brandColor || '#EF4444'; // Fallback to a default if not available
    
    const contrastTextColor = getContrastTextColor(brandColor);
    const lightBrandColor = adjustBrightness(brandColor, 100); // Lighter shade for backgrounds like icons

    // Use a derived state for mockStoreData that prioritizes fetched data
    const mockStoreData = {
        name: isLoggedIn ? (storeProfile?.storeName || userName) : 'Guest Store', // Use storeName from profile
        email: isLoggedIn ? (storeProfile?.email || 'sashastores@gmail.com') : 'guest@example.com',
        phoneNumber: isLoggedIn ? (storeProfile?.phoneNumber || '070123456789') : 'N/A',
        location: isLoggedIn ? (storeProfile?.storeLocation || 'Lagos, Nigeria') : 'N/A', // Use storeLocation from profile
        category: isLoggedIn ? (storeProfile?.categories || ['Add New']) : 'Add New', // Use categories array
        productsCount: isLoggedIn ? 8 : '-',
        reviewsCount: isLoggedIn ? 153 : '-',
        rating: isLoggedIn ? 4.5 : '-',
        profilePictureUrl: isLoggedIn ? storeProfile?.profilePictureUrl : null, // Directly use fetched URL
        bannerImageUrl: isLoggedIn ? storeProfile?.bannerImageUrl : null,    // Directly use fetched URL
        completionPercentage: isLoggedIn ? profileCompletion : 0, // UPDATED: Use actual profileCompletion from Redux
        hasPromotionalBanner: storeProfile?.promotionalBannerImageUrl ? true : false, // Check if promotional banner exists
        latestOrders: isLoggedIn ? [
            { id: 1, customer: 'Qamar malik', itemsCount: 2, amount: '₦9,999,990', status: 'Delivered' },
            { id: 2, customer: 'Adewale Chris', itemsCount: 2, amount: '₦9,999,990', status: 'Delivered' },
            { id: 3, customer: 'Adam Sandler', itemsCount: 2, amount: '₦9,999,990', status: 'Delivered' },
        ] : [],
        promotionalStoreName: storeProfile?.storeName || "Sasha Stores", // Use storeName from profile
    };


    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleMyProduct =() =>{
        console.log("Is Logged In:", isLoggedIn);

        navigate('/my-products'); // Navigate to MyProduct page
    }

    const handleStatClick =() =>{
        navigate('/statistics')
    }

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleOrderClick =() =>{
        navigate('/orders')
    }

    const handleSubscriptionClick = () =>{
        navigate('/subscription')
    }

    const handleUpgradeStore = () => {
        navigate('/store-upgrade'); // Navigate to the upgrade store page
    };

    const handleShopNowClick = () => {
        console.log('Shop Now button clicked!');
        // Example: navigate to a products page
        // navigate('/products');
    };

    // Handler to open the Store Builder modal
    const handleOpenStoreBuilder = () => {
        if (isLoggedIn) {
            setIsStoreBuilderModalOpen(true);
        } else {
            handleRegisterClick(); // Redirect to register if not logged in
        }
    };

    // UPDATED: Handler for "View Profile" button
    const handleViewProfileClick = () => {
        if (isLoggedIn) {
            // Set the storeId to view (for the logged-in user, it's their own userId)
            setSelectedStoreIdForProfile(userId);
            setIsStoreProfileModalOpen(true); // Open the modal
        } else {
            handleLoginClick(); // Redirect to login if not logged in
        }
    };

    // Function to close the StoreProfileModal
    const handleCloseStoreProfileModal = () => {
        setIsStoreProfileModalOpen(false);
        setSelectedStoreIdForProfile(null); // Clear selected ID when closed
    };


    const mockActionCards = [
        {
            icon: storeIcon,
            title: 'My Orders',
            description: 'Manage your orders effectively, view and monitor every aspect of your customer orders.',
            onClick: isLoggedIn ? handleOrderClick : handleLoginClick,
        },
        {
            icon: productIcon,
            title: 'My Products',
            description: 'This is home for all your products. Manage everything here.',
            onClick: isLoggedIn ? handleMyProduct : handleLoginClick,
        },
        {
            icon: chartbarIcon,
            title: 'Statistics',
            description: 'View detailed statistics for all your products.',
            onClick: isLoggedIn ? handleStatClick : handleLoginClick,
        },
        {
            icon: checkIcon,
            title: 'Subscription',
            description: 'Manage your subscription package here effectively.',
            onClick: isLoggedIn ? handleSubscriptionClick : handleLoginClick,
        },
    ];

    return (
        <div className="container mx-auto py-6">
            {/* Store Builder Modal - Rendered conditionally */}
            <StoreBuilderModal
                isOpen={isStoreBuilderModalOpen}
                onClose={() => setIsStoreBuilderModalOpen(false)}
            />

            {/* Extracted StoreHeader Component */}
            <StoreHeader
                bannerImageUrl={mockStoreData.bannerImageUrl}
                profilePictureUrl={mockStoreData.profilePictureUrl}
                isLoggedIn={isLoggedIn}
                // No specific back/share buttons on the HomePage header itself usually
                // These are provided within the StoreProfileModal
                handleGoBack={() => {}} // Placeholder or remove if not needed on homepage header
                handleShare={() => {}} // Placeholder or remove if not needed on homepage header
            />

            <div className="grid grid-cols-1 mt-12 lg:grid-cols-3 gap-6">
                {/* Left Column: Store Profile & Latest Orders */}
                <div className="lg:col-span-1 space-y-6">
                    {/* NEW: Use StoreOwnerInfoSection Component */}
                    <StoreOwnerInfoSection
                        storeData={mockStoreData}
                        isLoggedIn={isLoggedIn}
                        handleOpenStoreBuilder={handleOpenStoreBuilder}
                        handleLoginClick={handleLoginClick}
                        brandColor={brandColor}
                        contrastTextColor={contrastTextColor}
                        lightBrandColor={lightBrandColor}
                    />

                    {/* Latest Orders Section (remains here as it's a direct child of this column) */}
                    <SectionHeader
                        title="Latest Orders"
                        style={{ color: brandColor }}
                    />
                    <Card className={`p-4 min-h-[200px] flex items-center justify-center text-gray-500 ${!isLoggedIn ? 'opacity-50' : ''}`}>
                        {isLoggedIn ? (
                            mockStoreData.latestOrders.length > 0 ? (
                                <ul className="space-y-3 w-full">
                                    {mockStoreData.latestOrders.map(order => (
                                        <li key={order.id} className="flex justify-between items-center text-gray-700 text-sm border p-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-red-500">
                                            <div className="flex items-center">
                                                <div
                                                    className="p-2 rounded-full mr-3"
                                                    style={{ backgroundColor: lightBrandColor }}
                                                >
                                                    <img src={shoppingCartIcon} alt="Cart" className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className=" text-gray-800">{order.customer}</p>
                                                    <p className="text-xs text-gray-500">{order.itemsCount} items</p>
                                                </div>
                                            </div>
                                            <span
                                                className="font-bold"
                                                style={{ color: brandColor }}
                                            >
                                                {order.amount}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No recent orders to display.</p>
                            )
                        ) : (
                            <div className="text-center">
                                <p className="mb-2">Login to view your latest orders.</p>
                                <Button
                                    onClick={handleLoginClick}
                                    className="py-2 px-4 rounded-lg font-semibold hover:bg-red-700 mt-4"
                                    style={{ backgroundColor: brandColor, color: contrastTextColor }}
                                >
                                    Login Now
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column: Onboarding, Banners, Action Cards */}
                <div className="lg:col-span-2 space-y-6">
                    <div className='flex justify-end items-center mb-6'>
                        <Button
                            className={`py-2 px-4 rounded-lg ${isLoggedIn ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                            onClick={handleViewProfileClick} // THIS IS THE UPDATED CALL
                            disabled={!isLoggedIn}
                        >
                            {isLoggedIn ? 'View Profile' : 'View Profile'}
                        </Button>
                        <Button
                            className={`py-2 px-4 rounded-lg ml-4 ${!isLoggedIn ? 'cursor-not-allowed' : ''}`}
                            style={{ backgroundColor: brandColor, color: contrastTextColor }}
                            onClick={handleOpenStoreBuilder}
                            disabled={!isLoggedIn}
                        >
                            {isLoggedIn ? 'Store Builder' : 'Store Builder'}
                        </Button>
                    </div>

                    {/* Conditional rendering for the main PromotionalBanner component */}
                    {isLoggedIn && mockStoreData.hasPromotionalBanner && (
                        <PromotionalBanner
                            storeName={mockStoreData.promotionalStoreName}
                            onButtonClick={handleShopNowClick}
                            imageUrl={shoppingBagImage}
                        />
                    )}

                    <InfoBox
                        title={isLoggedIn ? "Finish creating your store to start selling and reaching our wide range of audience" : "Register your store to start selling and reaching our wide range of audience"}
                        actionText={isLoggedIn ? "Create Store" : "Register Store"}
                        actionOnClick={isLoggedIn ? handleUpgradeStore : handleRegisterClick}
                        completionPercentage={mockStoreData.completionPercentage}
                        actionButtonStyle={{ backgroundColor: brandColor, color: contrastTextColor }}
                    />

                    {/* Action Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockActionCards.map((card, index) => (
                            <ActionCard
                                key={index}
                                icon={card.icon}
                                title={card.title}
                                description={card.description}
                                onClick={card.onClick}
                                className={!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}
                                isGuestView={!isLoggedIn}
                                brandColor={brandColor}
                                contrastTextColor={contrastTextColor}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* NEW: The StoreProfileModal component */}
            <StoreProfileModal
                isOpen={isStoreProfileModalOpen}
                onClose={handleCloseStoreProfileModal}
                storeId={selectedStoreIdForProfile} // Pass the userId as storeId to display the owner's profile
            />
        </div>
    );
}

export default HomePage;
