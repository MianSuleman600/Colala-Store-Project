// src/components/store/StoreOwnerInfoSection.jsx
import React from 'react';
import Card from '../ui/Card'; // Assuming Card component path
import Button from '../ui/Button'; // Assuming Button component path
import { Link } from 'react-router-dom'; // Assuming you might use Link for navigation
import StoreSocialLinks from './StoreSocialLinks'; // Importing the social links component
import { useNavigate } from 'react-router-dom';

// Icons (assuming you have these or similar)
import {
    MapPinIcon, PhoneIcon, EnvelopeIcon, TagIcon, UserCircleIcon
} from '@heroicons/react/24/outline';
// Importing solid icons for the stats section
// CORRECTED IMPORT AND USAGE:
import VerifiedIcon from '../../assets/icons/varified.png'; // Renamed import for clarity
import MegaphoneIcon from '../../assets/icons/Megaphone.png'
import ShoppingBagIcon from '../../assets/icons/shop.png';
import UsersIcon from '../../assets/icons/profile.png';
import  StarIcon from '../../assets/icons/star.png'



/**
 * StoreOwnerInfoSection Component
 * Displays the store owner's profile information, statistics, social links,
 * and action buttons, matching the design in aa.png.
 *
 * @param {object} props
 * @param {object} props.storeData - Object containing store profile data.
 * @param {boolean} props.isLoggedIn - True if the user is logged in.
 * @param {function} props.handleOpenStoreBuilder - Handler for "Store Builder" button (might be repurposed or removed).
 * @param {function} props.handleLoginClick - Handler for "Login Now" button (guest view).
 * @param {string} props.brandColor - Primary brand color (e.g., '#FF0000').
 * @param {string} props.contrastTextColor - Text color for contrast (e.g., '#FFFFFF' or '#000000').
 * @param {string} props.lightBrandColor - Lighter shade of brand color for backgrounds.
 */
const StoreOwnerInfoSection = ({
    storeData,
    isLoggedIn,
    handleOpenStoreBuilder,
    handleLoginClick,
    brandColor,
    contrastTextColor,
    lightBrandColor,
}) => {
    // Define common styles based on brand colors
    const brandBgStyle = { backgroundColor: brandColor };
    const brandTextStyle = { color: brandColor };
    const contrastBgStyle = { backgroundColor: contrastTextColor }; // For contrast background
    const contrastTextStyle = { color: contrastTextColor }; // For contrast text

    // Helper for social media icon links
    const SocialIcon = ({ children, bgColor, link }) => (
        <a href={link} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor} text-white hover:opacity-80 transition-opacity`}>
            {children}
        </a>
    );

    const navigate = useNavigate();

    const defaultStoreData = {
        // CORRECTED: Use storeName from props, falling back to a default
        storeName: storeData?.name || 'Guest Store',
        email: 'sashastores@gmail.com',
        phoneNumber: '070123456789',
        location: 'Lagos, Nigeria',
        categories: ['Electronics', 'Phones'],
        productsSold: 100,
        followers: 500,
        ratings: 4.7,
        salesMessage: 'Product sales going on from Sept 7 - Oct 30',
        socialMediaLinks: {
            whatsapp: '#',
            instagram: '#',
            x: '#',
            facebook: '#',
        },
        latestOrders: [
            { id: '1', name: 'Qamar malik', items: '2 items', price: '9,999,990' },
            { id: '2', name: 'Adewale Chris', items: '2 items', price: '9,999,990' },
            { id: '3', name: 'Adam Sandler', items: '2 items', price: '9,999,990' },
        ],
        profilePictureUrl: null,
    };

    const currentStoreData = { ...defaultStoreData, ...storeData };

    const handleAddProduct = () => {
        console.log('Add Product clicked!');
        navigate('/add-product');
    };

    const handleAddService = () => {
        console.log('Add Service clicked!');
        navigate('/add-service');
    };

    return (
        <Card className={`p-6 ${!isLoggedIn ? 'opacity-70' : ''}`}>
            <div className=" rounded-lg space-y-4">
                {isLoggedIn ? (
                    <>
                        {/* Profile Header (Name and Verified Icon) */}
                        <div className="flex items-center mb-4">
                            {/* Profile Picture Placeholder (replace with actual image if available) */}

                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                {currentStoreData.storeName}
                                {/* CORRECTED: Use img tag for the local image */}
                                <img src={VerifiedIcon} alt="Verified" className="h-5 w-5 ml-2" />
                            </h3>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-2 mb-4">
                            <p className="flex items-center text-sm text-gray-600">
                                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" /> {currentStoreData.email}
                            </p>
                            <p className="flex items-center text-sm text-gray-600">
                                <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" /> {currentStoreData.phoneNumber}
                            </p>
                            <p className="flex items-center text-sm text-gray-600">
                                <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" /> {currentStoreData.location}
                            </p>
                            <div className="flex items-center text-sm text-gray-600 flex-wrap">
                                <TagIcon className="h-4 w-4 mr-2 text-gray-500" />
                                <div className="flex flex-wrap gap-2 ml-1">
                                    {Array.isArray(currentStoreData.categories) && currentStoreData.categories.length > 0 ? (
                                        currentStoreData.categories.map((cat, idx) => (
                                            <span key={idx} className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: lightBrandColor, color: contrastTextColor }}>
                                                {cat}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500">No categories added</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Statistics Section */}
                        <div className="grid grid-cols-3 text-center  bg-white rounded-2xl pt-4 shadow-lg overflow-hidden">

                            {/* Qty Sold */}
                            <div className="flex flex-col items-center border-r border-gray-300">
                                <img src={ShoppingBagIcon} className="h-6 w-6 text-gray-500 mb-1" />
                                <span className="font-semibold text-gray-800">{currentStoreData.productsSold}</span>
                                <span className="text-xs text-gray-500">Qty Sold</span>
                            </div>

                            {/* Followers */}
                            <div className="flex flex-col items-center border-r border-gray-300">
                                <img src={UsersIcon} className="h-6 w-6 text-gray-500 mb-1" />
                                <span className="font-semibold text-gray-800">{currentStoreData.followers}</span>
                                <span className="text-xs text-gray-500">Followers</span>
                            </div>

                            {/* Ratings */}
                            <div className="flex flex-col items-center">
                                <img src={StarIcon} className="h-6 w-6 text-gray-500 mb-1" />
                                <span className="font-semibold text-gray-800">{currentStoreData.ratings}</span>
                                <span className="text-xs text-gray-500">Ratings</span>
                            </div>

                            {/* Sales Banner */}
                            <div
                                className="col-span-3 flex items-center justify-center shadow-2xl gap-2 w-full p-2 rounded-b-2xl 
        text-sm sm:text-base flex-wrap sm:flex-nowrap text-center"
                                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                            >
                                <img
                                    src={MegaphoneIcon}
                                    alt=""
                                    className="h-4 w-4 flex-shrink-0"
                                    
                                />
                                <span className="break-words">{currentStoreData.salesMessage}</span>
                            </div>
                        </div>





                        {/* Social Media Icons */}
                        <StoreSocialLinks isLoggedIn={isLoggedIn} />

                        {/* Action Buttons: Add Product, Add Service */}
                        <div className="flex space-x-4 mt-4">
                            <Button
                                onClick={handleAddProduct}
                                className="flex-1 py-2 px-4 rounded-2xl "
                                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                            >
                                Add Product
                            </Button>
                            <Button
                                onClick={handleAddService}
                                className="flex-1 py-2 px-4 rounded-2xl  bg-black text-white hover:bg-gray-700"
                            >
                                Add Service
                            </Button>
                        </div>
                    </>
                ) : (
                    // Guest View
                    <div className="text-center py-8">
                        <UserCircleIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Guest View</h3>
                        <p className="text-gray-600 mb-4">Login or Register to manage your store profile.</p>
                        <Button
                            onClick={handleLoginClick}
                            className="w-full py-2 px-4 rounded-lg font-semibold"
                            style={{ backgroundColor: brandColor, color: contrastTextColor }}
                        >
                            Login Now
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StoreOwnerInfoSection;
