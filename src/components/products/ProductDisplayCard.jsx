// src/components/products/ProductDisplayCard.jsx
import React from 'react';
// Removed Link and useNavigate as navigation is now handled by a prop function
import Button from '../ui/Button';
import Card from '../ui/Card';

// Icons
import {
    PencilSquareIcon,  // For Edit
    EllipsisVerticalIcon, // For More Options
    ShoppingCartIcon, // For Free Delivery / Discount in bulk
    FireIcon // For Sponsored tag
} from '@heroicons/react/24/outline';

/**
 * ProductDisplayCard Component
 * Displays a single product with its image, name, price, status,
 * statistics (views, clicks, messages), category, and action buttons.
 * Designed to match the 'pc.png' layout for a detailed product view.
 * Now includes an ellipsis menu for additional actions and an "Out of Stock" overlay.
 * A 'mode' prop controls the visibility of the 'Sponsored' tag and product stats.
 *
 * @param {object} props
 * @param {object} props.product - The product object to display.
 * @param {string} props.product.id - Unique ID of the product.
 * @param {string} props.product.imageUrl - URL of the product image.
 * @param {string} props.product.name - Name of the product.
 * @param {number} props.product.price - Original price of the product.
 * @param {number} [props.product.discountPrice] - Optional discount price.
 * @param {boolean} [props.product.isSponsored=false] - Whether the product is sponsored.
 * @param {number} [props.product.productViews=0] - Number of product views.
 * @param {number} [props.product.productClicks=0] - Number of product clicks.
 * @param {number} [props.product.messages=0] - Number of messages received.
 * @param {string} [props.product.category=''] - Product category.
 * @param {boolean} [props.product.hasFreeDelivery=false] - Indicates free delivery.
 * @param {boolean} [props.product.hasBulkDiscount=false] - Indicates bulk discount.
 * @param {string} [props.product.status='Active'] - Current status (e.g., 'Active', 'Sold Out', 'Unavailable').
 * @param {string} props.brandColor - Primary brand color for styling.
 * @param {string} props.contrastTextColor - Text color for contrast.
 * @param {string} props.lightBrandColor - Lighter shade of brand color for backgrounds.
 * @param {function} props.onEdit - Callback for edit action.
 * @param {function} props.onMoreOptionsClick - Callback to open the MoreOptionsPopover.
 * @param {'default' | 'promoted'} [props.mode='default'] - Controls display of sponsored tag and stats.
 * 'default' shows sponsored tag (if true) and stats.
 * 'promoted' shows sponsored tag (if true) and stats.
 * @param {function} [props.onViewDetailsClick] - Optional callback for "View Details" button in 'promoted' mode.
 */
const ProductDisplayCard = ({
    product,
    brandColor,
    contrastTextColor,
    lightBrandColor,
    onEdit,
    onMoreOptionsClick,
    mode = 'default',
    onViewDetailsClick, // Accept the new prop
}) => {
    // Removed useNavigate as navigation is now handled by onViewDetailsClick
    const displayPrice = product.discountPrice ? product.discountPrice : product.price;
    const originalPrice = product.discountPrice ? product.price : null;

    const productViews = product.productViews || 200;
    const productClicks = product.productClicks || 15;
    const messages = product.messages || 3;

    const isOutOfStock = product.status === 'Sold Out' || product.status === 'Unavailable';

    // Modified handleViewDetails to call the prop function
    const handleViewDetails = () => {
        if (onViewDetailsClick) {
            onViewDetailsClick(product); // Pass the entire product object
        }
    };

    return (
        <Card className="relative flex flex-col p-4 rounded-xl shadow-lg w-full max-w-sm mx-auto ">
            {/* Out of Stock Overlay */}
            {isOutOfStock && (
                <div className="absolute inset-0 bg-black opacity-80 flex flex-col items-center justify-center rounded-xl z-20">
                    <span className="text-white text-2xl font-bold uppercase tracking-wide">
                        Out of Stock
                    </span>
                </div>
            )}

            {/* Main content wrapper */}
            <div className={`relative ${isOutOfStock ? 'pointer-events-none' : ''}`}>
                {/* Image Section with Sponsored Tag */}
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x192/e0e0e0/000000?text=No+Image"; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            No Image Available
                        </div>
                    )}
                    {(mode === 'default' || mode === 'promoted') && product.isSponsored && (
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center">
                            <FireIcon className="h-4 w-4 mr-1 text-orange-400" /> Sponsored
                        </div>
                    )}
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>

                {/* Price Information */}
                <div className="flex items-baseline mb-3">
                    <span className="text-2xl font-bold" style={{ color: brandColor }}>
                        N{displayPrice.toLocaleString()}
                    </span>
                    {originalPrice && (
                        <span className="text-base text-gray-500 line-through ml-2">
                            N{originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Delivery/Discount Tags and Product Statistics */}
                {(mode === 'default' || mode === 'promoted') && (
                    <>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {product.hasFreeDelivery && (
                                <span className="flex items-center rounded-full overflow-hidden shadow-sm">
                                    <span className="p-1 flex items-center justify-center bg-red-500">
                                        <ShoppingCartIcon className="h-4 w-3 text-white" />
                                    </span>
                                    <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1">
                                        Free delivery
                                    </span>
                                </span>
                            )}
                            {product.hasBulkDiscount && (
                                <span className="flex items-center rounded-full overflow-hidden shadow-sm">
                                    <span className="p-1 flex items-center justify-center bg-red-500">
                                        <ShoppingCartIcon className="h-4 w-3 text-white" />
                                    </span>
                                    <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1">
                                        20% Off in bulk
                                    </span>
                                </span>
                            )}
                        </div>
                        <hr className="my-2 border-gray-300" />

                        {/* Product Statistics */}
                        <div className="flex gap-2 flex-col mb-4 text-sm text-gray-700">
                            <div className="flex justify-between items-center">
                                <span>Product Views</span>
                                <span className="font-semibold">{productViews}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Product Clicks</span>
                                <span className="font-semibold">{productClicks}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Messages</span>
                                <span className="font-semibold">{messages}</span>
                            </div>
                        </div>
                    </>
                )}

                {/* Category and Action Buttons */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span
                        className="px-3 py-1 rounded-full text-sm font-medium bg-[#ffcccc] text-white" style={{color:brandColor}}
                    >
                        {product.category || 'Category'}
                    </span>

                    {mode === 'default' ? (
                        <div className="flex space-x-2">
                            <Button
                                onClick={() => onEdit(product.id)}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                                aria-label="Edit Product"
                                disabled={isOutOfStock}
                            >
                                <PencilSquareIcon className="h-5 w-5" />
                            </Button>
                            <Button
                                onClick={(e) => {
                                    console.log("Ellipsis button clicked in ProductDisplayCard!");
                                    onMoreOptionsClick(e, product.id);
                                }}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                                aria-label="More Options"
                                disabled={isOutOfStock}
                            >
                                <EllipsisVerticalIcon className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={handleViewDetails} // This now calls the prop function
                            className="px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
                            style={{ backgroundColor: brandColor, color: contrastTextColor }}
                        >
                            View Details
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ProductDisplayCard;
