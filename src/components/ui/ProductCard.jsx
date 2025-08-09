// src/components/ui/ProductCard.jsx
import React, { useState } from 'react';
import { Star, MapPin, Truck, Check } from 'lucide-react';
import SponsoredTagIcon from '../../assets/icons/sponsored.png';
import shoppingCartIcon from '../../assets/icons/shopping-cart.png';
import shopIcon from '../../assets/icons/shoppp.png';
import { useDispatch } from 'react-redux';
import { addItem } from '../../features/cart/cartSlice';

/**
 * Helper function to determine contrast text color (black or white)
 * based on the background color's luminance.
 * @param {string} hexcolor - The background color in hex format (e.g., '#RRGGBB').
 * @returns {string} The contrast text color ('#000000' for dark background, '#FFFFFF' for light background).
 */
const getContrastTextColor = (hexcolor) => {
    if (!hexcolor || typeof hexcolor !== 'string') {
        return '#FFFFFF';
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
 * ProductCard Component
 * Displays a single product with its image, details, and an add-to-cart button.
 *
 * @param {object} props
 * @param {object} props.product - The product object containing all details.
 * @param {string} props.product.imageUrl - URL of the product image.
 * @param {string} props.product.title - Name/title of the product.
 * @param {number} props.product.currentPrice - The current selling price.
 * @param {number} [props.product.oldPrice] - The old price (for strike-through).
 * @param {string} props.product.storeName - The name of the store selling the product.
 * @param {string} [props.product.storeAvatar] - URL for the store's avatar/logo.
 * @param {number} [props.product.storeRating=0] - The rating of the store.
 * @param {string} props.product.location - The location of the product/store.
 * @param {boolean} [props.product.isSponsored=false] - Whether the product is sponsored.
 * @param {boolean} [props.product.hasFreeDelivery=false] - Whether the product offers free delivery.
 * @param {string} [props.product.bulkDiscountText] - Text for bulk discount.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes for the card wrapper.
 * @param {string} [props.brandColor='#EF4444'] - The primary brand color for theming.
 * @param {string} [props.accentColor='#FF8C00'] - The accent color for badges.
 */
const ProductCard = ({
    product,
    className = '',
    brandColor = '#EF4444',
    accentColor = '#FF8C00'
}) => {
    const dispatch = useDispatch();
    const [isAdded, setIsAdded] = useState(false);

    const {
        imageUrl,
        title,
        currentPrice,
        oldPrice,
        storeName,
        storeAvatar = 'https://placehold.co/24x24/999999/FFFFFF?text=S',
        storeRating = 0,
        location,
        isSponsored = false,
        hasFreeDelivery = false,
        bulkDiscountText
    } = product;

    const handleAddToCart = () => {
        dispatch(addItem(product));
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000); // Hide message after 2 seconds
    };

    const badgeContrastTextColor = getContrastTextColor(accentColor);
    const mainBrandContrastTextColor = getContrastTextColor(brandColor);

    return (
        <div className={`relative bg-white w-full rounded-xl shadow-md overflow-hidden ${className}`}>
            {isSponsored && (
                <span className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-full z-10 flex items-center">
                    <img
                        src={SponsoredTagIcon}
                        alt="Sponsored"
                        className="w-3.5 h-3.5 mr-1"
                        width={14} // Added width to prevent CLS
                        height={14} // Added height to prevent CLS
                        loading="lazy" // Use lazy loading
                    />
                    Sponsored
                </span>
            )}

            <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    width={400} // Added a placeholder width to reserve space
                    height={192} // Added a fixed height based on your h-48 class (192px)
                    loading="lazy" // Lazy loading is perfect for product cards
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x192/cccccc/333333?text=Product+Image"; }}
                />
            </div>

            <div className="p-4 relative">
                <div className="flex items-center text-sm mb-2">
                    <img
                        src={storeAvatar}
                        alt={storeName}
                        className="w-6 h-6 rounded-full mr-2 object-cover"
                        width={24} // Added width to prevent CLS
                        height={24} // Added height to prevent CLS
                        loading="lazy" // Use lazy loading
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/24x24/999999/FFFFFF?text=S"; }}
                    />
                    <span className="font-medium" style={{ color: brandColor }}>{storeName}</span>
                    {storeRating > 0 && (
                        <>
                            <Star size={14} fill={brandColor} stroke="none" className="ml-auto mr-1" />
                            <span className="font-semibold text-sm" style={{ color: brandColor }}>{storeRating.toFixed(1)}</span>
                        </>
                    )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                    {title}
                </h3>

                <div className="flex items-baseline mb-3">
                    <span className="text-xl font-bold mr-2" style={{ color: brandColor }}>
                        ₦{currentPrice.toLocaleString()}
                    </span>
                    {oldPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            ₦{oldPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
                    {hasFreeDelivery && (
                        <span className="inline-flex items-center text-xs font-semibold overflow-hidden rounded-full">
                            <span className="flex items-center px-2 py-1" style={{ backgroundColor: brandColor, color: getContrastTextColor(brandColor) }}>
                                <img src={shopIcon} alt="Shopping Cart" className="h-[16px] w-6 object-contain" width={24} height={16} loading="lazy" />
                            </span>
                            <span className="px-2 py-1" style={{ backgroundColor: '#FFD700', color: getContrastTextColor('#FFD700') }}>
                                Free delivery
                            </span>
                        </span>
                    )}
                    {bulkDiscountText && (
                        <span className="inline-flex items-center text-xs font-semibold overflow-hidden rounded-full">
                            <span className="flex items-center px-2 py-1 text-white" style={{ backgroundColor: brandColor }}>
                                <img src={shopIcon} alt="Shopping Cart" className="h-[16px] w-5 object-contain" width={20} height={16} loading="lazy" />
                            </span>
                            <span className="px-2 py-1" style={{ backgroundColor: '#FFD700', color: getContrastTextColor('#FFD700') }}>
                                {bulkDiscountText}
                            </span>
                        </span>
                    )}
                </div>

                <p className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    {location}
                </p>

                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-4 right-4 p-3 rounded-full shadow-lg flex items-center justify-center transform transition-transform duration-200 hover:scale-105"
                    style={{ backgroundColor: brandColor }}
                >
                    <img
                        src={shoppingCartIcon}
                        alt="Add to Cart"
                        className="w-6 h-6"
                        width={24} // Added width to prevent CLS
                        height={24} // Added height to prevent CLS
                        loading="lazy" // Use lazy loading
                        style={{ filter: mainBrandContrastTextColor === '#000000' ? 'invert(0)' : 'invert(1)' }}
                    />
                </button>
            </div>
            {isAdded && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-in-out">
                    <Check size={20} />
                    <span>Item added to cart!</span>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
