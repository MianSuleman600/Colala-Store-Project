import React, { useRef, useEffect } from 'react';
import { ChartBarIcon, CheckCircleIcon, NoSymbolIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';

const MoreOptionsPopover = ({
  isOpen,
  onClose,
  position,
  productId,
  onProductStatClick,
  onMarkAsSold,
  onBoostProduct,
  onMarkAsUnavailable,
  onDeleteProduct,
}) => {
  const popoverRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) onClose();
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('mousedown', onClick);
      document.addEventListener('keydown', onEsc);
    }
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const doAction = (cb) => {
    cb(productId);
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="absolute bg-white rounded-lg shadow-xl py-2 z-50 w-48 border border-gray-100"
      style={{ top: position.top, left: position.left }}
      role="menu"
      aria-orientation="vertical"
    >
      <ul className="text-sm text-gray-700">
        <li>
          <button onClick={() => doAction(onProductStatClick)} className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100">
            <ChartBarIcon className="h-4 w-4 mr-2 text-gray-500" /> Product Stat
          </button>
        </li>
        <li>
          <button onClick={() => doAction(onMarkAsSold)} className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100">
            <CheckCircleIcon className="h-4 w-4 mr-2 text-gray-500" /> Mark as Sold
          </button>
        </li>
        <li>
          <button onClick={() => doAction(onMarkAsUnavailable)} className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100">
            <NoSymbolIcon className="h-4 w-4 mr-2 text-gray-500" /> Mark as unavailable
          </button>
        </li>
        <li>
          <button onClick={() => doAction(onBoostProduct)} className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100">
            <ArrowPathIcon className="h-4 w-4 mr-2 text-gray-500" /> Boost Product
          </button>
        </li>
        {onDeleteProduct && (
          <>
            <hr className="my-1 border-gray-200" />
            <li>
              <button
                onClick={() => doAction(onDeleteProduct)}
                className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
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