// src/components/products/ProductListItem.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';

// Icons
import {
    EyeIcon,     
     FireIcon,
       // For View Details
    ChartBarIcon,       // For Product Stat
    EllipsisVerticalIcon // For More Options
} from '@heroicons/react/24/outline';

/**
 * ProductListItem Component
 * Displays a single product as an item in a list, with its image, name, price, status, and actions.
 * This is designed for a list view (e.g., on MyProductsPage).
 *
 * @param {object} props
 * @param {object} props.product - The product object to display.
 * @param {string} props.product.id - Unique ID of the product.
 * @param {string} props.product.imageUrl - URL of the product image.
 * @param {string} props.product.name - Name of the product.
 * @param {number} props.product.price - Original price of the product.
 * @param {number} [props.product.discountPrice] - Optional discount price.
 * @param {string} props.product.status - Current status (e.g., 'Active', 'Draft', 'Sold Out').
 * @param {string} props.product.category - Product category for display.
 * @param {boolean} [props.product.isSponsored=false] - Whether the product is sponsored.
 * @param {string} props.brandColor - Primary brand color for styling.
 * @param {string} props.contrastTextColor - Text color for contrast.
 * @param {string} props.lightBrandColor - Lighter shade of brand color.
 * @param {function} props.onProductStatClick - Callback for Product Stat button.
 * @param {function} props.onMoreOptionsClick - Callback for More Options button.
 */
const ProductListItem = ({
    product,
    brandColor,
    contrastTextColor,
    lightBrandColor,
    onProductStatClick,
    onMoreOptionsClick
}) => {
    const displayPrice = product.discountPrice ? product.discountPrice : product.price;
    const originalPrice = product.discountPrice ? product.price : null;

    return (
        <Card className="flex flex-col sm:flex-row items-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 relative">
            {product.isSponsored && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center">
                    <FireIcon className="h-4 w-4 mr-1 text-orange-400" /> Sponsored
                </div>
            )}
            {/* Product Image */}
            <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mb-4 sm:mb-0 sm:mr-4">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/e0e0e0/000000?text=No+Image"; }}
                    />
                ) : (
                    <span className="text-gray-400 text-center text-sm">No Image</span>
                )}
            </div>

            {/* Product Info */}
            <div className="flex-grow text-center sm:text-left mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <div className="flex items-baseline justify-center sm:justify-start mt-1">
                    <span className="text-xl font-bold" style={{ color: brandColor }}>
                        N{displayPrice.toLocaleString()}
                    </span>
                    {originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                            N{originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: lightBrandColor, color: brandColor }}>
                        {product.category || 'Category'}
                    </span>
                    {/* Placeholder for free delivery / discount tags if needed here */}
                </div>
                {/* Stats as seen in st.png */}
                <div className="mt-3 text-sm text-gray-700">
                    <p>Product Views: <span className="font-semibold">{product.productViews || 0}</span></p>
                    <p>Product Clicks: <span className="font-semibold">{product.productClicks || 0}</span></p>
                    <p>Messages: <span className="font-semibold">{product.messages || 0}</span></p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2 w-full sm:w-auto sm:ml-auto">


                {/* View Details Button (linking to ProductDetailsPage) */}
                <Link to={`/my-products/${product.id}/details`} className="w-full">
                    <Button
                        className="w-full py-2 px-4 rounded-lg flex items-center justify-center text-sm font-medium"
                        style={{ backgroundColor: lightBrandColor, color: brandColor }}
                    >
                        <EyeIcon className="h-4 w-4 mr-2" /> View Details
                    </Button>
                </Link>

                {/* More Options Button */}
                <Button
                    onClick={(e) => onMoreOptionsClick(e, product.id)} // Pass event to position popover
                    className="w-full py-2 px-4 rounded-lg flex items-center justify-center text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                    <EllipsisVerticalIcon className="h-4 w-4 mr-2" /> More Options
                </Button>
            </div>
        </Card>
    );
};

export default ProductListItem;
