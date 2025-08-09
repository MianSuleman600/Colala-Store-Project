// src/components/coupons_points/EditCouponModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Close icon

/**
 * EditCouponModal Component
 * A modal form for editing an existing coupon code.
 * Pre-fills the form with the provided coupon data.
 *
 * @param {object} props
 * @param {object} props.couponToEdit - The coupon object to be edited.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onSave - Callback to save the edited coupon data.
 * @param {string} props.brandColor - The primary brand color for styling the save button.
 */
const EditCouponModal = ({ couponToEdit, onClose, onSave, brandColor }) => {
    // Initialize state with values from couponToEdit
    const [couponCodeName, setCouponCodeName] = useState(couponToEdit?.code || '');
    const [percentageOff, setPercentageOff] = useState(couponToEdit?.percentageOff || '');
    const [maximumUsage, setMaximumUsage] = useState(couponToEdit?.maxUsage || '');
    const [noOfUsagePerUser, setNoOfUsagePerUser] = useState(couponToEdit?.usagePerUser || '');
    const [expiryDate, setExpiryDate] = useState(couponToEdit?.expiryDate || '');

    // Optional: Use useEffect to update form fields if couponToEdit changes while modal is open
    useEffect(() => {
        if (couponToEdit) {
            setCouponCodeName(couponToEdit.code || '');
            setPercentageOff(couponToEdit.percentageOff || '');
            setMaximumUsage(couponToEdit.maxUsage || '');
            setNoOfUsagePerUser(couponToEdit.usagePerUser || '');
            setExpiryDate(couponToEdit.expiryDate || '');
        }
    }, [couponToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!couponCodeName || !percentageOff || !maximumUsage || !noOfUsagePerUser || !expiryDate) {
            alert('Please fill in all fields.'); // Replace with custom modal/toast
            return;
        }

        // Pass the updated coupon data, including its original ID
        onSave({
            ...couponToEdit, // Keep existing properties
            code: couponCodeName,
            percentageOff: parseFloat(percentageOff),
            maximumUsage: parseInt(maximumUsage, 10),
            noOfUsagePerUser: parseInt(noOfUsagePerUser, 10),
            expiryDate,
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Edit Coupon Code</h2>
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
                        value={maximumUsage}
                        onChange={(e) => setMaximumUsage(e.target.value)}
                        min="1"
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="No of usage / User"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={noOfUsagePerUser}
                        onChange={(e) => setNoOfUsagePerUser(e.target.value)}
                        min="1"
                    />
                </div>
                <div>
                    <label htmlFor="editExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry date</label>
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
