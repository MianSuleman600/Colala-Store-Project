import React from 'react';

const SidebarMenuItem = ({ item, isActive, onClick, brandColor, contrastTextColor }) => {
    // Style the active item with the brand color and contrasting text
    const activeStyles = isActive
        ? { backgroundColor: brandColor, color: contrastTextColor }
        : {};

    const handleItemClick = () => {
        // This is the crucial step: calling the 'onClick' prop
        // with the item's name to update the parent's state.
        console.log('SidebarMenuItem clicked:', item.name);
        onClick(item.name);
    };

    return (
        <button
            onClick={handleItemClick}
            className={`
                flex items-center gap-3 p-3 rounded-xl w-full text-left transition-colors duration-200
                ${isActive ? 'font-semibold' : 'text-gray-700 hover:bg-gray-200'}
                ${item.type === 'danger' ? 'text-red-500 hover:bg-red-100' : ''}
            `}
            style={activeStyles}
        >
            {item.icon}
            <span>{item.name}</span>
        </button>
    );
};

export default SidebarMenuItem;