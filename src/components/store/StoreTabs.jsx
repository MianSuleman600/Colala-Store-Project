// src/components/store/StoreTabs.jsx
import React from 'react';

/**
 * StoreTabs Component
 * A navigation component for switching between different sections of a store page
 * (e.g., Products, Social Feed, Reviews). This is a placeholder.
 *
 * @param {object} props
 * @param {string} props.activeTab - The currently active tab (e.g., 'Products').
 * @param {function} props.onTabChange - Callback function when a tab is clicked.
 * @param {string} props.brandColor - The primary brand color for theming active tab.
 * @param {string} props.contrastTextColor - The text color that contrasts well with the brandColor.
 */
const StoreTabs = ({ activeTab, onTabChange, brandColor, contrastTextColor }) => {
    const tabs = ['Products', 'SocialFeed', 'Reviews'];

    return (
        <div className="flex bg-white rounded-lg shadow-md p-2 justify-around sm:justify-start sm:space-x-4">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`
                        py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200
                        ${activeTab === tab
                            ? 'font-bold' // Add font-bold for active tab
                            : 'text-gray-600 hover:bg-gray-100' // Default style for inactive tabs
                        }
                    `}
                    // Apply dynamic background and text color based on activeTab
                    style={activeTab === tab
                        ? { backgroundColor: brandColor, color: contrastTextColor }
                        : {} // No inline style for inactive tabs, rely on Tailwind classes
                    }
                >
                    {tab === 'SocialFeed' ? 'Social Feed' : tab} {/* Adjust display text for SocialFeed if needed */}
                </button>
            ))}
        </div>
    );
};

export default StoreTabs;