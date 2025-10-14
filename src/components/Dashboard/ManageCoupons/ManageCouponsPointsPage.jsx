import React, { useState } from 'react';
import { useToast } from '../../../components/ui/ToastProvider';
import ManageCouponsTab from '../../../components/coupons_points/ManageCouponsTab';
import ManagePointsTab from '../../../components/coupons_points/ManagePointsTab';
import CreateNewCouponModal from '../../../components/coupons_points/CreateNewCouponModal';
import PointsSettingsModal from '../../../components/coupons_points/PointsSettingsModal';
import EditCouponModal from '../../../components/coupons_points/EditCouponModal';
import ScrollToTop from '../../../components/ui/ScrollToTop';

import {
  useGetCouponsQuery,
  useGetCustomerPointsQuery,
  useGetPointsSettingsQuery,
} from '../../../services/queries/useCouponsQuery';

import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useUpdatePointsSettingsMutation
} from "../../../services/mutations/useCouponsMutation";

const ManageCouponsPointsPage = ({ brandColor = '#EF4444', contrastTextColor = '#fff' }) => {
  const [activeTab, setActiveTab] = useState('coupons');
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [showPointsSettingsModal, setShowPointsSettingsModal] = useState(false);
  const [showEditCouponModal, setShowEditCouponModal] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState(null);
  const { push } = useToast();

  // Queries
  const { data: coupons = [], isLoading: loadingCoupons } = useGetCouponsQuery();
  const { data: pointsData, isLoading: loadingCustomers } = useGetCustomerPointsQuery();
  const { data: pointsSettings = {}, isLoading: loadingSettings } = useGetPointsSettingsQuery();

  // FIXED: The service function already returns the inner `data` object,
  // so we destructure directly from `pointsData` itself.
  const { customers: customerPoints = [], total_points_balance: totalPointsBalance = 0 } = pointsData || {};

  // Mutations
  const createCouponMutation = useCreateCouponMutation({
    onSuccess: (res) => {
      push('Coupon created successfully!', { type: 'success' });
      setShowCreateCouponModal(false);
    },
    onError: (err) => {
      const errorMessage = err?.message || err?.data?.message || 'Failed to create coupon.';
      push(errorMessage, { type: 'error' });
    },
  });

  const updateCouponMutation = useUpdateCouponMutation({
    onSuccess: () => {
      push('Coupon updated successfully!', { type: 'success' });
      setShowEditCouponModal(false);
    },
    onError: (err) => {
      const errorMessage = err?.message || err?.data?.message || 'Failed to update coupon.';
      push(errorMessage, { type: 'error' });
    },
  });

  const deleteCouponMutation = useDeleteCouponMutation({
    onSuccess: () => push('Coupon deleted.', { type: 'success' }),
    onError: (err) => push(err.message || 'Failed to delete coupon.', { type: 'error' }),
  });

  const updatePointsSettingsMutation = useUpdatePointsSettingsMutation({
    onSuccess: () => {
      push('Points settings saved.', { type: 'success' });
      setShowPointsSettingsModal(false);
    },
    onError: (err) => push(err.message || 'Failed to save settings.', { type: 'error' }),
  });

  const normalizeCouponPayload = (coupon) => ({
    code: coupon.code,
    discount_type: coupon.discount_type || 1,
    discount_value: parseFloat(coupon.discount_value),
    max_usage: parseInt(coupon.max_usage, 10),
    usage_per_user: parseInt(coupon.usage_per_user, 10),
    expiry_date: coupon.expiry_date || null,
  });

  const handleOpenEditCouponModal = (coupon) => {
    setCouponToEdit(coupon);
    setShowEditCouponModal(true);
  };

  const handleSaveNewCoupon = (newCoupon) => {
    createCouponMutation.mutate(normalizeCouponPayload(newCoupon));
  };

  const handleSaveEditedCoupon = (updatedCoupon) => {
    const { id, ...rest } = updatedCoupon;
    updateCouponMutation.mutate({ id, payload: normalizeCouponPayload(rest) });
  };

  const handleDeleteCoupon = (couponId) => {
    console.warn('A custom confirmation modal should appear here before deletion.');
    deleteCouponMutation.mutate(couponId);
  };

  const handleSavePointsSettings = (settings) => updatePointsSettingsMutation.mutate(settings);

  const isLoadingCouponsTab = loadingCoupons || createCouponMutation.isLoading || updateCouponMutation.isLoading || deleteCouponMutation.isLoading;
  const isLoadingPointsTab = loadingCustomers || loadingSettings || updatePointsSettingsMutation.isLoading;

  return (
    <div className="p-4 md:p-8">
      <ScrollToTop />
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Coupons & Points</h2>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'coupons' ? 'bg-white shadow' : 'text-gray-600'}`}
          style={activeTab === 'coupons' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
          onClick={() => setActiveTab('coupons')}
        >
          Manage Coupons
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'points' ? 'bg-white shadow' : 'text-gray-600'}`}
          style={activeTab === 'points' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
          onClick={() => setActiveTab('points')}
        >
          Manage Points
        </button>
      </div>

      {activeTab === 'coupons' && (
        <ManageCouponsTab
          coupons={coupons}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
          loading={isLoadingCouponsTab}
          onOpenCreateCouponModal={() => setShowCreateCouponModal(true)}
          onRequestEdit={handleOpenEditCouponModal}
          onRequestDelete={handleDeleteCoupon}
        />
      )}

      {activeTab === 'points' && (
        <ManagePointsTab
          totalPointsBalance={totalPointsBalance}
          customerPoints={customerPoints}
          brandColor={brandColor}
          contrastTextColor={contrastTextColor}
          onOpenPointsSettingsModal={() => setShowPointsSettingsModal(true)}
          loading={isLoadingPointsTab}
        />
      )}

      {showCreateCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
            <CreateNewCouponModal
              onClose={() => setShowCreateCouponModal(false)}
              onSave={handleSaveNewCoupon}
              isSubmitting={createCouponMutation.isLoading}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}

      {showEditCouponModal && couponToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
            <EditCouponModal
              couponToEdit={couponToEdit}
              onClose={() => setShowEditCouponModal(false)}
              onSave={handleSaveEditedCoupon}
              isSubmitting={updateCouponMutation.isLoading}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}

      {showPointsSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
            <PointsSettingsModal
              initialSettings={pointsSettings}
              onClose={() => setShowPointsSettingsModal(false)}
              onSave={handleSavePointsSettings}
              isSubmitting={updatePointsSettingsMutation.isLoading}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCouponsPointsPage;