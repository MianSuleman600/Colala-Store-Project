// src/components/coupons_points/PointsSettingsModal.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Close icon

/**
 * PointsSettingsModal Component
 * A modal form for configuring points earning settings, such as points per order
 * and points per referral, with toggle switches.
 * Matches the design in 'image_e58e88.png'.
 *
 * @param {object} props
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onSave - Callback to save the points settings.
 * @param {string} props.brandColor - The primary brand color for styling the save button.
 */
const PointsSettingsModal = ({ onClose, onSave, brandColor }) => {
    const [pointsPerCompletedOrder, setPointsPerCompletedOrder] = useState('');
    const [pointsPerReferral, setPointsPerReferral] = useState('');
    const [completedOrderPointsEnabled, setCompletedOrderPointsEnabled] = useState(true);
    const [referralPointsEnabled, setReferralPointsEnabled] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            pointsPerCompletedOrder: pointsPerCompletedOrder ? parseInt(pointsPerCompletedOrder, 10) : 0,
            pointsPerReferral: pointsPerReferral ? parseInt(pointsPerReferral, 10) : 0,
            completedOrderPointsEnabled,
            referralPointsEnabled,
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold text-gray-800">Points settings</h1>
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
                        type="number"
                        placeholder="Number of points/completed order"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={pointsPerCompletedOrder}
                        onChange={(e) => setPointsPerCompletedOrder(e.target.value)}
                        min="0"
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Number of points/referral"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={pointsPerReferral}
                        onChange={(e) => setPointsPerReferral(e.target.value)}
                        min="0"
                    />
                </div>

                {/* Toggle Switches */}
                <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700 font-medium">Completed Order Points</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={completedOrderPointsEnabled}
                            onChange={(e) => setCompletedOrderPointsEnabled(e.target.checked)}
                        />
                        <div className={`w-11 h-6 rounded-full peer ${
                            completedOrderPointsEnabled ? `bg-${brandColor.replace('#', '')}-500` : 'bg-gray-200'
                        } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`}></div>
                    </label>
                </div>

                <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700 font-medium">Referral Points</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={referralPointsEnabled}
                            onChange={(e) => setReferralPointsEnabled(e.target.checked)}
                        />
                        <div className={`w-11 h-6 rounded-full peer ${
                            referralPointsEnabled ? `bg-${brandColor.replace('#', '')}-500` : 'bg-gray-200'
                        } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`}></div>
                    </label>
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

export default PointsSettingsModal;
