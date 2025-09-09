import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

/**
 * Production-ready Reusable Modal Component
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls modal visibility.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {React.ReactNode} props.children - Modal body content.
 * @param {string|React.ReactNode} [props.title] - Title (can be text or custom JSX).
 * @param {string} [props.className] - Additional classes for modal container.
 * @param {string} [props.headerClassName] - Classes for the header container.
 * @param {string} [props.titleClassName] - Classes for the title.
 * @param {boolean} [props.showHeader=true] - Whether to display the header.
 * @param {React.ReactNode} [props.footer] - Optional footer content.
 * @param {string} [props.footerClassName] - Classes for the footer.
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  headerClassName = '',
  titleClassName = 'text-left', // Default left
  showHeader = true,
  footer,
  footerClassName = '',
}) => {
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
        {/* Header */}
        {showHeader && (
          <div
            className={`flex items-center justify-between p-4 border-b border-gray-200 ${headerClassName}`}
          >
            <h2
              className={`text-xl font-semibold text-gray-800 flex-1 ${titleClassName}`}
              style={{ fontFamily: 'Manrope' }}
            >
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
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className={`p-4 border-t border-gray-200 flex justify-end gap-2 ${footerClassName}`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
