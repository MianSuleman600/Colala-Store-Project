// src/components/ui/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react'; // Close icon

/**
 * Reusable Modal Component
 * Displays content in a centered, overlayed dialog.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function when the modal is requested to close.
 * @param {React.ReactNode} props.children - The content to display inside the modal.
 * @param {string} [props.title] - Optional title for the modal header.
 * @param {string} [props.className] - Additional CSS classes for the modal content area.
 */
const Modal = ({ isOpen, onClose, children, title, className }) => {

    console.log('Modal component is rendering. isOpen:', isOpen, 'title:', title); // ADD THIS LINE

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 backdrop-blur-sm z-50 rounded-2xl flex items-center justify-center bg-opacity-70 p-4" onClick={onClose}>
            <div className='p-4 rounded-2xl'>
                <div
                    // Apply 'flex flex-col' here so that children are direct flex items
                    // Remove overflow-y-auto from here as the child (comments list) will handle it
                    className={`bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] transform transition-all duration-300 scale-100 opacity-100 relative flex flex-col ${className}`}
                    onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing modal
                >
                    {/* Modal Header */}
                    <div className="relative top-0 bg-white p-4 mb-4 z-10 flex-shrink-0"> {/* Add flex-shrink-0 */}
                        {/* Centered Title */}
                        <h2 className="text-xl text-gray-800 absolute left-1/2 transform -translate-x-1/2" style={{ fontFamily: 'Manrope' }}>
                            {title}
                        </h2>

                        {/* Close Button on Right */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 mt-4 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Body - children are now direct flex items */}
                    {children} {/* Removed the extra wrapping div around children */}

                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;