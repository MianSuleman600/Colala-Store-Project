// src/components/coupons_points/ManageCouponsTab.jsx
import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import PencilIcon from '../../../assets/icons/Pencil.png';
import TrashIcon from '../../../assets/icons/delete.png';
import EditCouponModal from '../../models/EditCouponModal';

const ManageCouponsTab = ({
  coupons = [],
  brandColor,
  contrastTextColor,
  onOpenCreateCouponModal,
  onRequestEdit,
  onRequestDelete,
  loading = false,
}) => {
  const [localEdit, setLocalEdit] = useState({ open: false, coupon: null });

  const handleEditCoupon = (coupon) => {
    // Use inline modal if parent not handling edit, else delegate
    if (onRequestEdit) {
      onRequestEdit(coupon);
    } else {
      setLocalEdit({ open: true, coupon });
    }
  };

  const handleDeleteCoupon = (couponId) => {
    if (onRequestDelete) onRequestDelete(couponId);
  };

  return (
    <div>
      {loading && <div className="mb-4 text-sm text-gray-500">Processing...</div>}

      <div className="space-y-4 mb-8">
        {coupons.length === 0 ? (
          <Card className="p-6 text-center text-gray-600">No coupons created yet.</Card>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id} className="p-4 rounded-xl shadow-sm flex flex-col">
              <div className="w-full text-center border p-2 rounded-2xl border-gray-200 mb-4">
                <h3 className="text-2xl font-bold text-gray-800">{coupon.code}</h3>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Date Created</span>
                  <span className="font-medium text-gray-800">{coupon.dateCreated}</span>
                </div>
                <div className="flex justify-between">
                  <span>No of times used</span>
                  <span className="font-medium text-gray-800">{coupon.timesUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum Usage</span>
                  <span className="font-medium text-gray-800">{coupon.maxUsage}</span>
                </div>
                {coupon.percentageOff != null && (
                  <div className="flex justify-between">
                    <span>Percentage Off</span>
                    <span className="font-medium text-gray-800">{coupon.percentageOff}%</span>
                  </div>
                )}
                {coupon.usagePerUser != null && (
                  <div className="flex justify-between">
                    <span>Usage Per User</span>
                    <span className="font-medium text-gray-800">{coupon.usagePerUser}</span>
                  </div>
                )}
                {coupon.expiryDate && (
                  <div className="flex justify-between">
                    <span>Expiry Date</span>
                    <span className="font-medium text-gray-800">{coupon.expiryDate}</span>
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
        Create New
      </Button>

      {/* Note: Parent page is handling the edit modal with mutations; this local modal is fallback only */}
      {localEdit.open && !onRequestEdit && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
            <EditCouponModal
              couponToEdit={localEdit.coupon}
              onClose={() => setLocalEdit({ open: false, coupon: null })}
              onSave={() => setLocalEdit({ open: false, coupon: null })}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCouponsTab;