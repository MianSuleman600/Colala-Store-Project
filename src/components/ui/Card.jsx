// src/components/ui/Card.jsx
import React from 'react';

/**
 * Card Component
 * A generic container for content, with common styling like shadow and rounded corners.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to be rendered inside the card.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes for customization.
 * @param {function} [props.onClick] - Optional: Callback function when the card is clicked.
 */
const Card = ({ children, className = '', onClick, style }) => { // Added 'style' to props destructuring
    return (
        <div
            // Removed 'bg-white' class here to allow inline background styles to work
            className={`rounded-4xl shadow-[0_4px_12px_rgba(0,0,0,0.2)] ${className}`}
            onClick={onClick}
            style={style} // Apply the style prop to the div
            // 3. (Optional but HIGHLY Recommended for accessibility)
            // If this card is *intended* to be clickable like a button,
            // add ARIA role and keyboard navigation handlers.
            role={onClick ? "button" : undefined} // Only add role if it's actually clickable
            tabIndex={onClick ? "0" : undefined} // Make it focusable by keyboard if clickable
            onKeyDown={onClick ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Prevent default scroll for space bar
                    onClick();
                }
            } : undefined}
        >
            {children}
        </div>
    );
};

export default Card;
