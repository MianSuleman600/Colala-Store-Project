import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../ui/ToastProvider';
import { useReferralTransferMutation } from '../../../services/mutations/useReferralMutation';

const TransferModal = ({ isOpen, onClose, brandColor, onSuccess }) => {
  const { push } = useToast();
  const [amount, setAmount] = useState('');
  const { mutate: transfer, isLoading: isTransferring } = useReferralTransferMutation();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      push('Please enter a valid amount to transfer.', { type: 'error' });
      return;
    }

    transfer({ amount: amt }, {
      onSuccess: () => {
        onSuccess(amt); // Pass the amount back to the parent to show in the success modal
        onClose(); // Close this modal
      },
      // The onError toast is already handled in the mutation hook
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Transfer to Shopping Wallet</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Amount to transfer"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': brandColor }}
            required
          />
          <button
            type="submit"
            className="w-full py-4 text-white font-semibold rounded-xl transition-colors"
            style={{ backgroundColor: brandColor, opacity: isTransferring ? 0.7 : 1 }}
            disabled={isTransferring}
          >
            {isTransferring ? 'Processing...' : 'Transfer Funds'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;