// src/components/products/MoreOptionsPopover.jsx
import React, { useRef, useEffect } from 'react';
// Assuming Card component is robust, though we're styling the div directly here.
// If Card provides specific styling you want, you could wrap the div with <Card>
// import Card from '../ui/Card'; // Not directly used as a wrapper for styling in this version.

// Import necessary icons from Heroicons for the popover actions
import {
    ChartBarIcon,       // For Product Stat
    CheckCircleIcon,    // For Mark as Sold
    NoSymbolIcon,       // For Mark as Unavailable
    ArrowPathIcon,      // For Boost Product
    TrashIcon           // For Delete (if you decide to include it)
} from '@heroicons/react/24/outline';


/**
 * MoreOptionsPopover Component
 * A popover menu for additional product actions, triggered by the ellipsis icon.
 * Includes outside click detection to close the popover.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the popover.
 * @param {function} props.onClose - Callback to close the popover.
 * @param {object} props.position - { top: number, left: number } for positioning.
 * @param {string} props.productId - The ID of the product this popover is for.
 * @param {function} props.onProductStatClick - Callback for "Product Stat".
 * @param {function} props.onMarkAsSold - Callback for "Mark as Sold".
 * @param {function} props.onBoostProduct - Callback for "Boost Product".
 * @param {function} props.onMarkAsUnavailable - Callback for "Mark as unavailable".
 * @param {function} [props.onDeleteProduct] - Optional callback for "Delete".
 */
const MoreOptionsPopover = ({
    isOpen,
    onClose,
    position,
    productId,
    onProductStatClick,
    onMarkAsSold,
    onBoostProduct,
    onMarkAsUnavailable,
    onDeleteProduct, // Passed as an optional prop
}) => {
    const popoverRef = useRef(null);

    // Effect to handle clicks outside the popover to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click occurred outside the popover element
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                onClose(); // Close the popover
            }
        };

        if (isOpen) {
            // Add event listener when popover is open
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            // Clean up event listener when popover is closed
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup function for useEffect: remove event listener when component unmounts or isOpen changes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]); // Dependencies: re-run effect if isOpen or onClose changes

    // Do not render if the popover is not open
    if (!isOpen) return null;

    // Helper function to execute an action and then close the popover
    const handleActionClick = (actionCallback) => {
        actionCallback(productId); // Call the specific action with the product ID
        onClose(); // Always close the popover after an action is taken
    };

    return (
        // The main container for the popover, positioned absolutely
        <div
            ref={popoverRef} // Attach ref for outside click detection
            className="absolute bg-white rounded-lg shadow-xl py-2 z-50 w-48 border border-gray-100" // Added border for subtle definition
            style={{ top: position.top, left: position.left }}
        >
            <ul className="text-sm text-gray-700">
                {/* Product Stat option */}
                <li>
                    <button
                        onClick={() => handleActionClick(onProductStatClick)}
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                    >
                        <ChartBarIcon className="h-4 w-4 mr-2 text-gray-500" /> Product Stat
                    </button>
                </li>
                {/* Mark as Sold option */}
                <li>
                    <button
                        onClick={() => handleActionClick(onMarkAsSold)}
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                    >
                        <CheckCircleIcon className="h-4 w-4 mr-2 text-gray-500" /> Mark as Sold
                    </button>
                </li>
                {/* Mark as Unavailable option */}
                <li>
                    <button
                        onClick={() => handleActionClick(onMarkAsUnavailable)}
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                    >
                        <NoSymbolIcon className="h-4 w-4 mr-2 text-gray-500" /> Mark as unavailable
                    </button>
                </li>
                {/* Boost Product option */}
                <li>
                    <button
                        onClick={() => handleActionClick(onBoostProduct)}
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                    >
                        <ArrowPathIcon className="h-4 w-4 mr-2 text-gray-500" /> Boost Product
                    </button>
                </li>

                {/* Optional Delete Product action, rendered only if onDeleteProduct prop is provided */}
                {onDeleteProduct && (
                    <>
                        <hr className="my-1 border-gray-200" /> {/* Separator for destructive action */}
                        <li>
                            <button
                                onClick={() => handleActionClick(onDeleteProduct)}
                                className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-150"
                            >
                                <TrashIcon className="h-4 w-4 mr-2" /> Delete
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default MoreOptionsPopover;