import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

/**
 * Merge default Tailwind classes with user-provided classes.
 * If the user provides a conflicting utility, it overrides the default.
 */
const mergeClasses = (defaults, userClass) => {
  if (!userClass) return defaults;

  const defaultsArr = defaults.split(' ');
  const userArr = userClass.split(' ');

  const tailwindKeys = userArr.map(cls => cls.split('-')[0]); // crude, but works for width, padding, margin
  const filteredDefaults = defaultsArr.filter(
    cls => !tailwindKeys.includes(cls.split('-')[0])
  );

  return [...filteredDefaults, ...userArr].join(' ');
};

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  headerClassName = '',
  titleClassName = 'text-left',
  showHeader = true,
  footer,
  footerClassName = '',
}) => {
  if (!isOpen) return null;

  // Default classes
  const defaultModalClasses =
    'bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] transform transition-all duration-300 scale-100 opacity-100 flex flex-col';

  const defaultHeaderClasses = 'flex items-center justify-between p-4 border-b border-gray-200';
  const defaultFooterClasses = 'p-4 border-t border-gray-200 flex justify-end gap-2';

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={mergeClasses(defaultModalClasses, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {showHeader && (
          <div className={mergeClasses(defaultHeaderClasses, headerClassName)}>
            <h2 className={`${titleClassName} text-xl font-semibold text-gray-800 flex-1`} style={{ fontFamily: 'Manrope' }}>
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
          <div className={mergeClasses(defaultFooterClasses, footerClassName)}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
