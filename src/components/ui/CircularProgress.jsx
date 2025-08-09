// src/components/ui/CircularProgress.jsx
import React from 'react';

/**
 * CircularProgress Component
 * Renders a circular progress bar with a percentage display.
 *
 * @param {object} props
 * @param {number} props.percentage - The completion percentage (0-100).
 * @param {number} [props.size=40] - The diameter of the circle in pixels.
 * @param {number} [props.strokeWidth=4] - The width of the progress stroke.
 * @param {string} [props.color='#EF4444'] - The color of the progress stroke.
 * @param {string} [props.textColor='#000000'] - The color of the percentage text.
 */
const CircularProgress = ({ percentage, size = 40, strokeWidth = 4, color = '#EF4444', textColor = '#000000' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            <svg
                className="transform -rotate-90" // Rotate to start stroke from top
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background circle (grey) */}
                <circle
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress circle (colored) */}
                <circle
                    className="transition-all duration-500 ease-out" // Smooth transition for percentage changes
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round" // Makes the ends of the stroke rounded
                />
            </svg>
            <span
                className="absolute text-sm font-bold"
                style={{ color: textColor }}
            >
                {`${percentage}%`}
            </span>
        </div>
    );
};

export default CircularProgress;
