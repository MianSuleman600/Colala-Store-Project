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

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] transform transition-all duration-300 scale-100 opacity-100 flex flex-col ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 flex-shrink-0 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Manrope' }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;