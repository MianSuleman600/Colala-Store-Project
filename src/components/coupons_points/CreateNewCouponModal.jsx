// src/components/coupons_points/CreateNewCouponModal.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';

const CreateNewCouponModal = ({ onClose, onSave, isSubmitting, brandColor }) => {
  const { push } = useToast();
  const [couponCodeName, setCouponCodeName] = useState('');
  const [percentageOff, setPercentageOff] = useState('');
  const [maxUsage, setMaxUsage] = useState('');
  const [usagePerUser, setUsagePerUser] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!couponCodeName || !percentageOff || !maxUsage || !usagePerUser || !expiryDate) {
      push('Please fill in all fields.', { type: 'error' });
      return;
    }
    onSave({
      code: couponCodeName,
      percentageOff: parseFloat(percentageOff),
      maxUsage: parseInt(maxUsage, 10),
      usagePerUser: parseInt(usagePerUser, 10),
      expiryDate,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Create New Coupon</h1>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Coupon Code Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={couponCodeName}
            onChange={(e) => setCouponCodeName(e.target.value)}
          />
        </div>
        <div className="relative">
          <input
            type="number"
            placeholder="Percentage off"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={percentageOff}
            onChange={(e) => setPercentageOff(e.target.value)}
            min="1" max="100"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">%</span>
        </div>
        <div>
          <input
            type="number"
            placeholder="Maximum Usage"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={maxUsage}
            onChange={(e) => setMaxUsage(e.target.value)}
            min="1"
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="No of usage / User"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={usagePerUser}
            onChange={(e) => setUsagePerUser(e.target.value)}
            min="1"
          />
        </div>
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry date
          </label>
          <input
            type="date"
            id="expiryDate"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // Prevent past dates
          />
        </div>

        <Button
          type="submit"
          style={{ backgroundColor: brandColor }}
          className="w-full py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </div>
  );
};

export default CreateNewCouponModal;