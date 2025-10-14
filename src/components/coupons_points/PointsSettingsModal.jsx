import React, { useState } from 'react';
import Button from '../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Toggle = ({ enabled, onChange, brandColor }) => (
  <button type="button" onClick={() => onChange(!enabled)} className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none" style={{ backgroundColor: enabled ? brandColor : '#e5e7eb' }}>
    <span className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform" style={{ transform: enabled ? 'translateX(20px)' : 'translateX(2px)' }} />
  </button>
);

const PointsSettingsModal = ({ onClose, onSave, isSubmitting, brandColor }) => {
  // State management for form inputs
  const [pointsPerCompletedOrder, setPointsPerCompletedOrder] = useState('');
  const [pointsPerReferral, setPointsPerReferral] = useState('');
  const [completedOrderPointsEnabled, setCompletedOrderPointsEnabled] = useState(true);
  const [referralPointsEnabled, setReferralPointsEnabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    // FIX: Convert data structure and types to match backend expectations (snake_case keys and string values for toggles)
    onSave({
      // Send numerical values as strings if the backend expects them that way, or just use the number
      points_per_order: pointsPerCompletedOrder ? parseInt(pointsPerCompletedOrder, 10) : 0,
      points_per_referral: pointsPerReferral ? parseInt(pointsPerReferral, 10) : 0,

      // Convert booleans (true/false) to string numbers ("1"/"0") as seen in the API response
      enable_order_points: completedOrderPointsEnabled ? "1" : "0",
      enable_referral_points: referralPointsEnabled ? "1" : "0",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Points Settings</h1>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input type="number" placeholder="Number of points/completed order" className="w-full px-4 py-3 border border-gray-300 rounded-lg" value={pointsPerCompletedOrder} onChange={(e) => setPointsPerCompletedOrder(e.target.value)} min="0" />
        </div>
        <div>
          <input type="number" placeholder="Number of points/referral" className="w-full px-4 py-3 border border-gray-300 rounded-lg" value={pointsPerReferral} onChange={(e) => setPointsPerReferral(e.target.value)} min="0" />
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700 font-medium">Completed Order Points</span>
          <Toggle enabled={completedOrderPointsEnabled} onChange={setCompletedOrderPointsEnabled} brandColor={brandColor} />
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700 font-medium">Referral Points</span>
          <Toggle enabled={referralPointsEnabled} onChange={setReferralPointsEnabled} brandColor={brandColor} />
        </div>

        <Button
          type="submit"
          style={{ backgroundColor: brandColor }}
          className="w-full py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </div>
  );
};

export default PointsSettingsModal;
