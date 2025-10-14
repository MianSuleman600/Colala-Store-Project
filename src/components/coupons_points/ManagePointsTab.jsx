// src/components/coupons_points/ManagePointsTab.jsx

import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * ManagePointsTab
 * Displays total points balance and a list of customer points.
 *
 * Props:
 * - totalPointsBalance: number - Total points balance (from backend)
 * - customerPoints: array - Array of customer objects with { user_id, name, profile_picture, points }
 * - brandColor: string - Primary color for gradients and highlights
 * - contrastTextColor: string - Text color to contrast the gradient background
 * - onOpenPointsSettingsModal: function - Callback to open points settings modal
 * - loading: boolean - Loading state for points data
 */
const ManagePointsTab = ({
  totalPointsBalance,
  customerPoints = [],
  brandColor = '#EF4444',
  contrastTextColor = '#FFFFFF',
  onOpenPointsSettingsModal,
  loading = false,
}) => {
  // Secondary gradient color for card background
  const gradientEndColor = '#8B008B';

  return (
    <div>
      {/* Total Points Balance Card */}
      <Card
        className="p-6 rounded-xl shadow-md mb-8"
        style={{
          background: `linear-gradient(to right, ${brandColor}, ${gradientEndColor})`,
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm font-medium" style={{ color: contrastTextColor }}>
              Total Points Balance
            </span>
            <span className="text-3xl font-bold" style={{ color: contrastTextColor }}>
              {Number(totalPointsBalance || 0).toLocaleString()}
            </span>
          </div>

          {/* Settings Button */}
          <Button
            onClick={onOpenPointsSettingsModal}
            className="py-2 px-4 rounded-lg font-semibold text-sm"
            style={{ backgroundColor: 'white', color: brandColor }}
          >
            Settings
          </Button>
        </div>
      </Card>

      {/* Loading indicator */}
      {loading && (
        <div className="mb-4 text-sm text-gray-500">Loading points data...</div>
      )}

      {/* Customers Points Section */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Customers Points</h3>
      <div className="space-y-3">
        {/* No customer points available */}
        {customerPoints.length === 0 ? (
          <Card className="p-6 text-center text-gray-600">
            No customer points data available.
          </Card>
        ) : (
          customerPoints.map((customer) => (
            <Card
              key={customer.user_id} // Unique key from backend
              className="p-3 rounded-xl shadow-sm flex items-center justify-between"
            >
              {/* Customer Info */}
              <div className="flex items-center">
                <img
                  src={
                    customer.profile_picture ||
                    'https://placehold.co/40x40/e0e0e0/000000?text=User'
                  }
                  alt={customer.name}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://placehold.co/40x40/e0e0e0/000000?text=User';
                  }}
                />
                <span className="text-gray-800 font-medium">{customer.name}</span>
              </div>

              {/* Customer Points */}
              <span className="font-semibold" style={{ color: brandColor }}>
                {customer.points}
              </span>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagePointsTab;
