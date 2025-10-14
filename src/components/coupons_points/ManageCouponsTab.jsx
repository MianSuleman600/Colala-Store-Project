// src/components/coupons_points/ManageCouponsTab.jsx
import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import PencilIcon from '../../assets/icons/Pencil.png';
import TrashIcon from '../../assets/icons/delete.png';

const ManageCouponsTab = ({
  coupons = [],
  brandColor,
  contrastTextColor,
  onOpenCreateCouponModal,
  onRequestEdit,
  onRequestDelete,
  loading = false,
}) => {

  const handleEditCoupon = (coupon) => {
    // Pass the coupon object to the edit modal handler
    onRequestEdit?.(coupon);
  };

  const handleDeleteCoupon = (couponId) => {
    onRequestDelete?.(couponId);
  };

  // Helper function to format the discount display string
  const formatDiscount = (type, value) => {
    // 1 is Percentage, 2 is Fixed (based on CouponRequest.php)
    if (type === 1) {
      return `${value}% off`;
    }
    if (type === 2) {
      // Assuming a currency symbol (e.g., $) for fixed, adjust as needed
      return `$${parseFloat(value).toFixed(2)} off`;
    }
    return 'N/A';
  };

  // Helper function to convert Laravel's timestamps to readable dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Ensure dateString is not just the date, if it includes time/timezone, use it
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <div>
      {loading && coupons.length === 0 && (
        <div className="mb-4 text-sm text-gray-500 text-center">Loading coupons...</div>
      )}

      <div className="space-y-4 mb-8">
        {!loading && coupons.length === 0 ? (
          <Card className="p-6 text-center text-gray-600">No coupons have been created yet.</Card>
        ) : (
          coupons.map((coupon) => (
            // Use coupon.id for the key as it is a unique identifier
            <Card key={coupon.id} className="p-4 rounded-xl shadow-sm flex flex-col">
              <div className="w-full text-center border p-2 rounded-2xl border-gray-200 mb-4">
                <h3 className="text-2xl font-bold text-gray-800 tracking-wider">{coupon.code}</h3>
                {/* Display the discount value and type in a clear way */}
                <p className="text-sm text-red-600 font-semibold mt-1">
                  {formatDiscount(coupon.discount_type, coupon.discount_value)}
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Date Created</span>
                  {/* Uses standard Laravel created_at timestamp */}
                  <span className="font-medium text-gray-800">{formatDate(coupon.created_at)}</span>
                </div>

                {/* KEEPING: Based on the previous context, 'Times Used' maps to the backend field 
                  'times_used', which is standard for coupon tracking. 
                */}
                <div className="flex justify-between">
                  <span>Times Used</span>
                  <span className="font-medium text-gray-800">{coupon.times_used}</span>
                </div>

                <div className="flex justify-between">
                  <span>Maximum Usage</span>
                  {/* Uses coupon.max_usage (Total usage limit) */}
                  <span className="font-medium text-gray-800">{coupon.max_usage}</span>
                </div>

                <div className="flex justify-between">
                  <span>Usage Per User</span>
                  {/* Uses coupon.usage_per_user (Per customer limit) */}
                  <span className="font-medium text-gray-800">{coupon.usage_per_user}</span>
                </div>

                {coupon.expiry_date && (
                  <div className="flex justify-between">
                    <span>Expiry Date</span>
                    {/* Uses coupon.expiry_date (Optional expiry date) */}
                    <span className="font-medium text-gray-800">{formatDate(coupon.expiry_date)}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-auto">
                <Button
                  onClick={() => handleEditCoupon(coupon)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                  aria-label="Edit Coupon"
                >
                  <img src={PencilIcon} alt="Edit" className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-red-600"
                  aria-label="Delete Coupon"
                >
                  <img src={TrashIcon} alt="Delete" className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Button
        onClick={onOpenCreateCouponModal}
        style={{ backgroundColor: brandColor, color: contrastTextColor }}
        className="w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
      >
        Create New Coupon
      </Button>
    </div>
  );
};

export default ManageCouponsTab;