// src/components/ui/ActionCard.jsx
import React from 'react';
import Card from './Card'; // Assuming Card is in the same directory

/**
 * Helper function to lighten or darken a hex color.
 * This is duplicated here for self-containment, but ideally, you'd have a shared utils file.
 * @param {string} hex - The hex color string (e.g., '#RRGGBB').
 * @param {number} amount - The absolute amount to lighten (positive) or darken (negative) each RGB component (0-255).
 * @returns {string} The adjusted hex color.
 */
const adjustBrightness = (hex, amount) => {
    if (!hex || typeof hex !== 'string') {
        return '#000000'; // Default to black if color is invalid
    }

    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    // Pad to 6 characters if shorthand is used (e.g., #F00 -> #FF0000)
    const fullHex = cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex;

    let r = parseInt(fullHex.substring(0, 2), 16);
    let g = parseInt(fullHex.substring(2, 4), 16);
    let b = parseInt(fullHex.substring(4, 6), 16);

    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));

    // Convert back to hex and pad with leading zeros if necessary
    return '#' +
        ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase();
};

/**
 * ActionCard Component (Optimized)
 * A card displaying an icon, title, and description.
 * The entire card is clickable and can be themed with a brand color.
 *
 * @param {object} props
 * @param {string} props.icon - The source URL for the icon image (e.g., .png, .svg).
 * @param {string} props.title - The title of the action card.
 * @param {string} props.description - A brief description.
 * @param {function} [props.onClick] - Callback function when the card is clicked.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes for the card wrapper.
 * @param {boolean} [props.isGuestView=false] - If true, applies styling for a guest/disabled view.
 * @param {string} [props.brandColor='#EF4444'] - The primary brand color for theming.
 * @param {string} [props.contrastTextColor='#FFFFFF'] - The text color that contrasts well with the brandColor.
 */
const ActionCard = ({
    icon,
    title,
    description,
    onClick,
    className = '',
    isGuestView = false,
    brandColor = '#EF4444', // Default brand color if not provided
    contrastTextColor = '#FFFFFF' // Default contrast color if not provided
}) => {
    // Calculate a lighter version of the brand color for the icon background
    const iconBgColor = adjustBrightness(brandColor, 200); // Lighten by 200 units

    return (
        // Make the entire Card clickable and apply external className
        <Card
            className={`p-6 flex flex-col items-start justify-start text-left rounded-2xl shadow-sm bg-white cursor-pointer transition-all duration-200
                ${className} ${isGuestView ? 'hover:bg-white' : 'hover:bg-gray-50'}`} // Prevent hover effect in guest mode if opacity is applied
            onClick={onClick}
        >
            {/* Icon Container - Apply dynamic background color */}
            <div
                className="p-3 rounded-full mb-4 flex items-center justify-center"
                style={{ backgroundColor: iconBgColor }}
            >
                {/* * Optimization: Added width and height attributes.
                  * This is crucial for preventing Cumulative Layout Shift (CLS).
                  * The values are based on the existing w-6 h-6 classes (which equals 24px).
                  * Added `loading="lazy"` as a best practice, especially if this component
                  * appears below the fold.
                */}
                <img 
                    src={icon} 
                    alt={title + ' icon'} 
                    className="w-6 h-6 object-contain" 
                    width={24}
                    height={24}
                    loading="lazy"
                />
            </div>
            {/* Title - Apply dynamic text color based on guest view or brand color */}
            <h3
                className={`text-md mb-2 ${isGuestView ? 'text-gray-500' : ''}`}
                style={!isGuestView ? { color: brandColor } : {}}
            >
                {title}
            </h3>
            {/* Description - Remains gray for now, can be made dynamic if needed */}
            <p className="text-sm text-gray-600">{description}</p>
        </Card>
    );
};

export default ActionCard;
