// src/components/store/StoreProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import the new Modal wrapper component
import Modal from '../ui/Modal'; // Adjust path
// Import reusable UI components
import Button from '../ui/Button'; // Adjust path
import PromotionalBanner from '../ui/PromotionBanner'; // Adjust path
import StoreBuilderModal from '../models/StoreBuilderModal'; // Adjust path
import InfoBox from '../ui/InfoBox'; // Adjust path
import {getContrastTextColor,adjustBrightness} from '../../utils/colorUtils'

// Import internal store components
import StoreHeader from '../store/StoreHeader'; // Adjust path
import StorePublicInfoSection from '../store/StorePublicInfoSection'; // Adjust path
import StoreSocialLinks from '../store/StoreSocialLinks'; // Adjust path
import StoreTabs from '../store/StoreTabs'; // Adjust path
import StoreProductsGrid from '../store/StoreProductsGrid'; // Adjust path

// Import RTK Query hooks
import { useGetStoreProfileQuery } from '../../services/storeProfileApi'; // Adjust path
import { useGetProductsQuery } from '../../services/productsApi'; // Adjust path

// For owner-specific sales banner
import cartIcon from '../../assets/icons/shop.png'; // Adjust path
import { PlusCircle } from 'lucide-react'; // For Add Product/Service buttons


/**
 * Helper function to determine contrast text color (black or white)
 * based on the background color's luminance.
 * @param {string} hexcolor - The background color in hex format (e.g., '#RRGGBB').
 * @returns {string} The contrast text color ('#000000' for dark background, '#FFFFFF' for light background).
 */

/**
 * Helper function to lighten or darken a hex color.
 * @param {string} hex - The hex color string (e.g., '#RRGGBB').
 * @param {number} amount - The amount to lighten (positive) or darken (negative) each RGB component (0-255).
 * @returns {string} The adjusted hex color.
 */



/**
 * StoreProfileModal Component
 * Displays the comprehensive store profile view as a modal popup.
 * This component contains all the UI/UX from the 'My Store' page, now
 * refactored to be opened by a button from another page.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {string} [props.storeId] - The ID of the store to display. If not provided, it assumes the logged-in user's store based on `userId`.
 */
function StoreProfileModal({ isOpen, onClose, storeId }) {
    const { isLoggedIn, userName, userId } = useSelector((state) => state.user);
    console.log("this is store profile model id :",userId,userName)
    const navigate = useNavigate();


    const [isStoreBuilderModalOpen, setIsStoreBuilderModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Products');
    const [productSearchTerm, setProductSearchTerm] = useState('');

    // State for follow button
    const [isFollowing, setIsFollowing] = useState(false); // Default to false

    // Fetch store profile data - use storeId if provided, otherwise default to userId for current user's store
    // Ensure that useGetStoreProfileQuery can handle 'undefined' or a specific ID
    const currentStoreId = storeId || userId;
    const { data: storeProfile, isLoading: isStoreProfileLoading, error: storeProfileError } = useGetStoreProfileQuery(currentStoreId, {
        skip: !currentStoreId, // Skip if no storeId is provided (e.g., not logged in and no specific storeId)
    });



    // Fetch all products - these should ideally be filtered by storeId by your API
    const { data: allProducts, isLoading: isProductsLoading, error: productsError } = useGetProductsQuery();

    // Determine if the currently logged-in user is the owner of *this* store being viewed
    // This is crucial for showing owner-specific sections
    const isStoreOwner = isLoggedIn && (storeProfile?.ownerId === userId);

    // Derive brand color and contrasting text color
    const brandColor = storeProfile?.brandColor || '#EF4444';
    const contrastTextColor = getContrastTextColor(brandColor);

    // ********** CHANGE STARTS HERE **********
    // Prepare store data for child components, with fallbacks for UI consistency
    const storeData = {
        // Use userName as a fallback for storeName.
        name: storeProfile?.storeName || userName || 'Guest Store',
        email: storeProfile?.email || 'sashastores@gmail.com',
        phoneNumber: storeProfile?.phoneNumber || '070123456789',
        location: storeProfile?.location || 'Lagos, Nigeria',
        category: storeProfile?.categories || ['Electronics', 'Phones'],
        productsCount: allProducts?.filter(p => p.storeName === storeProfile?.name).length || '100', // Filter by viewed store
        reviewsCount: storeProfile?.reviewsCount || '153',
        rating: storeProfile?.rating || '4.7',
        profilePictureUrl: storeProfile?.profilePictureUrl || 'https://placehold.co/100x100/FF00FF/FFFFFF?text=S',
        storeAvatar: storeProfile?.storeAvatar || 'https://placehold.co/100x100/999999/FFFFFF?text=S',
        bannerImageUrl: storeProfile?.bannerImageUrl || 'https://placehold.co/1000x200/B0B0B0/FFFFFF?text=Store+Banner',
        promotionalBannerImageUrl: storeProfile?.promotionalBannerImageUrl || 'https://placehold.co/800x200/FFC0CB/333333?text=Shop+with+ease+on+Sasha+Stores',
        showPhoneOnProfile: storeProfile?.showPhoneOnProfile !== undefined ? storeProfile.showPhoneOnProfile : true,
        hasPromotionalBanner: storeProfile?.promotionalBannerImageUrl ? true : true, // Always show "Shop with ease" for now as per image
        promotionalStoreName: storeProfile?.name || userName || "Guest Store", // Also updated this line
        openTime: storeProfile?.openTime || '07:00AM',
        closeTime: storeProfile?.closeTime || '08:00PM',
        isOpen: storeProfile?.isOpen !== undefined ? storeProfile.isOpen : true,
    };
    // ********** CHANGE ENDS HERE **********
    
console.log("this is storename in store profile model :",storeProfile?.storeName || userName || 'Guest Store')

    // Filter products for the *viewed* store and by search term
    const filteredProducts = React.useMemo(() => {
        if (!allProducts || !storeProfile?.name) return [];
        const currentStoreProducts = allProducts.filter(product =>
            product.storeName === storeProfile.name
        );

        if (!productSearchTerm) {
            return currentStoreProducts;
        }
        return currentStoreProducts.filter(product =>
            product.title.toLowerCase().includes(productSearchTerm.toLowerCase())
        );
    }, [allProducts, storeProfile, productSearchTerm]);


    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleOpenStoreBuilder = () => {
        if (isLoggedIn && isStoreOwner) {
            setIsStoreBuilderModalOpen(true);
        } else if (!isLoggedIn) {
            handleRegisterClick();
        } else {
            console.log("You are not the owner of this store to edit it.");
        }
    };

    const handleShopNowClick = () => {
        console.log('Shop Now button clicked on promotional banner!');
    };

    const handleAddToCart = (productId) => {
        console.log(`Product ${productId} added to cart from Store Profile Modal!`);
    };

    // In a modal, "go back" means close the modal
    const handleGoBack = () => {
        onClose();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: storeData.name,
                text: `Check out ${storeData.name}'s store!`,
                url: window.location.href, // Share the current page URL (where the modal is opened from)
            }).then(() => {
                console.log('Successfully shared');
            }).catch((error) => {
                console.error('Error sharing:', error);
            });
        } else {
            alert('Web Share API is not supported in your browser. You can manually copy the URL.');
            console.log('Share URL:', window.location.href);
        }
    };

    const handleFollowToggle = () => {
        if (!isLoggedIn) {
            handleLoginClick();
            return;
        }
        if (isStoreOwner) {
            console.log("You cannot follow your own store.");
            return;
        }
        setIsFollowing(prev => !prev);
        console.log(isFollowing ? 'Unfollowed store' : 'Following store');
    };

    const handleAddProduct = () => {
        console.log('Add Product button clicked!');
        // Ideally, this would open another modal or navigate (after closing this one)
    };

    const handleAddService = () => {
        console.log('Add Service button clicked!');
        // Ideally, this would open another modal or navigate (after closing this one)
    };


    if (isStoreProfileLoading) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Loading Store Profile...">
                <div className="flex items-center justify-center h-48 text-gray-700">
                    Loading Store Data...
                </div>
            </Modal>
        );
    }

    if (storeProfileError) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Error Loading Store">
                <div className="flex flex-col items-center justify-center h-48 text-red-600">
                    <p className="mb-4">Error loading store data: {storeProfileError?.message || 'Unknown error'}</p>
                    <Button onClick={() => window.location.reload()} className="bg-red-500 text-white py-2 px-4 rounded-lg">
                        Retry
                    </Button>
                </div>
            </Modal>
        );
    }

    // This case handles when a storeId is provided but no profile is found or `skip` was active
    if (!storeProfile && currentStoreId) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Store Not Found">
                <div className="flex items-center justify-center h-48 text-gray-700">
                    Store profile could not be loaded or does not exist for ID: {currentStoreId}.
                </div>
            </Modal>
        );
    }

    // If no storeId is provided and user is not logged in, or no store data at all
    if (!storeProfile) { // This handles the `skip` case if `currentStoreId` was null/undefined
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="No Store Profile">
                <div className="flex items-center justify-center h-48 text-gray-700">
                    No store profile selected or available.
                </div>
            </Modal>
        );
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={storeData.name} className="w-11/12 overflow-y-auto scrollbar-custom max-w-6xl"> {/* Modal title from store name */}
            <div className="container w-full mx-auto py-2 px-2"> {/* Reduced padding for modal content */}
                {/* Store Builder Modal - Only relevant for the owner, opens on top of this modal */}
                {isStoreOwner && (
                    <StoreBuilderModal
                        isOpen={isStoreBuilderModalOpen}
                        onClose={() => setIsStoreBuilderModalOpen(false)}
                    />
                )}

                {/* Store Header (Banner & Profile Pic) - Adjusted for modal context */}
                <StoreHeader
                    bannerImageUrl={storeData.bannerImageUrl}
                    profilePictureUrl={storeData.profilePictureUrl}
                    isModalOpen={isOpen} // Pass the isOpen prop to the header
                    handleGoBack={handleGoBack}
                    handleShare={handleShare}
                />

                <div>
                    <StorePublicInfoSection
                        storeData={storeData}
                        isLoggedIn={isLoggedIn}
                        handleLoginClick={handleLoginClick}
                        brandColor={brandColor}
                        contrastTextColor={contrastTextColor}
                        isFollowing={isFollowing}
                        handleFollowToggle={handleFollowToggle}
                        isStoreOwner={isStoreOwner}

                    />

                </div>

                {/* Main Content Area: Store Info, Social Links, Tabs, Products */}
                {/* mt-12 is for the profile picture to sit correctly over the content below */}
                <div className="grid grid-cols-1 mt-12 lg:grid-cols-3 gap-6">

                    {/* Left Column - Store Info and Owner Tools */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* StorePublicInfoSection: Now styled to match the image, includes Follow button and Open/Close time */}


                        {/* Owner-specific sections (conditional on isStoreOwner) */}
                        {isStoreOwner && (
                            <>
                                {/* Owner's "Product sales going on from Sept 7 - Oct 30" Banner */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">Sales Event</h3>
                                        <Button
                                            className="py-1 px-3 text-sm rounded-full"
                                            style={{ backgroundColor: brandColor, color: contrastTextColor }}
                                            onClick={() => console.log('Manage Sales clicked')}
                                        >
                                            Manage
                                        </Button>
                                    </div>
                                    <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <img src={cartIcon} alt="Cart" className="w-8 h-8 mr-4" />
                                        <div>
                                            <p className="text-lg font-semibold text-gray-800">Product sales going on</p>
                                            <p className="text-sm text-gray-600">from Sep 7 - Oct 30</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Add Product and Add Service Buttons */}
                                <div className="flex justify-center gap-4 mt-6 p-4 bg-white rounded-lg shadow-md">
                                    <Button
                                        onClick={handleAddProduct}
                                        className="py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                                        style={{ backgroundColor: brandColor, color: contrastTextColor }}
                                    >
                                        <PlusCircle size={16} className="mr-2" />
                                        Add Product
                                    </Button>
                                    <Button
                                        onClick={handleAddService}
                                        className="py-2 px-4 rounded-lg flex items-center justify-center transition-colors border border-gray-300"
                                        style={{ backgroundColor: 'transparent', color: brandColor }}
                                    >
                                        <PlusCircle size={16} className="mr-2" />
                                        Add Service
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* Social Media Links */}
                        <StoreSocialLinks isLoggedIn={isLoggedIn} />

                        {/* "Shop with ease on Sasha Stores" Promotional Banner */}
                        <PromotionalBanner
                            storeName={storeData.promotionalStoreName}
                            onButtonClick={handleShopNowClick}
                            imageUrl={storeData.promotionalBannerImageUrl}
                        />

                        {/* InfoBox - Tailored for public viewer (if not the owner) */}

                    </div>

                    {/* Right Column: Products/SocialFeed/Reviews */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Store Tabs (Products, SocialFeed, Reviews) */}
                        <StoreTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            brandColor={brandColor}
                            contrastTextColor={contrastTextColor}
                        />

                        {/* Conditional Content based on activeTab */}
                        {activeTab === 'Products' && (
                            <>
                                {/* Product Search Bar and Filter */}
                                <div className="flex items-center mb-6">
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Search store products"
                                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                            value={productSearchTerm}
                                            onChange={(e) => setProductSearchTerm(e.target.value)}
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
                                    </div>
                                    <button className="ml-4 p-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                    </button>
                                </div>

                                {/* Store Products Grid */}
                                <StoreProductsGrid
                                    products={filteredProducts}
                                    brandColor={brandColor}
                                    contrastTextColor={contrastTextColor}
                                    onAddToCart={handleAddToCart}
                                />
                            </>
                        )}

                        {activeTab === 'SocialFeed' && (
                            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600 min-h-[300px] flex items-center justify-center">
                                <p>Social Feed content will go here.</p>
                            </div>
                        )}

                        {activeTab === 'Reviews' && (
                            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600 min-h-[300px] flex items-center justify-center">
                                <p>Customer Reviews will be displayed here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default StoreProfileModal;
