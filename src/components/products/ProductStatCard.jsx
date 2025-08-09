// src/components/products/ProductStatCard.jsx
import React from 'react';
// Removed Card import as it's not strictly necessary if div with classes is sufficient
import { BarChart2 } from 'lucide-react'; // Using Lucide React icon as per previous updates and screenshot

/**
 * ProductStatCard Component
 * Displays a single statistic with a title, value, and a small chart icon.
 * Matches the design in 'image_9e9943.png'.
 *
 * @param {object} props
 * @param {string} props.title - The title of the statistic (e.g., "Views").
 * @param {number|string} props.value - The value of the statistic (e.g., 200).
 * @param {string} props.brandColor - The primary brand color for styling (for the small vertical bar).
 */
const ProductStatCard = ({ title, value, brandColor }) => { // Ensure brandColor is destructured
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col items-start justify-between h-24"> {/* Adjusted padding, background, border, and fixed height */}
            <div className="flex items-center justify-between w-full mb-2">
                {/* Small vertical bar on the left, using brandColor */}
                <div className="w-1 h-4 rounded-full mr-2" style={{ backgroundColor: brandColor }}></div>
                <h4 className="text-sm font-medium text-gray-600 flex-1">{title}</h4>
                {/* Chart icon */}
                <BarChart2 size={16} className="text-gray-400" /> {/* Using BarChart2 from lucide-react */}
            </div>
            {/* Value is larger and bold, title is smaller below it */}
            <span className="text-xl font-bold text-gray-800">{value}</span>
        </div>
    );
};

export default ProductStatCard;
