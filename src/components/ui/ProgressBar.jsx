// src/components/ui/ProgressBar.jsx
import React from 'react';

/**
 * ProgressBar Component
 * Displays a simple horizontal progress bar with dynamic branding.
 *
 * @param {object} props
 * @param {number} props.percentage - The completion percentage (0-100).
 * @param {string} [props.brandColor='#EF4444'] - The brand color in hex format (e.g., '#FF0000').
 */
const ProgressBar = ({ percentage, brandColor = '#EF4444' }) => {
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${clampedPercentage}%`, backgroundColor: brandColor }} // Use inline style for dynamic hex color
            ></div>
        </div>
    );
};

export default ProgressBar;
