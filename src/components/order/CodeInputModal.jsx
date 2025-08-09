import React, { useState } from 'react';
import Modal from '../ui/Modal'; // Assuming a generic Modal component exists
import Button from '../ui/Button'; // Assuming a generic Button component exists
import { getContrastTextColor } from '../../utils/colorUtils'; // A utility to determine text color

/**
 * CodeInputModal Component
 * A modal for users to input a customer code to confirm delivery.
 *
 * This version has been optimized for responsive design,
 * accessibility, and cleaner styling using Tailwind CSS.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback to close the modal without action.
 * @param {function} props.onProceed - Callback when the "Proceed" button is clicked, passes the entered code.
 * @param {string} props.brandColor - Primary brand color for styling.
 * @param {string} props.contrastTextColor - Text color for contrast.
 */
const CodeInputModal = ({ isOpen, onClose, onProceed, brandColor, contrastTextColor }) => {
    // State to hold the user's input code
    const [code, setCode] = useState('');
    // State to handle and display validation errors
    const [error, setError] = useState('');

    /**
     * Handles the "Proceed" button click.
     * Validates the input and calls the onProceed callback if valid.
     */
    const handleProceed = () => {
        // Simple validation: check if the code is not just whitespace
        if (code.trim() === '') {
            setError('Please enter a code.');
            return;
        }
        setError('');
        // Call the parent's handler with the validated code
        onProceed(code);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Input Customer Code"
            // Use a responsive max-width: sm: for small screens, md: for medium
            className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto rounded-xl shadow-2xl overflow-hidden"
            style={{ fontFamily: 'Manrope' }}
        >
            <div className="p-6 space-y-6">
                <label
                    htmlFor="customer-code"
                    className="sr-only sm:not-sr-only sm:font-[12px]"
                >
                    Customer Code
                </label>

                <input
                    id="customer-code"
                    type="text"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        // Clear the error message as soon as the user starts typing again
                        if (error) setError('');
                    }}
                    placeholder="Enter code here"
                    // Responsive text size and padding, and conditional border color
                    className={`w-full p-4 md:p-6 text-center text-3xl md:text-4xl lg:text-5xl border-2 rounded-xl transition-colors
                        focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50
                        ${error ? 'border-red-500' : 'border-gray-300'}`}
                />
                {/* Conditionally render the error message */}
                {error && (
                    <p className="text-red-500 text-sm md:text-base text-center font-medium">
                        {error}
                    </p>
                )}

                {/* Responsive button container */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                    <Button
                        onClick={onClose}
                        className="flex-1 py-3 px-6 rounded-xl font-semibold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                        Go Back
                    </Button>
                    <Button
                        onClick={handleProceed}
                        className="flex-1 py-3 px-6 rounded-xl font-semibold text-lg transition-colors"
                        style={{ backgroundColor: brandColor, color: contrastTextColor }}
                    >
                        Proceed
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CodeInputModal;
