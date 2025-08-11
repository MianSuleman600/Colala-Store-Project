// src/components/ui/SuccessModal.jsx
import React from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SuccessModal = ({ onClose }) => {
    return (
        // The modal overlay, which captures clicks outside the modal
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose} // Allows closing the modal by clicking the backdrop
        >
            {/* The modal content container */}
            <div
                className="relative w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-xl transition-all"
                role="dialog"
                aria-modal="true"
                aria-labelledby="success-modal-title"
                // Prevents the modal from closing when clicking inside it
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    aria-label="Close success message"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Success Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircleIcon className="h-10 w-10 text-green-600" />
                </div>
                
                {/* Modal Title and Message */}
                <h3 id="success-modal-title" className="mt-4 text-lg font-semibold text-gray-900">
                    Registration Successful!
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                    Your account has been created. You can now log in and start setting up your store.
                </p>

                {/* Action Button */}
                <div className="mt-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;