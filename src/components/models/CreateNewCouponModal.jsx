// src/components/coupons_points/CreateNewCouponModal.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Close icon

/**
 * CreateNewCouponModal Component
 * A modal form for creating a new coupon code.
 * Matches the design in 'image_e58e87.png'.
 *
 * @param {object} props
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onSave - Callback to save the new coupon data.
 * @param {string} props.brandColor - The primary brand color for styling the save button.
 */
const CreateNewCouponModal = ({ onClose, onSave, brandColor }) => {
    const [couponCodeName, setCouponCodeName] = useState('');
    const [percentageOff, setPercentageOff] = useState('');
    const [maximumUsage, setMaximumUsage] = useState('');
    const [noOfUsagePerUser, setNoOfUsagePerUser] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!couponCodeName || !percentageOff || !maximumUsage || !noOfUsagePerUser || !expiryDate) {
            alert('Please fill in all fields.'); // Replace with custom modal/toast
            return;
        }

        onSave({
            couponCodeName,
            percentageOff: parseFloat(percentageOff),
            maximumUsage: parseInt(maximumUsage, 10),
            noOfUsagePerUser: parseInt(noOfUsagePerUser, 10),
            expiryDate,
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold text-gray-800">Create new code</h1>
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
                {/* Replaced placeholder with a label for accessibility and better UX for type="date" */}
                <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry date</label>
                    <input
                        type="date"
                        id="expiryDate" // Added id to link with label
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
                    Save
                </Button>
            </form>
        </div>
    );
};

export default CreateNewCouponModal;
