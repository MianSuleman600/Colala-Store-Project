// src/components/coupons_points/EditCouponModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../ui/ToastProvider';

const EditCouponModal = ({ couponToEdit, onClose, onSave, isSubmitting, brandColor }) => {
  const { push } = useToast();

  const [couponCodeName, setCouponCodeName] = useState('');
  // Initialize state with the numeric type (1 or 2) from the backend
  const [discountType, setDiscountType] = useState(1);
  const [discountValue, setDiscountValue] = useState('');
  const [maxUsage, setMaxUsage] = useState('');
  const [usagePerUser, setUsagePerUser] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    if (couponToEdit) {
      setCouponCodeName(couponToEdit.code || '');
      // Parse discount_type as an integer
      setDiscountType(parseInt(couponToEdit.discount_type) || 1);
      setDiscountValue(couponToEdit.discount_value || '');
      setMaxUsage(couponToEdit.max_usage || '');
      setUsagePerUser(couponToEdit.usage_per_user || '');
      // Format the date correctly for the input type="date"
      const date = couponToEdit.expiry_date ? new Date(couponToEdit.expiry_date) : null;
      setExpiryDate(date ? date.toISOString().split('T')[0] : '');
    }
  }, [couponToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Removed redundant client-side validation. Rely on backend for robust validation.
    // The 'required' attribute on inputs provides basic UX validation.

    onSave({
      id: couponToEdit.id,
      code: couponCodeName,
      discount_type: discountType, // Already the correct number (1 or 2)
      discount_value: parseFloat(discountValue),
      max_usage: parseInt(maxUsage, 10),
      usage_per_user: parseInt(usagePerUser, 10),
      expiry_date: expiryDate || null, // Ensure null is passed if empty
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={couponCodeName}
            onChange={(e) => setCouponCodeName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Discount Type</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={discountType} // Value is the numeric state
            onChange={(e) => setDiscountType(parseInt(e.target.value))} // Convert back to number on change
          >
            <option value={1}>Percentage Discount (%)</option>
            <option value={2}>Fixed Amount</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder={discountType === 1 ? "Discount Percentage" : "Discount Amount"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            min="1"
            required
          />
          {discountType === 1 && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              %
            </span>
          )}
        </div>

        <div>
          <input
            type="number"
            placeholder="Maximum Usage"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={maxUsage}
            onChange={(e) => setMaxUsage(e.target.value)}
            min="1"
            required
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="No of usage / User"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={usagePerUser}
            onChange={(e) => setUsagePerUser(e.target.value)}
            min="1"
            required
          />
        </div>

        <div>
          <label htmlFor="editExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date (Optional)
          </label>
          <input
            type="date"
            id="editExpiryDate"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            // Minimum date prevents selecting today or past, aligning with backend 'after:today'
            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
          />
        </div>

        <Button
          type="submit"
          style={{ backgroundColor: brandColor }}
          className="w-full py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default EditCouponModal;