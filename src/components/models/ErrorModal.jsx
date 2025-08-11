// src/components/ui/ErrorModal.jsx

import React from 'react';
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * A reusable modal component to display error messages.
 *
 * @param {object} props
 * @param {string} props.message - The error message to be displayed.
 * @param {function} props.onClose - Function to close the modal.
 */
const ErrorModal = ({ message, onClose }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-xl transition-all"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="error-modal-title"
                aria-describedby="error-modal-description"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    aria-label="Close error message"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Error Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <ExclamationCircleIcon className="h-10 w-10 text-red-600" />
                </div>
                
                {/* Modal Title and Message */}
                <h3 id="error-modal-title" className="mt-4 text-lg font-semibold text-gray-900">
                    Something went wrong
                </h3>
                <p id="error-modal-description" className="mt-2 text-sm text-gray-500">
                    {message}
                </p>

                {/* Action Button */}
                <div className="mt-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;