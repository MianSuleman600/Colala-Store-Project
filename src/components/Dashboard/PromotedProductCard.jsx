// src/components/Dashboard/PromotedProductCard.jsx
import React from 'react';
import ProductDisplayCard from '../../components/products/ProductDisplayCard';
import SponsoredIconPng from '../../assets/icons/Sponsored.png';

/**
 * PromotedProductCard Component
 * A wrapper around ProductDisplayCard that adds a "Sponsored" tag overlay.
 * It ensures the wrapped ProductDisplayCard only shows the "View Details" button.
 *
 * @param {object} props
 * @param {object} props.product - The product object to pass to ProductDisplayCard.
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastTextColor - The text color that contrasts well with brandColor.
 * @param {function} [props.onViewDetailsClick=() => {}] - Callback to open the promoted product details modal.
 */
const PromotedProductCard = ({ product, brandColor, contrastTextColor, onViewDetailsClick = () => {} }) => { // Added default empty function
    return (
        <div className="relative">
            {/* "Sponsored" Tag Overlay */}
            <div className="absolute top-3 left-3 bg-yellow-400 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-md z-10">
                <img src={SponsoredIconPng} alt="Sponsored" className="h-4 w-auto mr-1" />Sponsored
            </div>
            {/* Render the original ProductDisplayCard, passing the correct prop name */}
            <ProductDisplayCard
                product={product}
                brandColor={brandColor}
                contrastTextColor={contrastTextColor}
                mode="promoted"
                onViewDetailsClick={() => onViewDetailsClick(product)} // This will now always call a function
            />
        </div>
    );
};

export default PromotedProductCard;
