// src/components/coupons_points/ManageCouponsTab.jsx
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
// Changed: Import icons from local asset paths
import PencilIcon from '../../assets/icons/Pencil.png'; // Assuming this path is correct
import TrashIcon from '../../assets/icons/delete.png'; // Assuming this path is correct
import EditCouponModal from '../models/EditCouponModal'; // Corrected import path for EditCouponModal

/**
 * ManageCouponsTab Component
 * Displays a list of coupon codes with their details and actions.
 * Includes a button to create a new coupon.
 * Matches the design in 'image_e58e84.png' (overall page) and 'image_f06b95.png' (individual card layout).
 *
 * @param {object} props
 * @param {Array<object>} props.coupons - An array of coupon objects.
 * @param {function} props.setCoupons - Function to update the parent's coupons state.
 * @param {string} props.brandColor - The primary brand color for styling.
 * @param {string} props.contrastTextColor - The text color that contrasts well with brandColor.
 * @param {function} props.onOpenCreateCouponModal - Callback to open the create new coupon modal.
 */
const ManageCouponsTab = ({ coupons, setCoupons, brandColor, contrastTextColor, onOpenCreateCouponModal }) => {
    // State for managing the Edit Coupon Modal
    const [showEditCouponModal, setShowEditCouponModal] = useState(false);
    const [couponToEdit, setCouponToEdit] = useState(null);

    const handleEditCoupon = (couponId) => {
        console.log('handleEditCoupon called for ID:', couponId);
        const coupon = coupons.find(c => c.id === couponId);
        if (coupon) {
            console.log('Found coupon to edit:', coupon);
            setCouponToEdit(coupon);
            setShowEditCouponModal(true);
            console.log('showEditCouponModal set to true.');
        } else {
            console.log('Coupon not found for ID:', couponId);
        }
    };

    const handleCloseEditCouponModal = () => {
        console.log('Closing Edit Coupon Modal');
        setShowEditCouponModal(false);
        setCouponToEdit(null); // Clear the coupon to edit
    };

    const handleSaveEditedCoupon = (updatedCoupon) => {
        console.log('Saving edited coupon:', updatedCoupon);
        setCoupons(prevCoupons =>
            prevCoupons.map(coupon =>
                coupon.id === updatedCoupon.id ? updatedCoupon : coupon
            )
        );
        setShowEditCouponModal(false);
    };

    const handleDeleteCoupon = (couponId) => {
        console.log(`Deleting coupon: ${couponId}`);
        if (window.confirm(`Are you sure you want to delete coupon ${couponId}?`)) {
            alert(`Coupon ${couponId} deleted!`); // Replace with custom modal
            setCoupons(prevCoupons => prevCoupons.filter(coupon => coupon.id !== couponId));
        }
    };

    return (
        <div>
            {/* Coupons List */}
            <div className="space-y-4 mb-8">
                {coupons.length === 0 ? (
                    <Card className="p-6 text-center text-gray-600">No coupons created yet.</Card>
                ) : (
                    coupons.map(coupon => (
                        <Card key={coupon.id} className="p-4 rounded-xl shadow-sm flex flex-col">
                            {/* Coupon Code - Prominently displayed */}
                            <div className="w-full text-center border p-2 rounded-2xl border-gray-200 mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">{coupon.code}</h3>
                            </div>

                            {/* Coupon Details - Left label, right value */}
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Date Created</span>
                                    <span className="font-medium text-gray-800">{coupon.dateCreated}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>No if times used</span>
                                    <span className="font-medium text-gray-800">{coupon.timesUsed}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Maximum Usage</span>
                                    <span className="font-medium text-gray-800">{coupon.maxUsage}</span>
                                </div>
                                {/* Display Percentage Off and Usage Per User if available */}
                                {coupon.percentageOff && (
                                    <div className="flex justify-between">
                                        <span>Percentage Off</span>
                                        <span className="font-medium text-gray-800">{coupon.percentageOff}%</span>
                                    </div>
                                )}
                                {coupon.usagePerUser && (
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

                            {/* Action Buttons - Aligned to bottom left */}
                            <div className="flex space-x-2 mt-auto">
                                <Button
                                    onClick={() => handleEditCoupon(coupon.id)}
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

            {/* Create New Button */}
            <Button
                onClick={onOpenCreateCouponModal}
                style={{ backgroundColor: brandColor, color: contrastTextColor }}
                className="w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
            >
                Create New
            </Button>

            {/* Edit Coupon Modal */}
            {showEditCouponModal && couponToEdit && (
                <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
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
        </div>
    );
};

export default ManageCouponsTab;
