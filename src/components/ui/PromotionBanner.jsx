// src/components/ui/PromotionalBanner.jsx
import React from 'react';
import Button from './Button';
import { useGetStoreProfileQuery } from '../../services/storeProfileApi';
import { useSelector } from 'react-redux';
import shoppingBagImage from '../../assets/images/bag.png';

/**
 * Get contrast text color for background
 */
const getContrastTextColor = (hexcolor) => {
    if (!hexcolor || typeof hexcolor !== 'string') {
        return '#FFFFFF';
    }
    const cleanHex = hexcolor.startsWith('#') ? hexcolor.slice(1) : hexcolor;
    const expandedHex =
        cleanHex.length === 3
            ? cleanHex.split('').map((char) => char + char).join('')
            : cleanHex;

    const r = parseInt(expandedHex.substring(0, 2), 16);
    const g = parseInt(expandedHex.substring(2, 4), 16);
    const b = parseInt(expandedHex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Lighten a hex color
 */
const lightenColor = (hex, percent) => {
    const num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;

    r = r < 255 ? (r < 0 ? 0 : r) : 255;
    g = g < 255 ? (g < 0 ? 0 : g) : 255;
    b = b < 255 ? (b < 0 ? 0 : b) : 255;

    return '#' + (b | (g << 8) | (r << 16)).toString(16).padStart(6, '0');
};

const PromotionalBanner = ({
    storeName: propStoreName,
    titlePrefix = 'Shop with ease on',
    description = 'Shop from a variety of stores for your retail or wholesale products',
    buttonText = 'Shop Now',
    onButtonClick,
    className = ''
}) => {
    const { userId, isLoggedIn, userName } = useSelector((state) => state.user);
    const { data: storeProfile, isLoading, error } = useGetStoreProfileQuery(userId, {
        skip: !isLoggedIn || !userId,
    });

    const currentStoreName =
        // Corrected: Use storeProfile?.storeName instead of storeProfile?.name
        propStoreName || storeProfile?.storeName || userName || 'Our Store';

    const brandColor = storeProfile?.brandColor || '#EF4444';
    const contrastTextColor = getContrastTextColor(brandColor);
    const lighterCurveColor = lightenColor(brandColor, 40); // 40 = slightly lighter shade

    const promotionalImageUrl =
        storeProfile?.promotionalBannerImageUrl || shoppingBagImage;

    if (isLoading && isLoggedIn && userId) {
        return (
            <div
                className={`relative w-full rounded-2xl p-6 md:p-8 lg:p-10 flex items-center justify-center bg-gray-100 shadow-lg ${className}`}
            >
                <p className="text-gray-600">Loading banner...</p>
            </div>
        );
    }

    if (error && isLoggedIn && userId) {
        console.error("Error fetching store profile for PromotionalBanner:", error);
        return (
            <div
                className={`relative w-full rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-lg ${className}`}
                style={{ backgroundColor: '#ccc' }}
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
                        className="w-full sm:w-auto bg-white py-3 px-8 rounded-2xl text-base hover:bg-gray-100 transition-colors shadow-md text-gray-800"
                    >
                        Shop Now
                    </Button>
                </div>
                <div className="relative z-10 w-full md:w-1/2 lg:w-1/3 flex justify-center items-center mt-6 md:mt-0">
                    <img
                        src={shoppingBagImage}
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
            style={{ backgroundColor: brandColor }}
        >
            {/* Curved shapes */}
            <div
                className="absolute top-0 left-0 w-40 h-40"
                style={{
                    backgroundColor: lighterCurveColor,
                    borderBottomRightRadius: '100%',
                    transform: 'translate(-5%, -20%)',
                    zIndex: 0,
                }}
            ></div>

            <div
                className="absolute bottom-0 left-0 w-40 h-40"
                style={{
                    backgroundColor: lighterCurveColor,
                    borderTopRightRadius: '100%',
                    transform: 'translate(-5%, 30%)',
                    zIndex: 0,
                }}
            ></div>

            {/* Text Section */}
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0 md:w-1/2 lg:w-2/3">
                <h2
                    className="text-2xl md:text-3xl lg:text-4xl mb-3 leading-tight"
                    style={{ color: contrastTextColor }}
                >
                    {titlePrefix}{' '}
                    <span style={{ fontFamily: 'Oleo Script', color: contrastTextColor }}>
                        {currentStoreName}
                    </span>
                </h2>
                <p
                    className="text-sm md:text-base lg:text-lg mb-6 max-w-md"
                    style={{ color: contrastTextColor }}
                >
                    {description}
                </p>
                <Button
                    onClick={onButtonClick}
                    className="w-full sm:w-auto bg-white py-3 px-8 rounded-2xl text-base hover:bg-gray-100 transition-colors shadow-md"
                    style={{ color: brandColor }}
                >
                    {buttonText}
                </Button>
                </div>

            {/* Image Section */}
            <div className="relative z-10 w-full md:w-1/2 lg:w-1/3 flex justify-center items-center mt-6 md:mt-0">
                <img
                    src={promotionalImageUrl}
                    alt="Promotional Banner"
                    className="w-40 md:w-48 lg:w-60 h-auto object-contain drop-shadow-xl"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                            'https://placehold.co/200x200/cccccc/333333?text=Promo+Image';
                    }}
                />
            </div>
        </div>
    );
};

export default PromotionalBanner;
