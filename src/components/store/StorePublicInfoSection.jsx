import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';
import { UserPlus, ExternalLink } from 'lucide-react'; // Import UserPlus and ExternalLink icons

// Import local image assets
import callIcon from '../../assets/icons/call.png';
import msgIcon from '../../assets/icons/msg.png';
import locationIcon from '../../assets/icons/location.png';
import shopIcon from '../../assets/icons/shop.png';
import starIcon from '../../assets/icons/star.png';
import varifyIcon from '../../assets/icons/varified.png'; // Verified icon
import productIcon from '../../assets/icons/product.png';
// megaphoneIcon and shoppingCartIcon are not directly used in the public section for the banner

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
 * StorePublicInfoSection Component
 * Displays detailed store information for a public viewer, including follow functionality
 * and open/close status.
 *
 * @param {object} props
 * @param {object} props.storeData - Object containing store details (name, email, phoneNumber, etc.).
 * @param {boolean} props.isLoggedIn - Indicates if the *viewer* is logged in.
 * @param {function} props.handleLoginClick - Callback to navigate to login page (if not logged in).
 * @param {string} props.brandColor - The primary brand color for theming.
 * @param {string} props.contrastTextColor - The text color that contrasts well with the brandColor.
 * @param {string} props.lightBrandColor - A lighter shade of the brand color.
 * @param {boolean} props.isFollowing - State indicating if the current viewer is following the store.
 * @param {function} props.handleFollowToggle - Callback to toggle follow status.
 */
const StorePublicInfoSection = ({
    storeData,
    isLoggedIn,
    handleLoginClick,
    brandColor,
    contrastTextColor,
    lightBrandColor,
    isFollowing,
    handleFollowToggle,
}) => {
    return (
        <Card className="p-6">
            {/* Store Name, Verified, Open Status, and Follow Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-0">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        {/* CORRECTED: Use storeData.storeName instead of storeData.name */}
                        {storeData.name}
                        {/* Verified icon always shown if the store itself is verified, not just if viewer is logged in */}
                        <img src={varifyIcon} alt="Verified" className="w-5 h-5 ml-2" />
                    </h3>
                    {/* Open Now Status */}
                    <p className="flex items-center text-sm text-green-600 sm:ml-4 mt-1 sm:mt-0">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
                        {storeData.isOpen ? `Open Now - ${storeData.openTime} - ${storeData.closeTime}` : 'Closed'}
                    </p>
                </div>
                {/* Follow Button - Only shown to logged-in users who are not the owner */}
                <Button
                    onClick={handleFollowToggle}
                    className={`py-2 px-6 rounded-lg flex items-center justify-center transition-colors text-white
                        ${isFollowing ? 'bg-gray-500 hover:bg-gray-600' : 'hover:opacity-90'}`}
                    style={!isFollowing ? { backgroundColor: brandColor } : {}} // Use purple for follow
                    disabled={!isLoggedIn} // Disable if the viewer is not logged in
                >
                    <UserPlus size={16} className={`mr-2 ${isFollowing ? 'text-white' : 'text-white'}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                </Button>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 mb-4">
                <p className="flex items-center text-sm text-gray-600">
                    <img src={msgIcon} alt="Email Icon" className="w-4 h-4 mr-2" />
                    {storeData.email}
                </p>
                {/* Conditionally show phone number on profile if configured by store owner */}
                {storeData.showPhoneOnProfile && (
                    <p className="flex items-center text-sm text-gray-600">
                        <img src={callIcon} alt="Phone Icon" className="w-4 h-4 mr-2" />
                        {storeData.phoneNumber}
                    </p>
                )}
                <p className="flex items-center text-sm text-gray-600">
                    <img src={locationIcon} alt="Location Icon" className="w-4 h-4 mr-2" />
                    {storeData.location}
                    {/* View Store Addresses Link - for public to find physical location */}
                    <Button
                        className="ml-2 text-sm font-medium hover:underline"
                        style={{ color: brandColor }}
                        onClick={() => console.log('View Store Addresses clicked (Public View)')}
                    >
                        View Store Addresses
                    </Button>
                </p>
                {/* Categories Section */}
                <p className="flex items-center text-sm text-gray-600 flex-wrap">
                    <img src={shopIcon} alt="Category Icon" className="w-4 h-4 mr-2" />
                    Category:
                    {Array.isArray(storeData.category) ? (
                        <div className="flex flex-wrap gap-2 ml-1">
                            {storeData.category.map((cat, index) => (
                                <span
                                    key={index}
                                    className={`px-3 py-1 rounded-full text-xs flex items-center border
                                        ${cat === 'Electronics' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                            cat === 'Phones' ? 'bg-red-100 text-red-700 border-red-300' :
                                                'bg-gray-100 text-gray-700 border-gray-300'}
                                    `}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="ml-1">{storeData.category}</span>
                    )}
                </p>
            </div>

            {/* Stats Section (Public View - also relevant for customers) */}
            <div className="flex flex-col relative items-center border-t border-b border-gray-200 py-4 mb-4 text-center ">
                <div className="flex justify-around w-full divide-x divide-gray-300 mb-4">
                    {/* Products */}
                    <div className="flex flex-col items-center px-4">
                        <p className="flex items-center text-xl font-bold text-gray-800 space-x-2">
                            <img src={productIcon} alt="Products" className="w-5 h-5 mr-1" />
                            <span>{storeData.productsCount}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Products</p>
                    </div>

                    {/* Reviews */}
                    <div className="flex flex-col items-center px-4">
                        <p className="flex items-center text-xl font-bold text-gray-800 space-x-2">
                            <img src={starIcon} alt="Reviews" className="w-5 h-5 mr-1" />
                            <span>{storeData.reviewsCount}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Reviews</p>
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col items-center px-4">
                        <p className="flex items-center text-xl font-bold text-gray-800 space-x-2">
                            <img src={starIcon} alt="Rating" className="w-5 h-5 mr-1" />
                            <span>{storeData.rating}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Rating</p>
                    </div>
                </div>


            </div>
            {/* No "Add Product/Service" buttons here, as this is for public viewing */}
        </Card>
    );
};

export default StorePublicInfoSection;
