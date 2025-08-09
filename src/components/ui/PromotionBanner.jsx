// src/components/ui/PromotionalBanner.jsx
import React from 'react';
import Button from './Button'; // Assuming Button component path: src/components/ui/Button.jsx
import { useGetStoreProfileQuery } from '../../services/storeProfileApi'; // Import the RTK Query hook
import { useSelector } from 'react-redux'; // Import useSelector to get userId
import shoppingBagImage from '../../assets/images/bag.png'; // Local image asset

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

    // Remove '#' if present
    const cleanHex = hexcolor.startsWith('#') ? hexcolor.slice(1) : hexcolor;

    // Handle shorthand hex codes (e.g., #FFF)
    const expandedHex = cleanHex.length === 3
        ? cleanHex.split('').map(char => char + char).join('')
        : cleanHex;

    // Parse R, G, B values
    const r = parseInt(expandedHex.substring(0, 2), 16);
    const g = parseInt(expandedHex.substring(2, 4), 16);
    const b = parseInt(expandedHex.substring(4, 6), 16);

    // Calculate luminance (perceived brightness)
    // Formula: (0.299*R + 0.587*G + 0.114*B) / 255
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Use a threshold to decide between dark and light text
    // A common threshold is 0.5, but 0.4 or 0.6 can be used depending on preference
    return luminance > 0.5 ? '#000000' : '#FFFFFF'; // Return black for light background, white for dark
};

/**
 * Helper function to lighten or darken a hex color.
 * @param {string} hex - The hex color string (e.g., '#RRGGBB').
 * @param {number} percent - The percentage to lighten (positive) or darken (negative).
 * @returns {string} The adjusted hex color.
 */
const adjustBrightness = (hex, percent) => {
    if (!hex || typeof hex !== 'string') {
        return '#000000'; // Default to black if color is invalid
    }

    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    // Pad to 6 characters if shorthand is used (e.g., #F00 -> #FF0000)
    const fullHex = cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex;

    let r = parseInt(fullHex.substring(0, 2), 16);
    let g = parseInt(fullHex.substring(2, 4), 16);
    let b = parseInt(fullHex.substring(4, 6), 16);

    r = Math.min(255, Math.max(0, r + percent));
    g = Math.min(255, Math.max(0, g + percent));
    b = Math.min(255, Math.max(0, b + percent));

    // Convert back to hex and pad with leading zeros if necessary
    return '#' +
        ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase();
};

/**
 * PromotionalBanner Component
 * Displays a promotional banner with a title, description, and a call-to-action button,
 * dynamically styled using the store's brand color and displaying the promotional banner image.
 *
 * @param {object} props
 * @param {string} [props.storeName] - The name of the store to display in the main title. If not provided,
 * it will attempt to fetch it from the store profile.
 * @param {string} [props.titlePrefix='Shop with ease on'] - The prefix text before the store name in the title.
 * @param {string} [props.description='Shop from a variety of stores for your retail or wholesale products'] - The descriptive text below the title.
 * @param {string} [props.buttonText='Shop Now'] - The text displayed on the call-to-action button.
 * @param {function} [props.onButtonClick] - Callback function to be executed when the "Shop Now" button is clicked.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes to apply to the main banner container.
 */
const PromotionalBanner = ({
    storeName: propStoreName, // Renamed to avoid conflict with fetched storeName
    titlePrefix = 'Shop with ease on',
    description = 'Shop from a variety of stores for your retail or wholesale products',
    buttonText = 'Shop Now',
    onButtonClick,
    className = ''
}) => {
    // Get userId from Redux
    const { userId, isLoggedIn, userName } = useSelector((state) => state.user);

    // Fetch the store profile data using the userId
    const { data: storeProfile, isLoading, error } = useGetStoreProfileQuery(userId, {
        skip: !isLoggedIn || !userId, // Skip the query if user is not logged in or userId is not available
    });

    // Determine the actual store name to display
    const currentStoreName = propStoreName || storeProfile?.name || userName || 'Our Store'; // Fallback to userName then a generic name

    // Determine the brand color, with a fallback to a default if not yet loaded
    const brandColor = storeProfile?.brandColor || '#EF4444'; // Use '#EF4444' as a default if not available

    // Determine the contrasting text color for elements on the brandColor background
    const contrastTextColor = getContrastTextColor(brandColor);

    // Determine a slightly darker shade of the brand color for the curves
    const curveColor = adjustBrightness(brandColor, -20); // Darken by 20 units (adjust as needed)

    // Determine the promotional banner image URL
    // Use the fetched URL, otherwise fall back to the local image
    const promotionalImageUrl = storeProfile?.promotionalBannerImageUrl || shoppingBagImage;

    // You might want to show a loading state or error state for the banner itself
    if (isLoading && isLoggedIn && userId) {
        return (
            <div className={`relative w-full rounded-2xl p-6 md:p-8 lg:p-10 flex items-center justify-center bg-gray-100 shadow-lg ${className}`}>
                <p className="text-gray-600">Loading banner...</p>
            </div>
        );
    }

    if (error && isLoggedIn && userId) {
        console.error("Error fetching store profile for PromotionalBanner:", error);
        // You can render a fallback banner or just nothing
        return (
            <div
                className={`relative w-full rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-lg ${className}`}
                style={{ backgroundColor: '#ccc' }} // Fallback background color
            >
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0 md:w-1/2 lg:w-2/3">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl mb-3 leading-tight text-gray-800">
                        Welcome to Our Store!
                    </h2>
                    <p className="text-sm md:text-base lg:text-lg mb-6 max-w-md text-gray-700">
                        Discover amazing products.
                    </p>
                    <Button
                        onClick={onButtonClick}
                        className="bg-white py-3 px-8 rounded-2xl text-base hover:bg-gray-100 transition-colors shadow-md text-gray-800"
                    >
                        Shop Now
                    </Button>
                </div>
                 <div className="relative z-10 md:w-1/2 lg:w-1/3 flex justify-center items-center">
                    <img
                        src={shoppingBagImage} // Fallback to default image
                        alt="Shopping Bag"
                        className="w-40 md:w-48 lg:w-60 h-auto object-contain drop-shadow-xl"
                    />
                </div>
            </div>
        );
    }


    return (
        <div
            className={`relative w-full rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-lg ${className}`}
            style={{ backgroundColor: brandColor }} // Apply the dynamic brand color to the banner background
        >
            {/* Top-left curve/shape - Apply curveColor */}
            {/* The absolute positioning and sizes might need fine-tuning with actual design */}
            <div
                className="absolute -top-37 -left-1 w-55 rounded-bl-4xl rounded-br-full h-50 transform z-0"
                style={{ backgroundColor: curveColor }} // Apply dynamic curve color
            ></div>
            <div
                className="absolute -bottom-28 left-0 w-60 rounded-t-full rounded-br-3xl h-50 rotate-45 transform z-0"
                style={{ backgroundColor: curveColor }} // Apply dynamic curve color
            ></div>

            {/* Content Section (Text and Button) */}
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0 md:w-1/2 lg:w-2/3">
                <h2
                    className="text-2xl md:text-3xl lg:text-4xl mb-3 leading-tight"
                    style={{ color: contrastTextColor }} // Apply contrasting text color
                >
                    {titlePrefix} <span style={{ fontFamily: 'Oleo Script', color: contrastTextColor }}>{currentStoreName}</span>
                </h2>
                <p
                    className="text-sm md:text-base lg:text-lg mb-6 max-w-md"
                    style={{ color: contrastTextColor }} // Apply contrasting text color
                >
                    {description}
                </p>
                <Button
                    onClick={onButtonClick}
                    // Button background remains white for contrast, text color becomes the brand color
                    className="bg-white py-3 px-8 rounded-2xl text-base hover:bg-gray-100 transition-colors shadow-md"
                    style={{ color: brandColor }} // Apply brand color to button text
                >
                    {buttonText}
                </Button>
            </div>

            {/* Image Section (Promotional Banner Image) */}
            <div className="relative z-10 md:w-1/2 lg:w-1/3 flex justify-center items-center">
                <img
                    src={promotionalImageUrl} // Use the fetched promotional banner image
                    alt="Promotional Banner"
                    className="w-40 md:w-48 lg:w-60 h-auto object-contain drop-shadow-xl"
                    // Fallback for image loading errors: displays a grey placeholder
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200/cccccc/333333?text=Promo+Image"; }}
                />
            </div>
        </div>
    );
};

export default PromotionalBanner;