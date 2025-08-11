// src/pages/Home.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import reusable UI components
import Card from '../components/ui/Card';
import InfoBox from '../components/ui/InfoBox';
import ProgressBar from '../components/ui/ProgressBar';
import ActionCard from '../components/ui/ActionCard';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';

// CORRECTED IMPORT PATHS:
import PromotionalBanner from '../components/ui/PromotionBanner';
import StoreBuilderModal from '../components/models/StoreBuilderModal'; 

// Import NEWLY EXTRACTED components
import StoreHeader from '../components/store/StoreHeader';
import StoreOwnerInfoSection from '../components/store/StoreOwnerInfoSection'; 

// Import the new StoreProfileModal
import StoreProfileModal from '../components/models/StoreProfileModal'; 

// Import local image assets
import storeIcon from '../assets/icons/storee.png';
import productIcon from '../assets/icons/product.png';
import checkIcon from '../assets/icons/check.png';
import chartbarIcon from '../assets/icons/ChartBar.png';
import shoppingCartIcon from '../assets/icons/ShoppingCart.png';
import shoppingBagImage from '../assets/images/bag.png';

// Import RTK Query hook for store profile data
import { useGetStoreProfileQuery } from '../services/storeProfileApi';

// Import utility functions
import { getContrastTextColor, adjustBrightness } from '../utils/colorUtils';


function HomePage() {

    // Get both isLoggedIn, userName, and userId directly from Redux
    const { isLoggedIn, userName, userId } = useSelector((state) => {
        return state.user;
    });
    
    const navigate = useNavigate();

    // State for modal visibility
    const [isStoreBuilderModalOpen, setIsStoreBuilderModalOpen] = useState(false);
    // NEW STATE FOR STORE PROFILE MODAL
    const [isStoreProfileModalOpen, setIsStoreProfileModalOpen] = useState(false);
    const [selectedStoreIdForProfile, setSelectedStoreIdForProfile] = useState(null);

    // Fetch store profile data for display on the homepage
    const { data: storeProfile, isLoading: isProfileLoading, error: profileError } = useGetStoreProfileQuery(userId, {
        skip: !isLoggedIn || !userId,
    });
  
    // Handle loading and error states for the query
    if (isProfileLoading) {
        return <div>Loading store profile...</div>;
    }
    
    if (profileError) {
        // A more detailed error message can be provided here
        return <div>Error loading store profile. Please try again later.</div>;
    }

    // Determine the brand color and contrasting text color
    const brandColor = storeProfile?.brandColor || '#EF4444'; // Fallback to a default if not available
    const contrastTextColor = getContrastTextColor(brandColor);
    const lightBrandColor = adjustBrightness(brandColor, 100); 

    // Use a derived state for mockStoreData that prioritizes fetched data
    const mockStoreData = {
        name: storeProfile?.storeName || userName || 'Guest Store',
        email: storeProfile?.email || 'sashastores@gmail.com',
        phoneNumber: storeProfile?.phoneNumber || '070123456789',
        location: storeProfile?.storeLocation || 'Lagos, Nigeria', 
        categories: storeProfile?.categories || ['Add New'], 
        productsSold: storeProfile?.productsSold || 100,
        followers: storeProfile?.followers || 500,
        ratings: storeProfile?.ratings || 4.7,
        salesMessage: storeProfile?.salesMessage || 'Product sales going on from Sept 7 - Oct 30',
        socialMediaLinks: storeProfile?.socialMediaLinks || { whatsapp: '#', instagram: '#', x: '#', facebook: '#', },
        profilePictureUrl: storeProfile?.profilePictureUrl || null, 
        bannerImageUrl: storeProfile?.bannerImageUrl || null, 
        // FIX: Get the completion percentage directly from the storeProfile data
        completionPercentage: isLoggedIn ? storeProfile?.completionPercentage || 0 : 0, 
        hasPromotionalBanner: storeProfile?.promotionalBannerImageUrl ? true : false, 
        promotionalStoreName: storeProfile?.storeName || "Sasha Stores", 
        // Add a mock array for latest orders as it's used in the JSX
        latestOrders: [
            { id: 1, customer: 'John Doe', itemsCount: 3, amount: '₦15,000' },
            { id: 2, customer: 'Jane Smith', itemsCount: 1, amount: '₦5,000' },
        ],
    };


    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleMyProduct = () => {
        navigate('/my-products'); 
    }

    const handleStatClick = () => {
        navigate('/statistics')
    }

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleOrderClick = () => {
        navigate('/orders')
    }

    const handleSubscriptionClick = () => {
        navigate('/subscription')
    }

    const handleUpgradeStore = () => {
        navigate('/store-upgrade'); 
    };

    const handleShopNowClick = () => {
        console.log('Shop Now button clicked!');
    };

    // Handler to open the Store Builder modal
    const handleOpenStoreBuilder = () => {
        if (isLoggedIn) {
            setIsStoreBuilderModalOpen(true);
        } else {
            handleRegisterClick(); 
        }
    };

    const handleViewProfileClick = () => {
        if (isLoggedIn) {
            setSelectedStoreIdForProfile(userId);
            setIsStoreProfileModalOpen(true); 
        } else {
            handleLoginClick(); 
        }
    };

    // Function to close the StoreProfileModal
    const handleCloseStoreProfileModal = () => {
        setIsStoreProfileModalOpen(false);
        setSelectedStoreIdForProfile(null); 
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
            <StoreBuilderModal
                isOpen={isStoreBuilderModalOpen}
                onClose={() => setIsStoreBuilderModalOpen(false)}
                userId={userId}
            />

            <StoreHeader
                bannerImageUrl={mockStoreData.bannerImageUrl}
                profilePictureUrl={mockStoreData.profilePictureUrl}
                isLoggedIn={isLoggedIn}
                handleGoBack={() => { }} 
                handleShare={() => { }} 
            />

            <div className="grid grid-cols-1 mt-12 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <StoreOwnerInfoSection
                        storeData={mockStoreData}
                        isLoggedIn={isLoggedIn}
                        handleOpenStoreBuilder={handleOpenStoreBuilder}
                        handleLoginClick={handleLoginClick}
                        brandColor={brandColor}
                        contrastTextColor={contrastTextColor}
                        lightBrandColor={lightBrandColor}
                        
                    />

                    <SectionHeader
                        title="Latest Orders"
                        style={{ color: brandColor }}
                    />
                    <Card className={`p-4 min-h-[200px] flex items-center justify-center text-gray-500 ${!isLoggedIn ? 'opacity-50' : ''}`}>
                        {isLoggedIn ? (
                            mockStoreData.latestOrders?.length > 0 ? (
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

                <div className="lg:col-span-2 space-y-6">
                    <div className='flex justify-end items-center mb-6'>
                        <Button
                            className={`py-2 px-4 rounded-lg ${isLoggedIn ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                            onClick={handleViewProfileClick} 
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

            <StoreProfileModal
                isOpen={isStoreProfileModalOpen}
                onClose={handleCloseStoreProfileModal}
                storeId={selectedStoreIdForProfile} 
            />
        </div>
    );
}

export default HomePage;
