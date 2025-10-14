import React, { useState } from 'react';
import { X } from 'lucide-react';

const PaymentMethodModal = ({ 
  isOpen, 
  onClose, 
  onProceed, 
  walletBalance = 0, 
  isLoading = false 
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet');

  if (!isOpen) return null;

  const handleProceed = () => {
    onProceed(selectedPaymentMethod);
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Wallet Balance Section */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-red-500 to-purple-600 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm opacity-90">Wallet Balance</p>
                <p className="text-white text-2xl font-bold">
                  {formatBalance(walletBalance)}
                </p>
              </div>
              <button className="bg-pink-200 text-pink-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-300 transition-colors">
                Top Up
              </button>
            </div>
          </div>

          {/* Payment Method Options */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Payment Method</h3>
            
            {/* Flutterwave Option */}
            <div 
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPaymentMethod === 'flutterwave' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPaymentMethod('flutterwave')}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r from-red-500 via-orange-500 to-green-500">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-gray-900 font-medium">Flutterwave</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedPaymentMethod === 'flutterwave' 
                  ? 'border-red-500 bg-red-500' 
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'flutterwave' && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>

            {/* My Wallet Option */}
            <div 
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPaymentMethod === 'wallet' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPaymentMethod('wallet')}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <span className="text-gray-900 font-medium">My Wallet</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedPaymentMethod === 'wallet' 
                  ? 'border-red-500 bg-red-500' 
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'wallet' && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </div>

          {/* Card Binding Section */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-600 text-sm mb-4">
              For recurrent payments where you will be debited automatically you can bind a card and it will show up here
            </p>
            <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors">
              Bind now
            </button>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
