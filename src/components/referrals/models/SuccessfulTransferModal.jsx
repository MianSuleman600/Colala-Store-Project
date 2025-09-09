// src/components/referrals/models/SuccessfulTransferModal.jsx
import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const TransferSuccessModal = ({ isOpen, onClose, amount = 0, currency = '₦', brandColor = '#EF4444' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="flex flex-col items-center">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            You have successfully transferred {currency}
            {Intl.NumberFormat().format(amount)} to your shopping wallet
          </h2>
          <div className="flex w-full space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 text-gray-700 font-semibold border border-gray-300 rounded-xl"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-4 text-white font-semibold rounded-xl transition-colors"
              style={{ backgroundColor: brandColor }}
            >
              Go to wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferSuccessModal;