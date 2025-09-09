// src/pages/ManageCouponsPointsPage.jsx
import React, { useState } from 'react';

import ManageCouponsTab from '../../Dashboard/ManageCoupons/ManageCouponsTab';
import ManagePointsTab from '../../Dashboard/ManageCoupons/ManagePointsTab';
import CreateNewCouponModal from '../../models/CreateNewCouponModal';
import PointsSettingsModal from '../../models/PointsSettingsModal';
import EditCouponModal from '../../models/EditCouponModal';
import ScrollToTop from '../../ui/ScrollToTop';

import {
  useGetCouponsQuery,

  useGetCustomerPointsQuery,
  useGetPointsSummaryQuery,
  
} from '../../../services/queries/useCouponsQuery';

import{
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useUpdatePointsSettingsMutation

} from "../../../services/mutations/useCouponsMutation"

const ManageCouponsPointsPage = ({ brandColor = '#EF4444', contrastTextColor = '#fff', lightBrandColor = '#fecaca' }) => {
  const [activeTab, setActiveTab] = useState('coupons');
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [showPointsSettingsModal, setShowPointsSettingsModal] = useState(false);
  const [showEditCouponModal, setShowEditCouponModal] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState(null);

  // Queries
  const { data: coupons = [], isLoading: loadingCoupons } = useGetCouponsQuery();
  const { data: customerPoints = [], isLoading: loadingCustomers } = useGetCustomerPointsQuery();
  const { data: pointsSummary = { totalPointsBalance: 0 }, isLoading: loadingSummary } = useGetPointsSummaryQuery();

  // Mutations
  const createCouponMutation = useCreateCouponMutation();
  const updateCouponMutation = useUpdateCouponMutation();
  const deleteCouponMutation = useDeleteCouponMutation();
  const updatePointsSettingsMutation = useUpdatePointsSettingsMutation();

  // Handlers
  const handleOpenCreateCouponModal = () => setShowCreateCouponModal(true);
  const handleCloseCreateCouponModal = () => setShowCreateCouponModal(false);

  const handleOpenEditCouponModal = (coupon) => {
    setCouponToEdit(coupon);
    setShowEditCouponModal(true);
  };
  const handleCloseEditCouponModal = () => {
    setShowEditCouponModal(false);
    setCouponToEdit(null);
  };

  const handleSaveNewCoupon = (newCoupon) => {
    // newCoupon: { code, percentageOff, maxUsage, usagePerUser, expiryDate }
    createCouponMutation.mutate(newCoupon, {
      onSuccess: () => setShowCreateCouponModal(false),
      onError: (err) => console.error('Create coupon failed:', err),
    });
  };

  const handleSaveEditedCoupon = (updatedCoupon) => {
    // updatedCoupon: { id, code, percentageOff, maxUsage, usagePerUser, expiryDate }
    const { id, ...payload } = updatedCoupon;
    updateCouponMutation.mutate(
      { id, payload },
      {
        onSuccess: () => setShowEditCouponModal(false),
        onError: (err) => console.error('Update coupon failed:', err),
      }
    );
  };

  const handleDeleteCoupon = (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCouponMutation.mutate(couponId, {
        onError: (err) => console.error('Delete coupon failed:', err),
      });
    }
  };

  const handleOpenPointsSettingsModal = () => setShowPointsSettingsModal(true);
  const handleClosePointsSettingsModal = () => setShowPointsSettingsModal(false);

  const handleSavePointsSettings = (settings) => {
    updatePointsSettingsMutation.mutate(settings, {
      onSuccess: () => setShowPointsSettingsModal(false),
      onError: (err) => console.error('Update points settings failed:', err),
    });
  };

  const totalPointsBalance = pointsSummary?.totalPointsBalance || 0;

  return (
    <div className="p-4 md:p-8">
      <ScrollToTop />
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Coupons</h2>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'coupons' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
          }`}
          style={activeTab === 'coupons' ? { backgroundColor: brandColor, color: contrastTextColor } : {}}
          onClick={() => setActiveTab('coupons')}
        >
          Manage Coupons
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'points' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
          }`}
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
          loading={loadingCoupons || createCouponMutation.isLoading || updateCouponMutation.isLoading || deleteCouponMutation.isLoading}
          onOpenCreateCouponModal={handleOpenCreateCouponModal}
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
          onOpenPointsSettingsModal={handleOpenPointsSettingsModal}
          loading={loadingCustomers || loadingSummary || updatePointsSettingsMutation.isLoading}
        />
      )}

      {/* Modals */}
      {showCreateCouponModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
            <CreateNewCouponModal
              onClose={handleCloseCreateCouponModal}
              onSave={handleSaveNewCoupon}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}

      {showEditCouponModal && couponToEdit && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
            <EditCouponModal
              couponToEdit={couponToEdit}
              onClose={handleCloseEditCouponModal}
              onSave={handleSaveEditedCoupon}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}

      {showPointsSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-md">
            <PointsSettingsModal
              onClose={handleClosePointsSettingsModal}
              onSave={handleSavePointsSettings}
              brandColor={brandColor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCouponsPointsPage;