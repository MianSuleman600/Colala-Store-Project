// src/pages/ManageCouponsPointsPage.jsx
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
  useGetPointsSummaryQuery,
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
  const { data: customerPoints = [], isLoading: loadingCustomers } = useGetCustomerPointsQuery();
  const { data: pointsSummary = { totalPointsBalance: 0 }, isLoading: loadingSummary } = useGetPointsSummaryQuery();

  // Mutations
  const createCouponMutation = useCreateCouponMutation({
    onSuccess: () => {
      push('Coupon created successfully!', { type: 'success' });
      setShowCreateCouponModal(false);
    },
    onError: (err) => push(err.message || 'Failed to create coupon.', { type: 'error' }),
  });

  const updateCouponMutation = useUpdateCouponMutation({
    onSuccess: () => {
      push('Coupon updated successfully!', { type: 'success' });
      setShowEditCouponModal(false);
    },
    onError: (err) => push(err.message || 'Failed to update coupon.', { type: 'error' }),
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

  const handleOpenEditCouponModal = (coupon) => {
    setCouponToEdit(coupon);
    setShowEditCouponModal(true);
  };
  
  const handleSaveNewCoupon = (newCoupon) => createCouponMutation.mutate(newCoupon);
  const handleSaveEditedCoupon = (updatedCoupon) => {
    const { id, ...payload } = updatedCoupon;
    updateCouponMutation.mutate({ id, payload });
  };
  const handleDeleteCoupon = (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCouponMutation.mutate(couponId);
    }
  };

  const handleSavePointsSettings = (settings) => updatePointsSettingsMutation.mutate(settings);
  
  const isLoadingCouponsTab = loadingCoupons || createCouponMutation.isLoading || updateCouponMutation.isLoading || deleteCouponMutation.isLoading;
  const isLoadingPointsTab = loadingCustomers || loadingSummary || updatePointsSettingsMutation.isLoading;
  
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
          totalPointsBalance={pointsSummary?.totalPointsBalance || 0}
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