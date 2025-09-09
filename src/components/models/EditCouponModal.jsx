// src/components/coupons_points/EditCouponModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EditCouponModal = ({ couponToEdit, onClose, onSave, brandColor }) => {
  const [couponCodeName, setCouponCodeName] = useState(couponToEdit?.code || '');
  const [percentageOff, setPercentageOff] = useState(couponToEdit?.percentageOff || '');
  const [maxUsage, setMaxUsage] = useState(couponToEdit?.maxUsage || '');
  const [usagePerUser, setUsagePerUser] = useState(couponToEdit?.usagePerUser || '');
  const [expiryDate, setExpiryDate] = useState(couponToEdit?.expiryDate || '');

  useEffect(() => {
    if (couponToEdit) {
      setCouponCodeName(couponToEdit.code || '');
      setPercentageOff(couponToEdit.percentageOff || '');
      setMaxUsage(couponToEdit.maxUsage || '');
      setUsagePerUser(couponToEdit.usagePerUser || '');
      setExpiryDate(couponToEdit.expiryDate || '');
    }
  }, [couponToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!couponCodeName || !percentageOff || !maxUsage || !usagePerUser || !expiryDate) {
      alert('Please fill in all fields.');
      return;
    }
    onSave({
      id: couponToEdit.id,
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
        <h2 className="text-xl font-semibold text-gray-800">Edit Coupon Code</h2>
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
            min="0"
            max="100"
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
          <label htmlFor="editExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry date
          </label>
          <input
            type="date"
            id="editExpiryDate"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          style={{ backgroundColor: brandColor }}
          className="w-full py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-shadow"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditCouponModal;