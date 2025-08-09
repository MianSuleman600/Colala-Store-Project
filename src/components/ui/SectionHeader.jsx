// src/components/ui/SectionHeader.jsx
import React from 'react';

/**
 * SectionHeader Component
 * A simple component for consistent section titles.
 *
 * @param {object} props
 * @param {string} props.title - The title of the section.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes.
 */
const SectionHeader = ({ title, className = '' }) => {
    return (
        <h2 className={`text-xl font-bold text-gray-800 mb-4 ${className}`}>
            {title}
        </h2>
    );
};

export default SectionHeader;