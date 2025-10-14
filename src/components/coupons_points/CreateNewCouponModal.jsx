// src/components/coupons_points/CreateNewCouponModal.jsx
import React, { useState } from "react";
import Button from "../ui/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useToast } from "../ui/ToastProvider";

const CreateNewCouponModal = ({ onClose, onSave, isSubmitting, brandColor }) => {
  const { push } = useToast();
  const [couponCodeName, setCouponCodeName] = useState("");
  // Use string state for the select input ('percentage' or 'fixed')
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [maxUsage, setMaxUsage] = useState("");
  const [usagePerUser, setUsagePerUser] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Map UI string value to backend integer value: 1=Percentage, 2=Fixed
    const typeMap = {
      percentage: 1,
      fixed: 2
    };

    // Construct the snake_case payload required by the backend
    const payload = {
      code: couponCodeName,
      discount_type: typeMap[discountType], // Converted to 1 or 2
      discount_value: Number(discountValue),
      max_usage: Number(maxUsage),
      usage_per_user: Number(usagePerUser),
      // Send empty string as null, matching backend's nullable rule
      expiry_date: expiryDate || null,
    };

    // console.log('Submitting coupon payload:', payload); // Debug removed for production

    onSave(payload);
  };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Create New Coupon
        </h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
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
            required // Add HTML required attribute for better UX/basic validation
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Discount Type</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="Discount Value"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            min="1"
            required // Matches backend rule 'min:1'
          />
          {discountType === "percentage" && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              %
            </span>
          )}
        </div>

        <div>
          <input
            type="number"
            placeholder="Maximum Usage"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={maxUsage}
            onChange={(e) => setMaxUsage(e.target.value)}
            min="1"
            required // Matches backend rule 'min:1'
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
            required // Matches backend rule 'min:1'
          />
        </div>

        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry date (Optional)
          </label>
          <input
            type="date"
            id="expiryDate"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
};

export default CreateNewCouponModal;